// For Web3.js version 1.x
const Web3 = require('web3');

async function listAccounts() {
  // Create Web3 instance
  const web3 = new Web3('http://localhost:8545');
  
  try {
    // Get accounts
    const accounts = await web3.eth.getAccounts();
    
    console.log('Available accounts:');
    accounts.forEach((account, index) => {
      console.log(`Account ${index}: ${account}`);
    });
    
    // Get account balances
    console.log('\nAccount balances:');
    for (const account of accounts) {
      const balance = await web3.eth.getBalance(account);
      const balanceEth = web3.utils.fromWei(balance, 'ether');
      console.log(`${account}: ${balanceEth} ETH`);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the function
listAccounts();
