#!/bin/bash

echo "Stopping any running Besu nodes..."
pkill -f besu || true

echo "Clearing existing blockchain data..."
rm -rf /home/vanir/ehr-blockchain/blockchain/data/dev-node

echo "Starting fresh Besu node in development mode..."
besu --network=dev \
     --data-path=/home/vanir/ehr-blockchain/blockchain/data/dev-node \
     --miner-enabled \
     --miner-coinbase=0xfe3b557e8fb62b89f4916b721be55ceb828dbd73 \
     --rpc-http-enabled \
     --rpc-http-api=ETH,NET,WEB3,DEBUG,MINER \
     --host-allowlist="*" \
     --rpc-http-cors-origins="*" \
     --min-gas-price=0
