#!/bin/bash

echo "Starting EHR Blockchain System..."

# Step 1: Set up and start the blockchain network
echo "Step 1: Setting up and starting the blockchain network..."
./blockchain/scripts/setup-and-deploy.sh

# Step 2: Start the Auth Service
echo "Step 2: Starting the Auth Service..."
./auth-service/start-auth.sh &
AUTH_PID=$!
echo "Auth Service started with PID: $AUTH_PID"

# Step 3: Start the API Gateway
echo "Step 3: Starting the API Gateway..."
./api-gateway/start-api.sh &
API_PID=$!
echo "API Gateway started with PID: $API_PID"

echo "EHR Blockchain System is now running!"
echo ""
echo "Network Information:"
echo "- Hospital 1 RPC: http://localhost:8545"
echo "- Hospital 2 RPC: http://localhost:8546"
echo "- Hospital 3 RPC: http://localhost:8547"
echo "- Hospital 4 RPC: http://localhost:8548"
echo "- Auth Service: http://localhost:4000"
echo "- API Gateway: http://localhost:3000"
echo ""
echo "To stop the system, press Ctrl+C"

# Handle graceful shutdown
trap 'echo "Shutting down services..."; kill $AUTH_PID $API_PID; wait' INT TERM
wait
