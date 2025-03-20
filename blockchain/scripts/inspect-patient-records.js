const Web3 = require('web3');
const PatientRecordsArtifact = require('../build/contracts/PatientRecords.json');
const CONTRACT_ADDRESSES = {
  PatientRecords: '0x9a3DBCa554e9f6b9257aAa24010DA8377C57c17e'
};

// Dev account private key
const PRIVATE_KEY = '0x8f2a55949038a9610f50fb23b5883af3b4ecb3c3bb792cbcefbd1542c692be63';
const PATIENT_ADDRESS = '0xfe3b557e8fb62b89f4916b721be55ceb828dbd73';

async function main() {
  // Initialize web3
  const web3 = new Web3('http://localhost:8545');
  
  // Add private key to wallet
  const account = web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY);
  web3.eth.accounts.wallet.add(account);
  
  console.log('Using account:', account.address);
  
  // Create contract instance
  const patientRecords = new web3.eth.Contract(
    PatientRecordsArtifact.abi,
    CONTRACT_ADDRESSES.PatientRecords
  );
  
  console.log('Connected to PatientRecords contract at:', CONTRACT_ADDRESSES.PatientRecords);
  
  // Check contract methods
  console.log('\nAvailable methods:');
  PatientRecordsArtifact.abi
    .filter(item => item.type === 'function')
    .forEach(method => {
      console.log(`- ${method.name}(${method.inputs.map(i => `${i.type} ${i.name}`).join(', ')})`);
    });
  
  // Try to get patient records
  try {
    console.log('\nAttempting to get records for patient:', PATIENT_ADDRESS);
    const records = await patientRecords.methods.getPatientRecords(PATIENT_ADDRESS).call();
    
    console.log('Records returned:', records);
    console.log('Number of records:', Array.isArray(records) ? records.length : 'not an array');
    
    if (Array.isArray(records) && records.length > 0) {
      console.log('\nFirst record details:');
      console.log(records[0]);
    }
  } catch (error) {
    console.error('Error getting records:', error);
  }
  
  // Try to add a test record
  try {
    console.log('\nAttempting to add a test record');
    
    const testData = JSON.stringify({
      title: 'Test Record from Script',
      description: 'This is a test record added by the inspection script',
      recordType: '0',
      fileHash: ''
    });
    
    // Get the method as it appears in the contract
    const addRecordMethod = patientRecords.methods.addMedicalRecord(
      PATIENT_ADDRESS,
      testData
    );
    
    // Send the transaction
    const gas = await addRecordMethod.estimateGas({ from: account.address });
    const tx = await addRecordMethod.send({
      from: account.address,
      gas
    });
    
    console.log('Transaction successful:', tx.transactionHash);
    
    // Check if record was added
    console.log('\nChecking records after addition:');
    const updatedRecords = await patientRecords.methods.getPatientRecords(PATIENT_ADDRESS).call();
    console.log('Updated number of records:', Array.isArray(updatedRecords) ? updatedRecords.length : 'not an array');
    
    if (Array.isArray(updatedRecords) && updatedRecords.length > 0) {
      console.log('\nLatest record details:');
      console.log(updatedRecords[updatedRecords.length - 1]);
    }
  } catch (error) {
    console.error('Error adding test record:', error);
  }
}

main().catch(console.error);
