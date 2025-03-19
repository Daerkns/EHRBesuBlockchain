const EHRRegistry = artifacts.require("EHRRegistry");
const AccessControl = artifacts.require("AccessControl");
const PatientRecords = artifacts.require("PatientRecords");

module.exports = async function(deployer, network, accounts) {
  // Use the hard-coded address if no accounts are available
  const deployAccount = accounts.length > 0 ? accounts[0] : "0xfe3b557e8fb62b89f4916b721be55ceb828dbd73";
  
  console.log("Deploying contracts from account:", deployAccount);
  
  // Deploy EHRRegistry first
  await deployer.deploy(EHRRegistry, { from: deployAccount });
  const ehrRegistry = await EHRRegistry.deployed();
  
  // Deploy AccessControl with EHRRegistry address
  await deployer.deploy(AccessControl, ehrRegistry.address, { from: deployAccount });
  const accessControl = await AccessControl.deployed();
  
  // Deploy PatientRecords with AccessControl address
  await deployer.deploy(PatientRecords, accessControl.address, { from: deployAccount });
  
  console.log("Contracts deployed to:");
  console.log("- EHRRegistry:", ehrRegistry.address);
  console.log("- AccessControl:", accessControl.address);
  console.log("- PatientRecords:", await PatientRecords.deployed().address);
};
