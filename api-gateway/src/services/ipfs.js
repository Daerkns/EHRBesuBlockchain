const { create } = require('ipfs-http-client');
const crypto = require('crypto');
require('dotenv').config();

let ipfs;

const initIPFS = async () => {
  try {
    ipfs = create(process.env.IPFS_API_URL || '/ip4/127.0.0.1/tcp/5001');
    console.log('IPFS connection established');
    return ipfs;
  } catch (error) {
    console.error('IPFS initialization error:', error);
    throw error;
  }
};

/**
 * Generate a random encryption key
 * @returns {Object} Object containing key and iv
 */
const generateEncryptionKey = () => {
  // Generate a random 256-bit key (32 bytes)
  const key = crypto.randomBytes(32);
  // Generate a random 96-bit IV (12 bytes)
  const iv = crypto.randomBytes(16);
  return { key, iv };
};

/**
 * Encrypt a file buffer using AES-256-GCM
 * @param {Buffer} fileBuffer - The file buffer to encrypt
 * @param {Buffer} key - The encryption key
 * @param {Buffer} iv - The initialization vector
 * @returns {Object} Object containing encrypted buffer and auth tag
 */
const encryptBuffer = (fileBuffer, key, iv) => {
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const encryptedBuffer = Buffer.concat([
    cipher.update(fileBuffer),
    cipher.final()
  ]);
  const authTag = cipher.getAuthTag();
  return { encryptedBuffer, authTag };
};

/**
 * Decrypt an encrypted file buffer
 * @param {Buffer} encryptedBuffer - The encrypted file buffer
 * @param {Buffer} key - The encryption key
 * @param {Buffer} iv - The initialization vector
 * @param {Buffer} authTag - The authentication tag
 * @returns {Buffer} The decrypted file buffer
 */
const decryptBuffer = (encryptedBuffer, key, iv, authTag) => {
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(authTag);
  return Buffer.concat([
    decipher.update(encryptedBuffer),
    decipher.final()
  ]);
};

/**
 * Add an encrypted file to IPFS
 * @param {Buffer} fileBuffer - The file buffer to encrypt and store
 * @param {Buffer} key - Optional encryption key (if not provided, a new one will be generated)
 * @returns {Object} Object containing CID, encryption key, IV, and auth tag
 */
const addEncryptedFile = async (fileBuffer, key = null, iv = null) => {
  try {
    if (!ipfs) await initIPFS();
    
    // Generate encryption key and IV if not provided
    const encryptionData = key && iv ? { key, iv } : generateEncryptionKey();
    
    // Encrypt the file
    const { encryptedBuffer, authTag } = encryptBuffer(fileBuffer, encryptionData.key, encryptionData.iv);
    
    // Add metadata with encryption info
    const metadata = {
      encrypted: true,
      encryptionAlgorithm: 'aes-256-gcm',
      iv: encryptionData.iv.toString('hex'),
      authTag: authTag.toString('hex')
    };
    
    // Add encrypted file to IPFS
    const result = await ipfs.add(encryptedBuffer);
    
    return {
      cid: result.cid.toString(),
      key: encryptionData.key.toString('hex'),
      iv: encryptionData.iv.toString('hex'),
      authTag: authTag.toString('hex')
    };
  } catch (error) {
    console.error('Error adding encrypted file to IPFS:', error);
    throw new Error('Failed to store encrypted file on IPFS');
  }
};

/**
 * Get and decrypt a file from IPFS
 * @param {string} cid - The IPFS CID of the file
 * @param {string} keyHex - The encryption key as a hex string
 * @param {string} ivHex - The initialization vector as a hex string
 * @param {string} authTagHex - The authentication tag as a hex string
 * @returns {Buffer} The decrypted file buffer
 */
const getEncryptedFile = async (cid, keyHex, ivHex, authTagHex) => {
  try {
    if (!ipfs) await initIPFS();
    
    // Convert hex strings to buffers
    const key = Buffer.from(keyHex, 'hex');
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    
    // Get encrypted file from IPFS
    const chunks = [];
    for await (const chunk of ipfs.cat(cid)) {
      chunks.push(chunk);
    }
    const encryptedBuffer = Buffer.concat(chunks);
    
    // Decrypt the file
    return decryptBuffer(encryptedBuffer, key, iv, authTag);
  } catch (error) {
    console.error('Error getting encrypted file from IPFS:', error);
    throw new Error('Failed to retrieve and decrypt file from IPFS');
  }
};

// Legacy methods for backward compatibility
const addFile = async (fileBuffer) => {
  try {
    if (!ipfs) await initIPFS();
    const result = await ipfs.add(fileBuffer);
    return result.cid.toString();
  } catch (error) {
    console.error('Error adding file to IPFS:', error);
    throw new Error('Failed to store file on IPFS');
  }
};

const getFile = async (cid) => {
  try {
    if (!ipfs) await initIPFS();
    const chunks = [];
    for await (const chunk of ipfs.cat(cid)) {
      chunks.push(chunk);
    }
    return Buffer.concat(chunks);
  } catch (error) {
    console.error('Error getting file from IPFS:', error);
    throw new Error('Failed to retrieve file from IPFS');
  }
};

module.exports = {
  initIPFS,
  addFile,
  getFile,
  addEncryptedFile,
  getEncryptedFile,
  generateEncryptionKey
};
