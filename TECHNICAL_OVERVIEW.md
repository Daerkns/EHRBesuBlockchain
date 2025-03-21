# EHR Blockchain System - Technical Overview

This document provides a comprehensive technical overview of the EHR Blockchain system, including architecture, components, technologies, and implementation details.

## Table of Contents
- [System Architecture](#system-architecture)
- [Blockchain Layer](#blockchain-layer)
- [Smart Contracts](#smart-contracts)
- [Storage Layer](#storage-layer)
- [Authentication Service](#authentication-service)
- [API Gateway](#api-gateway)
- [Frontend Applications](#frontend-applications)
- [Security Implementation](#security-implementation)
- [System Integration](#system-integration)
- [Development and Testing](#development-and-testing)

## System Architecture

The EHR Blockchain system employs a layered architecture with the following key components:

The system consists of:

1. **Blockchain Layer**: Hyperledger Besu network with QBFT consensus
2. **Smart Contracts**: Solidity contracts for EHR management
3. **Storage Layer**: Hybrid on-chain/off-chain storage with IPFS integration
4. **Authentication Service**: Manages user identities and authentication
5. **API Gateway**: Provides RESTful APIs for system interaction
6. **Frontend Applications**: User interfaces for patients and doctors

## Blockchain Layer

### Technology Stack
- **Blockchain Platform**: Hyperledger Besu v21.1.0
- **Consensus Mechanism**: QBFT (Quorum Byzantine Fault Tolerance)
- **Network Type**: Private, permissioned network
- **Node Configuration**: 4 nodes (3 hospital nodes + 1 validator)

### Network Configuration
- **Genesis Block**: Custom configuration in `blockchain/genesis/qbft-genesis-4nodes.json`
- **Permissioning**: Node-level permissioning in `blockchain/permissions/nodes.toml`
- **RPC Endpoints**:
  - Hospital 1: http://localhost:8545
  - Hospital 2: http://localhost:8546
  - Hospital 3: http://localhost:8547
  - Hospital 4: http://localhost:8548

### Key Features
- **Byzantine Fault Tolerance**: Tolerates up to f=(n-1)/3 faulty nodes
- **Immediate Finality**: Transactions are final once included in a block
- **Network Permissioning**: Only authorized nodes can join the network
- **High Throughput**: Capable of processing 100+ transactions per second

## Smart Contracts

### Technology Stack
- **Language**: Solidity v0.8.0
- **Development Framework**: Truffle v5.4.0
- **Deployment**: Custom deployment scripts using Web3.js

### Contract Architecture
The system uses three main smart contracts:

1. **EHRRegistry Contract**
   - **Purpose**: Manages patient and doctor registration
   - **Key Functions**:
     - `registerPatient(address, string, uint256)`: Registers a new patient
     - `registerDoctor(address, string, string, uint256)`: Registers a new doctor
     - `isPatient(address)`: Checks if an address belongs to a registered patient
     - `isDoctor(address)`: Checks if an address belongs to a registered doctor

2. **AccessControl Contract**
   - **Purpose**: Manages access permissions to medical records
   - **Key Functions**:
     - `grantAccess(address)`: Grants a doctor access to patient records
     - `revokeAccess(address)`: Revokes a doctor's access to patient records
     - `hasAccess(address, address)`: Checks if a doctor has access to a patient's records

3. **PatientRecords Contract**
   - **Purpose**: Stores and retrieves medical record metadata
   - **Key Functions**:
     - `addMedicalRecord(address, string)`: Adds a new medical record for a patient
     - `getPatientRecords(address)`: Gets all medical records for a patient

### Contract Interaction Flow
1. Patient registers via EHRRegistry
2. Patient grants access to doctors via AccessControl
3. Doctors add medical records via PatientRecords
4. Access checks are performed when records are requested

## Storage Layer

### Technology Stack
- **On-chain Storage**: Ethereum blockchain (via Hyperledger Besu)
- **Off-chain Storage**: IPFS (InterPlanetary File System)
- **IPFS Client**: js-ipfs-http-client v50.1.0
- **Encryption**: Node.js crypto module with AES-256-GCM

### Storage Architecture
The system employs a hybrid storage approach:

1. **On-chain Storage**:
   - Patient and doctor registration data
   - Access control permissions
   - Record metadata (timestamps, types, IPFS references)

2. **Off-chain Storage (IPFS)**:
   - Encrypted medical files (images, documents, test results)
   - Large datasets
   - Encrypted using AES-256-GCM before storage

### Encryption Process
1. Generate random encryption key and IV
2. Encrypt file buffer using AES-256-GCM
3. Store encrypted file on IPFS
4. Return CID, encryption key, IV, and auth tag
5. Store metadata on-chain, encryption key managed separately

## Authentication Service

### Technology Stack
- **Language/Framework**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **Blockchain Integration**: Web3.js

### Component Architecture
- **User Model**: MongoDB schema for user data
- **Authentication Controller**: Handles registration, login, and profile management
- **Middleware**: JWT verification and role-based access control

### Authentication Flow
1. User registers with username/password
2. Optional blockchain address verification
3. Password hashed with bcrypt before storage
4. On login, JWT token generated with user role and ID
5. JWT token used for subsequent API requests

### Blockchain Address Verification
- Uses cryptographic signatures to verify blockchain address ownership
- Challenge-response mechanism with nonce
- Signature verification using Web3.js ecrecover

## API Gateway

### Technology Stack
- **Language/Framework**: Node.js, Express.js
- **Blockchain Connection**: Web3.js
- **IPFS Connection**: js-ipfs-http-client
- **Authentication**: JWT validation
- **File Handling**: multer

### Component Architecture
- **Routes**: RESTful API endpoints
- **Controllers**: Business logic for API operations
- **Services**: 
  - Blockchain service for smart contract interaction
  - IPFS service for file storage and retrieval
- **Middleware**: Authentication, error handling

### Key API Endpoints
- **Authentication**: `/api/auth/*`
- **Patient Management**: `/api/patients/*`
- **Doctor Management**: `/api/doctors/*`
- **System Monitoring**: `/api/monitor/*`

### Integration Points
- Proxies authentication requests to Auth Service
- Interacts with blockchain nodes for contract calls
- Connects to IPFS for file storage and retrieval

## Frontend Applications

### Technology Stack
- **Framework**: React v17.0.2
- **UI Library**: Material-UI v5.0.0
- **State Management**: React Hooks
- **API Client**: Axios
- **Web3 Integration**: Web3.js

### Patient Portal
- **Key Components**:
  - Authentication (Login/Register)
  - Patient Profile Management
  - Medical Records Viewing and Upload
  - Access Control Management

### Doctor Dashboard
- **Key Components**:
  - Authentication (Login/Register)
  - Doctor Profile Management
  - Patient Record Access and Viewing
  - System Monitoring and Administration

### Component Architecture
- Modular React components
- Service-based approach for API calls
- JWT token management for authentication
- Responsive design for multiple devices

## Security Implementation

### Authentication and Authorization
- JWT-based authentication with expiration
- Role-based access control (patient, doctor, admin)
- Password hashing with bcrypt (10 rounds)
- HTTP-only cookies for token storage

### Blockchain Security
- Private, permissioned network
- Node-level access control
- Transaction signing
- Smart contract access controls

### Data Protection
- AES-256-GCM encryption for files before IPFS storage
- Separate key management
- Content-addressable storage with IPFS
- HTTPS for all API communication

### Security Best Practices
- Input validation
- CORS configuration
- Rate limiting
- Error handling without information disclosure

## System Integration

### Component Communication
- **Auth Service ↔ API Gateway**: HTTP/REST
- **API Gateway ↔ Blockchain**: JSON-RPC
- **API Gateway ↔ IPFS**: HTTP API
- **Frontend ↔ API Gateway**: HTTP/REST with JWT

### Data Flow
1. User authenticates via frontend
2. JWT token used for API Gateway requests
3. API Gateway validates permissions
4. API Gateway interacts with blockchain and IPFS
5. Results returned to frontend application

### Integration Patterns
- API Gateway pattern
- Microservices architecture
- Event-driven communication (where applicable)
- Hybrid on-chain/off-chain storage

## Development and Testing

### Development Environment
- **Language**: JavaScript/TypeScript
- **Runtime**: Node.js v14+
- **Package Manager**: npm
- **Version Control**: Git
- **Containerization**: Docker (optional)

### Testing Infrastructure
- **End-to-End Testing**: Custom test script (`test-ehr-system.sh`)
- **Smart Contract Testing**: Truffle test suite
- **API Testing**: Postman/curl
- **Frontend Testing**: Jest/React Testing Library

### CI/CD Pipeline (Recommended)
- **Source Control**: GitHub/GitLab
- **CI/CD**: Jenkins/GitHub Actions
- **Testing**: Automated tests run on each commit
- **Deployment**: Automated deployment to staging/production

### Monitoring and Logging
- Console-based logging for all services
- Blockchain node monitoring via RPC
- Service health checks
- System monitoring dashboard in Doctor Dashboard
