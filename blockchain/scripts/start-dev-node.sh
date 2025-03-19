#!/bin/bash

# Kill any existing Besu processes
pkill -f besu || true

# Sleep to ensure processes are terminated
sleep 5

# Start dev node with mining enabled
echo "Starting Besu node with mining enabled..."

# Execute Besu with full command line options
besu --data-path=/home/vanir/ehr-blockchain/blockchain/data/dev-node      --genesis-file=/home/vanir/ehr-blockchain/blockchain/genesis/dev-genesis.json      --rpc-http-enabled      --rpc-http-api=ETH,NET,WEB3,IBFT,MINER      --rpc-http-cors-origins="*"      --rpc-http-host=0.0.0.0      --rpc-http-port=8545      --host-allowlist="*"      --min-gas-price=0      --miner-enabled      --miner-coinbase=0xfe3b557e8fb62b89f4916b721be55ceb828dbd73
