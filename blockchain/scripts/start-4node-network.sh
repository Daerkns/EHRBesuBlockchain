#!/bin/bash

# Kill any existing Besu processes
pkill -f besu || true

# Sleep to ensure processes are terminated
sleep 5

# Create data and logs directories if they don't exist
mkdir -p /home/vanir/ehr-blockchain/blockchain/data/hospital1
mkdir -p /home/vanir/ehr-blockchain/blockchain/data/hospital2
mkdir -p /home/vanir/ehr-blockchain/blockchain/data/hospital3-validator
mkdir -p /home/vanir/ehr-blockchain/blockchain/data/hospital4-validator
mkdir -p /home/vanir/ehr-blockchain/blockchain/logs

# Start Hospital 1 Node
echo "Starting Hospital 1 Node..."
besu --config-file=/home/vanir/ehr-blockchain/blockchain/nodes/hospital1/config.toml > /home/vanir/ehr-blockchain/blockchain/logs/hospital1.log 2>&1 &
HOSPITAL1_PID=$!
echo "Hospital 1 started with PID $HOSPITAL1_PID"

# Wait for node 1 to start
sleep 15

# Start Hospital 2 Node
echo "Starting Hospital 2 Node..."
besu --config-file=/home/vanir/ehr-blockchain/blockchain/nodes/hospital2/config.toml > /home/vanir/ehr-blockchain/blockchain/logs/hospital2.log 2>&1 &
HOSPITAL2_PID=$!
echo "Hospital 2 started with PID $HOSPITAL2_PID"

# Wait for node 2 to start
sleep 5

# Start Hospital 3 Validator Node
echo "Starting Hospital 3 Validator Node..."
besu --config-file=/home/vanir/ehr-blockchain/blockchain/nodes/hospital3-validator/config.toml > /home/vanir/ehr-blockchain/blockchain/logs/hospital3-validator.log 2>&1 &
HOSPITAL3_PID=$!
echo "Hospital 3 started with PID $HOSPITAL3_PID"

# Wait for node 3 to start
sleep 5

# Start Hospital 4 Validator Node
echo "Starting Hospital 4 Validator Node..."
besu --config-file=/home/vanir/ehr-blockchain/blockchain/nodes/hospital4-validator/config.toml > /home/vanir/ehr-blockchain/blockchain/logs/hospital4-validator.log 2>&1 &
HOSPITAL4_PID=$!
echo "Hospital 4 started with PID $HOSPITAL4_PID"

echo "Network started! Nodes are running in the background."
echo "Check logs in /home/vanir/ehr-blockchain/blockchain/logs/"

# Verify nodes are running
sleep 10
echo "Running Besu processes:"
ps aux | grep besu | grep -v grep

# Test HTTP RPC endpoint
echo "Testing HTTP RPC endpoint..."
curl -X POST --data '{"jsonrpc":"2.0","method":"net_version","params":[],"id":1}' localhost:8545
echo ""

# Test QBFT consensus
echo "Testing QBFT consensus..."
curl -X POST --data '{"jsonrpc":"2.0","method":"qbft_getValidatorsByBlockNumber","params":["latest"],"id":1}' localhost:8545
echo ""
