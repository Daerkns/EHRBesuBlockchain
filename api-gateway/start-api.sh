#!/bin/bash

echo "Starting EHR Blockchain API Gateway..."

# Check if IPFS is running
echo "Checking IPFS daemon..."
ipfs --version > /dev/null 2>&1
if [ $? -ne 0 ]; then
  echo "IPFS not found. Installing IPFS..."
  cd /home/vanir/ehr-blockchain/api-gateway/kubo
  ./install.sh
  cd /home/vanir/ehr-blockchain/api-gateway
else
  echo "IPFS is installed."
fi

# Start IPFS daemon if not running
ipfs swarm peers > /dev/null 2>&1
if [ $? -ne 0 ]; then
  echo "Starting IPFS daemon..."
  ipfs init --profile server
  ipfs daemon --enable-pubsub-experiment &
  IPFS_PID=$!
  echo "IPFS daemon started with PID $IPFS_PID"
  sleep 5
else
  echo "IPFS daemon is already running."
fi

# Set environment variables
export BESU_NODE_URL=http://localhost:8545
export IPFS_API_URL=/ip4/127.0.0.1/tcp/5001

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

# Start the API gateway
echo "Starting API Gateway..."
node src/app.js
