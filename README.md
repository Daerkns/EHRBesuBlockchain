# EHR Blockchain Project

This project implements a private permissionless blockchain for Electronic Health Records (EHR) using Hyperledger Besu. The system consists of three hospital nodes, one of which acts as a validator. The architecture includes a patient portal and a doctor dashboard, an API gateway, and a blockchain network for secure and efficient management of health records.

## Project Structure

- **frontend**: Contains the user interfaces for patients and doctors.
  - **patient-portal**: React-based portal for patients to access their health records.
  - **doctor-dashboard**: React-based dashboard for doctors to manage patient information.

- **api-gateway**: Node.js/Express application that serves as a middleware between the frontend and the blockchain network.
  
- **blockchain**: Contains the configuration and smart contracts for the Hyperledger Besu network.
  - **nodes**: Configuration files for each hospital node.
  - **smart-contracts**: Smart contracts for managing access control and patient records.
  - **scripts**: Scripts for deploying smart contracts and setting up the network.

- **auth-service**: Handles authentication and authorization for patients and doctors.

## Features

1. **User Interfaces**:
   - Patient portal for patients to view and manage their health records.
   - Doctor dashboard for healthcare providers to access and update patient information.

2. **API Gateway**:
   - Middleware to handle requests from the frontend and interact with the blockchain and IPFS.

3. **Blockchain Network**:
   - Hyperledger Besu running on Proof of Authority consensus (QBFT or IBFT 2).
   - On-chain storage of EHR metadata and off-chain storage of larger medical files on IPFS.

4. **Access Control**:
   - Implementation of OAuth or IAM solutions for managing permissions and access control.

5. **Validator Node**:
   - Ensures transaction validity and provides consensus for the network.

## Getting Started

To set up the project locally, follow these steps:

1. Clone the repository:
   ```
   git clone <repository-url>
   cd ehr-blockchain
   ```

2. Set up the blockchain network:
   - Navigate to the `blockchain` directory and configure the nodes.
   - Run the setup script to initialize the network.

3. Start the API Gateway:
   - Navigate to the `api-gateway` directory and install dependencies.
   - Start the server.

4. Launch the frontend applications:
   - Navigate to both `frontend/patient-portal` and `frontend/doctor-dashboard`, install dependencies, and start the applications.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.# EHRBesuBlockchain
