#!/bin/bash

echo "Starting EHR Blockchain System..."

# Step 1: Set up and start the blockchain network
echo "Step 1: Setting up and starting the blockchain network..."
./blockchain/scripts/setup-and-deploy.sh

# Step 2: Start the API Gateway
echo "Step 2: Starting the API Gateway..."
./api-gateway/start-api.sh

echo "EHR Blockchain System is now running!"
echo ""
echo "Network Information:"
echo "- Hospital 1 RPC: http://localhost:8545"
echo "- Hospital 2 RPC: http://localhost:8546"
echo "- Hospital 3 RPC: http://localhost:8547"
echo "- Hospital 4 RPC: http://localhost:8548"
echo "- API Gateway: http://localhost:3000"
echo ""
echo "To stop the system, press Ctrl+C"
