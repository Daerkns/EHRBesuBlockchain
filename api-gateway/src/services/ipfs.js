const { create } = require('ipfs-http-client');
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
  getFile
};
