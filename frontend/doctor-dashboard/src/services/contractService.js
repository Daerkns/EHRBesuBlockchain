import Web3 from 'web3';
// Import ABIs
// These paths should point to your JSON ABI files
import EHRRegistryABI from '../contracts/EHRRegistry.json';
import AccessControlABI from '../contracts/AccessControl.json';
import PatientRecordsABI from '../contracts/PatientRecords.json';

// Contract addresses - replace with your actual deployed addresses
const contractAddresses = {
  EHRRegistry: '0x42699A7612A82f1d9C36148af9C77354759b210b',
  AccessControl: '0xa50a51c09a5c451C52BB714527E1974b686D8e77',
  PatientRecords: '0x9a3DBCa554e9f6b9257aAa24010DA8377C57c17e'
};

let web3;
let contractInstances = null;

// Initialize Web3
export const initWeb3 = async () => {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    try {
      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });
    } catch (error) {
      console.error("User denied account access");
      throw new Error("Please allow MetaMask to connect to this site");
    }
  } else if (window.web3) {
    // Legacy dapp browsers
    web3 = new Web3(window.web3.currentProvider);
  } else {
    // Fallback - local provider
    const provider = new Web3.providers.HttpProvider('http://localhost:8545');
    web3 = new Web3(provider);
  }
  return web3;
};

// Get current account
export const getAccount = async () => {
  if (!web3) {
    await initWeb3();
  }
  const accounts = await web3.eth.getAccounts();
  return accounts[0];
};

// Initialize all contracts
export const initContracts = async () => {
  if (!web3) {
    await initWeb3();
  }
  
  // Initialize contract instances
  const ehrRegistry = new web3.eth.Contract(
    EHRRegistryABI.abi,
    contractAddresses.EHRRegistry
  );
  
  const accessControl = new web3.eth.Contract(
    AccessControlABI.abi,
    contractAddresses.AccessControl
  );
  
  const patientRecords = new web3.eth.Contract(
    PatientRecordsABI.abi,
    contractAddresses.PatientRecords
  );
  
  contractInstances = {
    ehrRegistry,
    accessControl,
    patientRecords
  };
  
  return contractInstances;
};

// Get contract instances
export const contracts = async () => {
  if (!contractInstances) {
    await initContracts();
  }
  return contractInstances;
};
