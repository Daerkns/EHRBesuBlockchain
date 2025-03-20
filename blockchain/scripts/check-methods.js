const EHRRegistry = require('../build/contracts/EHRRegistry.json');
const AccessControl = require('../build/contracts/AccessControl.json');
const PatientRecords = require('../build/contracts/PatientRecords.json');

console.log("EHRRegistry methods:");
if (EHRRegistry && EHRRegistry.abi) {
  EHRRegistry.abi.filter(item => item.type === 'function').forEach(item => {
    console.log(` - ${item.name}`);
  });
} else {
  console.log("  Contract ABI not found or invalid");
}

console.log("\nAccessControl methods:");
if (AccessControl && AccessControl.abi) {
  AccessControl.abi.filter(item => item.type === 'function').forEach(item => {
    console.log(` - ${item.name}`);
  });
} else {
  console.log("  Contract ABI not found or invalid");
}

console.log("\nPatientRecords methods:");
if (PatientRecords && PatientRecords.abi) {
  PatientRecords.abi.filter(item => item.type === 'function').forEach(item => {
    console.log(` - ${item.name}`);
  });
} else {
  console.log("  Contract ABI not found or invalid");
}
