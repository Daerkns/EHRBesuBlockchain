# EHR Blockchain System

A private permissioned Electronic Health Record (EHR) blockchain system using Hyperledger Besu with QBFT consensus.

## System Architecture

### Network Architecture
- 4 Hyperledger Besu nodes (3 hospital nodes + 1 validator)
- QBFT (Quorum Byzantine Fault Tolerance) consensus mechanism
- Private, permissioned network

### Core Components
1. **Blockchain Network**
   - Hyperledger Besu nodes with QBFT consensus
   - Smart contracts for EHR management
   - Network permissioning for security

2. **Smart Contracts**
   - EHRRegistry: Manages patient and doctor registration
   - AccessControl: Handles access permissions to medical records
   - PatientRecords: Stores and retrieves medical record metadata

3. **Authentication Service**
   - MongoDB-based user management
   - JWT authentication
   - Role-based access control (patient, doctor, admin)
   - Blockchain address verification

4. **API Gateway**
   - Node.js/Express backend
   - RESTful API endpoints
   - Integration with blockchain and IPFS
   - Proxy to authentication service

5. **Storage System**
   - On-chain: EHR metadata, access control rules
   - Off-chain: Encrypted medical files on IPFS

6. **Frontend Applications**
   - Patient Portal: React-based interface for patients
   - Doctor Dashboard: React-based interface for healthcare providers
   - System monitoring and administration

7. **Security Implementation**
   - Network permissioning
   - AES-256-GCM encryption for medical files
   - Role-based access control
   - JWT-based authentication

## Getting Started

### Prerequisites
- Node.js and npm
- Hyperledger Besu
- MongoDB (for authentication service)
- IPFS (will be installed automatically if not present)

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd ehr-blockchain
   ```

2. Install dependencies:
   ```
   npm install
   ```

### Running the System

The system can be started with a single command:

```
./start-ehr-system.sh
```

This script will:
1. Set up and start the 4-node Hyperledger Besu network
2. Deploy the smart contracts
3. Start the Authentication Service
4. Start the API Gateway
5. Configure and start IPFS if needed

You can also run end-to-end tests to verify the system is working correctly:

```
./test-ehr-system.sh
```

### Component-Specific Scripts

If you need to run components individually:

#### Blockchain Network
- Clean data: `./blockchain/scripts/clean-data.sh`
- Start network: `./blockchain/scripts/start-4node-network.sh`
- Test network: `./blockchain/scripts/test-network.sh`
- Deploy contracts: `cd blockchain && node scripts/deploy.js`

#### API Gateway
- Start API: `./api-gateway/start-api.sh`

#### Authentication Service
- Start Auth Service: `./auth-service/start-auth.sh`

#### Frontend Applications
- Patient Portal: `cd frontend/patient-portal && npm start`
- Doctor Dashboard: `cd frontend/doctor-dashboard && npm start`

## System Usage

### API Endpoints

#### Authentication
- `POST /api/auth/register`: Register a new user (patient or doctor)
- `POST /api/auth/login`: Login and get JWT token
- `GET /api/auth/profile`: Get user profile information

#### Patient Management
- `POST /api/patients/register`: Register a new patient
- `GET /api/patients/:id`: Get patient information
- `GET /api/patients/:id/records`: Get patient medical records

#### Doctor Management
- `POST /api/doctors/register`: Register a new doctor
- `GET /api/doctors/:id`: Get doctor information

#### Access Control
- `POST /api/patients/:id/access`: Grant access to a doctor
- `DELETE /api/patients/:id/access/:doctorId`: Revoke access from a doctor

#### Medical Records
- `POST /api/patients/:id/records`: Add a new medical record
- `GET /api/patients/:id/records/:recordId`: Get a specific medical record

#### System Monitoring
- `GET /api/monitor/services`: Get status of all services
- `GET /api/monitor/nodes`: Get status of blockchain nodes

## Network Information

- Hospital 1 RPC: http://localhost:8545
- Hospital 2 RPC: http://localhost:8546
- Hospital 3 RPC: http://localhost:8547
- Hospital 4 RPC: http://localhost:8548
- Auth Service: http://localhost:4000
- API Gateway: http://localhost:3000
- Patient Portal: http://localhost:3001 (when started)
- Doctor Dashboard: http://localhost:3002 (when started)

## Security Features

1. **Network Permissioning**
   - Only authorized nodes can join the network
   - Configured in `blockchain/permissions/nodes.toml`

2. **Data Encryption**
   - All medical files are encrypted using AES-256-GCM before storage
   - Encryption keys are managed securely

3. **Access Control**
   - Patients control access to their medical records
   - Doctors can only access records they've been granted permission to

4. **Authentication**
   - JWT-based authentication
   - Password hashing with bcrypt
   - Role-based access control
   - Optional blockchain address verification

## Troubleshooting

### Common Issues

1. **Network not starting**
   - Check logs in `blockchain/logs/`
   - Ensure ports 8545-8548 and 30303-30306 are available

2. **Contract deployment failing**
   - Check that the network is running
   - Verify account has sufficient funds

3. **IPFS connection issues**
   - Check if IPFS daemon is running with `ipfs swarm peers`
   - Restart IPFS with `ipfs daemon`

4. **Authentication service issues**
   - Ensure MongoDB is running
   - Check logs for connection errors
   - Verify JWT_SECRET is properly set in .env files

5. **Frontend connection issues**
   - Check that API Gateway is running
   - Verify API URLs in frontend configuration

## License

This project is licensed under the MIT License - see the LICENSE file for details.
