const EHRRegistry = require('../build/contracts/EHRRegistry.json');

// Get the registerPatient function ABI
const registerPatientABI = EHRRegistry.abi.find(item => 
  item.type === 'function' && item.name === 'registerPatient');

if (registerPatientABI) {
  console.log('registerPatient function signature:');
  
  const inputs = registerPatientABI.inputs.map(input => 
    `${input.type} ${input.name}`).join(', ');
  
  console.log(`function registerPatient(${inputs}) ${registerPatientABI.stateMutability}`);
  
  console.log('\nParameter details:');
  registerPatientABI.inputs.forEach((input, index) => {
    console.log(`${index+1}. ${input.name} (${input.type})`);
  });
} else {
  console.log('registerPatient function not found in ABI');
}
