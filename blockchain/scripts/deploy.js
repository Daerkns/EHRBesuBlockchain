const Web3 = require('web3');
const fs = require('fs');
const path = require('path');

const EHRRegistryJSON = require('../build/contracts/EHRRegistry.json');
const AccessControlJSON = require('../build/contracts/AccessControl.json');
const PatientRecordsJSON = require('../build/contracts/PatientRecords.json');

const deploy = async () => {
    const web3 = new Web3('http://localhost:8545');
    const accounts = await web3.eth.getAccounts();
    const deployer = accounts[0];
    
    console.log('Deploying contracts from account:', deployer);
    
    // Deploy EHRRegistry
    const EHRRegistry = new web3.eth.Contract(EHRRegistryJSON.abi);
    const ehrRegistry = await EHRRegistry.deploy({
        data: EHRRegistryJSON.bytecode
    }).send({
        from: deployer,
        gas: 3000000
    });
    
    console.log('EHRRegistry deployed at:', ehrRegistry.options.address);
    
    // Deploy AccessControl with EHRRegistry address
    const AccessControl = new web3.eth.Contract(AccessControlJSON.abi);
    const accessControl = await AccessControl.deploy({
        data: AccessControlJSON.bytecode,
        arguments: [ehrRegistry.options.address]
    }).send({
        from: deployer,
        gas: 3000000
    });
    
    console.log('AccessControl deployed at:', accessControl.options.address);
    
    // Deploy PatientRecords with AccessControl address
    const PatientRecords = new web3.eth.Contract(PatientRecordsJSON.abi);
    const patientRecords = await PatientRecords.deploy({
        data: PatientRecordsJSON.bytecode,
        arguments: [accessControl.options.address]
    }).send({
        from: deployer,
        gas: 3000000
    });
    
    console.log('PatientRecords deployed at:', patientRecords.options.address);
    
    // Save addresses
    const addresses = {
        EHRRegistry: ehrRegistry.options.address,
        AccessControl: accessControl.options.address,
        PatientRecords: patientRecords.options.address
    };
    
    fs.writeFileSync(
        path.join(__dirname, '../build/contract-addresses.json'),
        JSON.stringify(addresses, null, 2)
    );
    
    console.log('Contract addresses saved to build/contract-addresses.json');
};

deploy().catch(console.error);
