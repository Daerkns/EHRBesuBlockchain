const EHRRegistry = require('../build/contracts/EHRRegistry.json');
const AccessControl = require('../build/contracts/AccessControl.json');
const PatientRecords = require('../build/contracts/PatientRecords.json');

console.log("EHRRegistry methods:");
EHRRegistry.abi.filter(item => item.type === 'function').forEach(item => {
  console.log();
});

console.log("\nAccessControl methods:");
AccessControl.abi.filter(item => item.type === 'function').forEach(item => {
  console.log();
});

console.log("\nPatientRecords methods:");
PatientRecords.abi.filter(item => item.type === 'function').forEach(item => {
  console.log();
});
