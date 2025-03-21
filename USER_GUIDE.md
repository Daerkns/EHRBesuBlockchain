# EHR Blockchain System - User Guide

This guide provides comprehensive instructions for setting up, running, and using the EHR Blockchain system for managing electronic health records.

## Table of Contents
- [System Requirements](#system-requirements)
- [Installation](#installation)
- [System Startup](#system-startup)
- [Using the Patient Portal](#using-the-patient-portal)
- [Using the Doctor Dashboard](#using-the-doctor-dashboard)
- [Administration and Monitoring](#administration-and-monitoring)
- [Troubleshooting](#troubleshooting)
- [FAQ](#faq)

## System Requirements

Before installing the EHR Blockchain system, ensure your environment meets these requirements:

- **Operating System**: Linux (recommended), macOS, or Windows
- **Node.js**: v14.x or higher
- **npm**: v6.x or higher
- **MongoDB**: v4.4 or higher
- **Hyperledger Besu**: v21.1.0 or higher
- **IPFS**: Will be installed automatically
- **RAM**: Minimum 8GB (16GB recommended)
- **Storage**: At least 20GB free space

## Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd ehr-blockchain
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   - Copy the sample environment files:
     ```bash
     cp api-gateway/.env.sample api-gateway/.env
     cp auth-service/.env.sample auth-service/.env
     ```
   - Edit the `.env` files to configure your MongoDB connection, JWT secret, and other settings

## System Startup

### Starting the Complete System

To start all components of the system at once:

```bash
./start-ehr-system.sh
```

This script will:
1. Set up and start the 4-node Hyperledger Besu network
2. Deploy the smart contracts
3. Start the Authentication Service
4. Start the API Gateway
5. Configure and start IPFS if needed

### Starting Individual Components

If you need to run components separately:

1. **Blockchain Network**:
   ```bash
   ./blockchain/scripts/start-4node-network.sh
   ```

2. **Authentication Service**:
   ```bash
   ./auth-service/start-auth.sh
   ```

3. **API Gateway**:
   ```bash
   ./api-gateway/start-api.sh
   ```

4. **Frontend Applications**:
   ```bash
   # Patient Portal
   cd frontend/patient-portal
   npm start
   
   # Doctor Dashboard
   cd frontend/doctor-dashboard
   npm start
   ```

### Testing the System

To verify that all components are working correctly:

```bash
./test-ehr-system.sh
```

## Using the Patient Portal

The Patient Portal is designed for patients to manage their health records and control access to their data.

### Accessing the Portal

Open your browser and navigate to:
```
http://localhost:3001
```

### Registration and Login

1. **New Patient Registration**:
   - Click "Register" on the login page
   - Fill in your personal details and create credentials
   - Choose "Patient" as your role
   - Submit the form

2. **Login**:
   - Enter your username and password
   - Click "Login"

### Managing Medical Records

1. **Viewing Your Records**:
   - Navigate to the "Medical Records" tab
   - Your records will be displayed chronologically

2. **Adding a New Record**:
   - Click "Add Medical Record"
   - Fill in the record details
   - Upload any related files
   - Click "Save"

3. **Downloading Records**:
   - Find the record you want to download
   - Click the "Download" button
   - Files will be decrypted and downloaded to your computer

### Managing Access

1. **Granting Access to a Doctor**:
   - Go to the "Access Management" tab
   - Enter the doctor's ID or search by name
   - Select the doctor and click "Grant Access"

2. **Revoking Access**:
   - In the "Access Management" tab, find the doctor in your "Granted Access" list
   - Click "Revoke Access"

## Using the Doctor Dashboard

The Doctor Dashboard allows healthcare providers to access patient records and manage their practice.

### Accessing the Dashboard

Open your browser and navigate to:
```
http://localhost:3002
```

### Registration and Login

1. **New Doctor Registration**:
   - Click "Register" on the login page
   - Fill in your professional details
   - Choose "Doctor" as your role
   - Enter your medical license number and hospital affiliation
   - Submit the form

2. **Login**:
   - Enter your username and password
   - Click "Login"

### Accessing Patient Records

1. **Finding a Patient**:
   - Go to the "Patient Records" tab
   - Search for a patient by ID or name
   - Only patients who have granted you access will appear in search results

2. **Viewing Records**:
   - Select a patient to view their records
   - Records will be displayed chronologically
   - Click on any record to view details

3. **Adding Notes to Records**:
   - Open a patient record
   - Click "Add Medical Note"
   - Enter your observations
   - Click "Save Note"

### System Monitoring

1. **Viewing System Status**:
   - Go to the "System Monitor" tab
   - View the status of all system components
   - Check blockchain node health
   - Monitor IPFS storage

## Administration and Monitoring

### System Monitoring

1. **Service Status**:
   - Access the System Monitor in the Doctor Dashboard
   - View the health status of all services
   - Check for any degraded or down components

2. **Blockchain Network Monitoring**:
   - View the status of all blockchain nodes
   - Monitor peer connections
   - Track block production

### Data Management

1. **Clean and Reset**:
   - To reset blockchain data:
     ```bash
     ./blockchain/scripts/clean-data.sh
     ```
   - Note: This will delete all blockchain data

## Troubleshooting

### Common Issues

1. **Network not starting**:
   - Check logs in `blockchain/logs/`
   - Ensure ports 8545-8548 and 30303-30306 are available
   - Run `lsof -i :8545` to check if the port is in use

2. **Contract deployment failing**:
   - Check that the network is running
   - Verify account has sufficient funds
   - Check logs for errors

3. **IPFS connection issues**:
   - Check if IPFS daemon is running with `ipfs swarm peers`
   - Restart IPFS with `ipfs daemon`

4. **Authentication service issues**:
   - Ensure MongoDB is running with `mongod --version`
   - Check MongoDB connection string in `.env` file
   - Verify JWT_SECRET is properly set

5. **Frontend connection issues**:
   - Check that API Gateway is running
   - Verify API URLs in frontend configuration
   - Check browser console for CORS errors

### Logs

Find logs in these locations:
- Blockchain nodes: `blockchain/logs/`
- API Gateway: Check console output
- Authentication Service: Check console output
- Frontend applications: Check browser console

## FAQ

**Q: How is patient data protected in this system?**

A: Patient data is protected through multiple mechanisms:
1. File encryption using AES-256-GCM before storage on IPFS
2. Blockchain-based access control for records
3. JWT authentication for system access
4. Network permissioning for blockchain nodes

**Q: Can patients revoke access to their records?**

A: Yes, patients can grant and revoke access to their records at any time through the Access Management section of the Patient Portal.

**Q: How are blockchain addresses associated with users?**

A: Users can optionally verify and link their blockchain addresses during registration or from their profile settings.

**Q: What happens if a node goes down?**

A: The system uses a QBFT consensus mechanism that can tolerate up to f=(n-1)/3 node failures (where n is the total number of nodes). With 4 nodes, the system can tolerate 1 node failure.

**Q: Is this system HIPAA compliant?**

A: The system implements several security features that align with HIPAA requirements, including encryption, access controls, and auditing. However, a full HIPAA compliance assessment would need to be conducted for a production deployment.
