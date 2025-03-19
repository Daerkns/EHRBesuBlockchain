const { exec } = require('child_process');

const setupNetwork = () => {
    console.log('Setting up Hyperledger Besu network...');

    // Start the nodes
    exec('besu --config-file ./nodes/hospital1/config.toml', (error, stdout, stderr) => {
        if (error) {
            console.error(`Error starting hospital1: ${error.message}`);
            return;
        }
        console.log(`hospital1 stdout: ${stdout}`);
        console.error(`hospital1 stderr: ${stderr}`);
    });

    exec('besu --config-file ./nodes/hospital2/config.toml', (error, stdout, stderr) => {
        if (error) {
            console.error(`Error starting hospital2: ${error.message}`);
            return;
        }
        console.log(`hospital2 stdout: ${stdout}`);
        console.error(`hospital2 stderr: ${stderr}`);
    });

    exec('besu --config-file ./nodes/hospital3-validator/config.toml', (error, stdout, stderr) => {
        if (error) {
            console.error(`Error starting hospital3-validator: ${error.message}`);
            return;
        }
        console.log(`hospital3-validator stdout: ${stdout}`);
        console.error(`hospital3-validator stderr: ${stderr}`);
    });

    console.log('Hyperledger Besu network setup complete.');
};

setupNetwork();