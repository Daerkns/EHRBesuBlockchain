#!/bin/bash

# Kill any existing Besu processes
pkill -f besu || true

# Sleep to ensure processes are terminated
sleep 5

# Remove existing data to start fresh
rm -rf /home/vanir/ehr-blockchain/blockchain/data/dev-node

echo "Starting Besu in development mode..."

# Run Besu in dev mode (simplest for development)
besu --network=dev      --data-path=/home/vanir/ehr-blockchain/blockchain/data/dev-node      --rpc-http-enabled      --rpc-http-api=ETH,NET,WEB3,DEBUG,MINER,ADMIN,TXPOOL      --rpc-http-cors-origins="*"      --rpc-http-host=0.0.0.0      --host-allowlist="*"      --miner-enabled      --miner-coinbase=0xfe3b557e8fb62b89f4916b721be55ceb828dbd73      --min-gas-price=0
