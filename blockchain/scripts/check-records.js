// Import Web3 using the correct method for Web3.js v4
const { Web3 } = require('web3');
const fs = require('fs');
const path = require('path');

// Contract addresses
const CONTRACT_ADDRESSES = {
  PatientRecords: '0x9a3DBCa554e9f6b9257aAa24010DA8377C57c17e'
};

// Dev account private key
const PRIVATE_KEY = '0x8f2a55949038a9610f50fb23b5883af3b4ecb3c3bb792cbcefbd1542c692be63';
const PATIENT_ADDRESS = '0xfe3b557e8fb62b89f4916b721be55ceb828dbd73';

// Path to contract artifact
const artifactPath = path.join(__dirname, '../build/contracts/PatientRecords.json');

async function main() {
  try {
    console.log('Starting records inspection...');
    
    // Check if artifact exists
    if (!fs.existsSync(artifactPath)) {
      console.error('Contract artifact not found at:', artifactPath);
      return;
    }
    
    console.log('Loading contract artifact...');
    const PatientRecordsArtifact = require(artifactPath);
    
    // Initialize web3 with RPC URL
    console.log('Initializing Web3...');
    const web3 = new Web3('http://localhost:8545');
    
    // Check if web3 is connected
    const isConnected = await web3.eth.net.isListening();
    console.log('Web3 connected:', isConnected);
    
    // Add account to wallet
    console.log('Adding account to wallet...');
    const account = web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY);
    web3.eth.accounts.wallet.add(account);
    console.log('Using account:', account.address);
    
    // Create contract instance
    console.log('Creating contract instance...');
    const patientRecords = new web3.eth.Contract(
      PatientRecordsArtifact.abi,
      CONTRACT_ADDRESSES.PatientRecords
    );
    
    // Check contract methods
    console.log('\nContract methods:');
    const functionAbi = PatientRecordsArtifact.abi.filter(item => item.type === 'function');
    functionAbi.forEach(method => {
      console.log(`- ${method.name}(${method.inputs.map(i => `${i.type} ${i.name}`).join(', ')})`);
    });
    
    // Try to get patient records
    console.log('\nAttempting to get records for patient:', PATIENT_ADDRESS);
    try {
      const records = await patientRecords.methods.getPatientRecords(PATIENT_ADDRESS).call();
      console.log('Records returned:', JSON.stringify(records, null, 2));
      console.log('Number of records:', Array.isArray(records) ? records.length : 'not an array');
    } catch (error) {
      console.error('Error getting records:', error.message);
    }
    
    // Try adding a test record
    console.log('\nAdding a test record...');
    try {
      const testData = JSON.stringify({
        title: 'Test from Script',
        description: 'Created by inspection script',
        recordType: '1'
      });
      
      const receipt = await patientRecords.methods.addMedicalRecord(
        PATIENT_ADDRESS,
        testData
      ).send({
        from: account.address,
        gas: 500000
      });
      
      console.log('Test record added. Transaction hash:', receipt.transactionHash);
      
      // Check records again
      console.log('\nChecking records after adding test record...');
      const updatedRecords = await patientRecords.methods.getPatientRecords(PATIENT_ADDRESS).call();
      console.log('Updated records count:', updatedRecords.length);
    } catch (error) {
      console.error('Error adding test record:', error.message);
    }
    
  } catch (error) {
    console.error('Script error:', error);
  }
}

// Execute the main function
main()
  .then(() => console.log('Script completed.'))
  .catch(err => console.error('Script failed:', err));
