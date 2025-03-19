// Import Web3 correctly for newer versions
const Web3 = require('web3').default || require('web3');
const fs = require('fs');
const path = require('path');

async function main() {
  try {
    // Connect to the Besu node
    const web3 = new Web3('http://localhost:8545');
    
    // Check connection
    const networkId = await web3.eth.net.getId();
    console.log("Connected to network ID:", networkId);
    
    // Set the deployer account
    const account = '0xfe3b557e8fb62b89f4916b721be55ceb828dbd73';
    const privateKey = '0x8f2a55949038a9610f50fb23b5883af3b4ecb3c3bb792cbcefbd1542c692be63';
    
    // Add the private key to the web3 wallet
    const wallet = web3.eth.accounts.wallet.add(privateKey);
    console.log("Using account:", account);
    
    // Get account balance
    const balance = await web3.eth.getBalance(account);
    console.log("Account balance:", web3.utils.fromWei(balance, 'ether'), "ETH");
    
    // Compile contracts first (you need to run this before the script)
    console.log("Loading contract artifacts...");
    const buildDir = path.resolve('/home/vanir/ehr-blockchain/blockchain/build/contracts');
    
    // Function to deploy a contract
    async function deployContract(contractName, args = []) {
      console.log(`Deploying ${contractName}...`);
      
      // Load the contract JSON
      const contractPath = path.join(buildDir, `${contractName}.json`);
      if (!fs.existsSync(contractPath)) {
        throw new Error(`Contract artifact not found at ${contractPath}. Did you run 'truffle compile'?`);
      }
      
      const contractJson = require(contractPath);
      const contract = new web3.eth.Contract(contractJson.abi);
      
      // Deploy the contract
      const deployTx = contract.deploy({
        data: contractJson.bytecode,
        arguments: args
      });
      
      const gasEstimate = await deployTx.estimateGas({ from: account });
      console.log(`Gas estimate for ${contractName}: ${gasEstimate}`);
      
      const deployedContract = await deployTx.send({
        from: account,
        gas: Math.floor(gasEstimate * 1.1) // Add 10% buffer
      });
      
      console.log(`${contractName} deployed to: ${deployedContract.options.address}`);
      return deployedContract;
    }
    
    // Deploy the contracts in sequence
    const ehrRegistry = await deployContract('EHRRegistry');
    const accessControl = await deployContract('AccessControl', [ehrRegistry.options.address]);
    const patientRecords = await deployContract('PatientRecords', [accessControl.options.address]);
    
    console.log('All contracts deployed successfully:');
    console.log('- EHRRegistry:', ehrRegistry.options.address);
    console.log('- AccessControl:', accessControl.options.address);
    console.log('- PatientRecords:', patientRecords.options.address);
    
  } catch (error) {
    console.error('Deployment failed:', error);
  }
}

main();
