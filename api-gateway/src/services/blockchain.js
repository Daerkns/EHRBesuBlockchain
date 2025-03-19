const Web3 = require('web3');
require('dotenv').config();

// Contract ABIs and addresses
let contracts = {
  EHRRegistry: { abi: null, address: null, instance: null },
  AccessControl: { abi: null, address: null, instance: null },
  PatientRecords: { abi: null, address: null, instance: null }
};

// Initialize Web3
const web3 = new Web3(process.env.BESU_NODE_URL || 'http://localhost:8545');

// Load contract ABIs and addresses
const loadContracts = async () => {
  try {
    // In a production environment, these would be loaded from files
    // For development, we'll load them dynamically
    const fs = require('fs');
    const path = require('path');

    // Path to contract build directory
    const buildPath = path.join(__dirname, '../../../blockchain/build/contracts');

    // Load each contract
    for (const contractName of Object.keys(contracts)) {
      const contractPath = path.join(buildPath, `${contractName}.json`);
      
      if (fs.existsSync(contractPath)) {
        const contractData = JSON.parse(fs.readFileSync(contractPath, 'utf8'));
        contracts[contractName].abi = contractData.abi;
        
        // Get network ID
        const networkId = await web3.eth.net.getId();
        contracts[contractName].address = contractData.networks[networkId]?.address;
        
        if (contracts[contractName].address) {
          contracts[contractName].instance = new web3.eth.Contract(
            contracts[contractName].abi,
            contracts[contractName].address
          );
          console.log(`${contractName} loaded at ${contracts[contractName].address}`);
        } else {
          console.warn(`Address not found for ${contractName} on network ${networkId}`);
        }
      } else {
        console.warn(`Contract build file not found: ${contractPath}`);
      }
    }
  } catch (error) {
    console.error('Error loading contracts:', error);
  }
};

// Set contract addresses manually
const setContractAddresses = (addresses) => {
  for (const [name, address] of Object.entries(addresses)) {
    if (contracts[name]) {
      contracts[name].address = address;
      if (contracts[name].abi) {
        contracts[name].instance = new web3.eth.Contract(
          contracts[name].abi,
          address
        );
        console.log(`${name} set to ${address}`);
      }
    }
  }
};

// Patient functions
const registerPatient = async (name, dateOfBirth) => {
  try {
    const accounts = await web3.eth.getAccounts();
    return await contracts.EHRRegistry.instance.methods.registerPatient(name, dateOfBirth).send({
      from: accounts[0],
      gas: 1000000
    });
  } catch (error) {
    console.error('Error registering patient:', error);
    throw new Error('Failed to register patient on blockchain');
  }
};

const getPatientRecords = async (patientId) => {
  try {
    return await contracts.PatientRecords.instance.methods.getPatientRecords(patientId).call();
  } catch (error) {
    console.error('Error getting patient records:', error);
    throw new Error('Failed to retrieve patient records from blockchain');
  }
};

const addMedicalRecord = async (patientId, recordData) => {
  try {
    const accounts = await web3.eth.getAccounts();
    return await contracts.PatientRecords.instance.methods.addMedicalRecord(patientId, recordData).send({
      from: accounts[0],
      gas: 1000000
    });
  } catch (error) {
    console.error('Error adding medical record:', error);
    throw new Error('Failed to add medical record to blockchain');
  }
};

// Access control functions
const grantAccess = async (patientId, doctorId) => {
  try {
    const accounts = await web3.eth.getAccounts();
    return await contracts.AccessControl.instance.methods.grantAccess(doctorId).send({
      from: accounts[0],
      gas: 1000000
    });
  } catch (error) {
    console.error('Error granting access:', error);
    throw new Error('Failed to grant access on blockchain');
  }
};

const revokeAccess = async (patientId, doctorId) => {
  try {
    const accounts = await web3.eth.getAccounts();
    return await contracts.AccessControl.instance.methods.revokeAccess(doctorId).send({
      from: accounts[0],
      gas: 1000000
    });
  } catch (error) {
    console.error('Error revoking access:', error);
    throw new Error('Failed to revoke access on blockchain');
  }
};

module.exports = {
  web3,
  loadContracts,
  setContractAddresses,
  registerPatient,
  getPatientRecords,
  addMedicalRecord,
  grantAccess,
  revokeAccess
};
