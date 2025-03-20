const { keccak256 } = require('js-sha3');
const fs = require('fs');

// Read the public key from file
const pubKeyPath = process.argv[2];
if (!pubKeyPath) {
  console.error('Please provide the path to the public key file');
  process.exit(1);
}

try {
  // Read the public key (remove 0x prefix if present)
  let pubKey = fs.readFileSync(pubKeyPath, 'utf8').trim();
  if (pubKey.startsWith('0x')) {
    pubKey = pubKey.substring(2);
  }

  // Derive Ethereum address from public key
  // Keccak-256 hash of the public key
  const address = '0x' + keccak256(Buffer.from(pubKey, 'hex')).substring(24);
  
  console.log(`Public Key: 0x${pubKey}`);
  console.log(`Ethereum Address: ${address}`);
} catch (error) {
  console.error('Error:', error.message);
  process.exit(1);
}
