// Import Web3 properly for Web3.js v4
import { Web3 } from 'web3';
import CONTRACT_ADDRESSES from '../config/contracts';
import EHRRegistryABI from '../contracts/EHRRegistry.json';
import AccessControlABI from '../contracts/AccessControl.json';
import PatientRecordsABI from '../contracts/PatientRecords.json';

// Initialize Web3
let web3;
let account;

// Initialize Web3 instance
export const getWeb3 = async () => {
  if (web3) return web3;
  
  try {
    // Using HTTP provider for Besu
    web3 = new Web3('http://localhost:8545');
    
    // Using the hardcoded account for development
    // This should be a doctor's account
    const privateKey = '0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d';
    const accountObj = web3.eth.accounts.privateKeyToAccount(privateKey);
    web3.eth.accounts.wallet.add(accountObj);
    account = accountObj.address;
    
    console.log('Web3 initialized with doctor account:', account);
    return web3;
  } catch (error) {
    console.error('Error initializing web3:', error);
    throw error;
  }
};

// Get the current account
export const getAccount = async () => {
  if (!account) {
    await getWeb3();
  }
  return account;
};

// Set the current account (for testing with different accounts)
export const setAccount = (newAccount) => {
  account = newAccount;
};

// Get contract instances
export const getContracts = async () => {
  try {
    const web3Instance = await getWeb3();
    
    // Create contract instances
    const ehrRegistry = new web3Instance.eth.Contract(
      EHRRegistryABI.abi,
      CONTRACT_ADDRESSES.EHRRegistry
    );
    
    const accessControl = new web3Instance.eth.Contract(
      AccessControlABI.abi,
      CONTRACT_ADDRESSES.AccessControl
    );
    
    const patientRecords = new web3Instance.eth.Contract(
      PatientRecordsABI.abi,
      CONTRACT_ADDRESSES.PatientRecords
    );
    
    return { ehrRegistry, accessControl, patientRecords };
  } catch (error) {
    console.error('Error getting contract instances:', error);
    throw error;
  }
};

// Send a signed transaction
export const sendSignedTransaction = async (method, contractAddress, fromAddress) => {
  try {
    console.log('Sending transaction to contract:', contractAddress);
    console.log('From address:', fromAddress);
    
    // Estimate gas
    const gas = await method.estimateGas({ from: fromAddress });
    console.log('Estimated gas:', gas);
    
    // Send transaction
    const receipt = await method.send({
      from: fromAddress,
      gas: Math.floor(gas * 1.2) // Add 20% buffer
    });
    
    console.log('Transaction receipt:', receipt);
    return receipt;
  } catch (error) {
    console.error('Error sending transaction:', error);
    throw error;
  }
};
