# Blockchain EHR Project

This directory contains the implementation of the Electronic Health Record (EHR) system based on a private permissionless blockchain using Hyperledger Besu. The project is designed to facilitate secure and efficient management of patient records across multiple hospitals.

## Project Structure

- **nodes/**: Contains configuration files for each hospital node participating in the blockchain network.
  - **hospital1/**: Configuration for the first hospital node.
  - **hospital2/**: Configuration for the second hospital node.
  - **hospital3-validator/**: Configuration for the validator hospital node.

- **smart-contracts/**: Contains the smart contracts that define the logic for managing access control and patient records.
  - **AccessControl.sol**: Smart contract for managing user permissions.
  - **EHRRegistry.sol**: Smart contract for registering electronic health records.
  - **PatientRecords.sol**: Smart contract for managing patient records.

- **scripts/**: Contains scripts for deploying smart contracts and setting up the blockchain network.
  - **deploy.js**: Script for deploying the smart contracts to the blockchain.
  - **setup-network.js**: Script for initializing the Hyperledger Besu network.

## Features

1. **Hyperledger Besu Network**: The blockchain network is set up using Hyperledger Besu with a Proof of Authority consensus mechanism (QBFT or IBFT 2).
2. **Access Control**: On-chain access control for managing permissions related to patient data.
3. **EHR Metadata Storage**: Metadata for electronic health records is stored on-chain, while larger medical files are stored off-chain in IPFS, with only their hashes stored on the blockchain.
4. **Validator Node**: One of the nodes acts as a validator to ensure transaction validity and maintain consensus.

## Getting Started

To set up the blockchain network, follow these steps:

1. Navigate to the `nodes/` directory and configure each hospital's `config.toml` file as needed.
2. Run the `setup-network.js` script to initialize the network.
3. Deploy the smart contracts using the `deploy.js` script.

## Contributing

Contributions to enhance the functionality and security of the EHR blockchain system are welcome. Please follow the standard contribution guidelines.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.