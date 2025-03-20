#!/bin/bash

echo "Testing 4-node QBFT network..."

# Test HTTP RPC endpoints for all nodes
echo "Testing HTTP RPC endpoints..."

echo "Hospital 1 (8545):"
curl -s -X POST --data '{"jsonrpc":"2.0","method":"net_version","params":[],"id":1}' localhost:8545 | jq

echo "Hospital 2 (8546):"
curl -s -X POST --data '{"jsonrpc":"2.0","method":"net_version","params":[],"id":1}' localhost:8546 | jq

echo "Hospital 3 (8547):"
curl -s -X POST --data '{"jsonrpc":"2.0","method":"net_version","params":[],"id":1}' localhost:8547 | jq

echo "Hospital 4 (8548):"
curl -s -X POST --data '{"jsonrpc":"2.0","method":"net_version","params":[],"id":1}' localhost:8548 | jq

# Test peer connections
echo "Testing peer connections..."

echo "Hospital 1 peers:"
curl -s -X POST --data '{"jsonrpc":"2.0","method":"admin_peers","params":[],"id":1}' localhost:8545 | jq '.result | length'

echo "Hospital 2 peers:"
curl -s -X POST --data '{"jsonrpc":"2.0","method":"admin_peers","params":[],"id":1}' localhost:8546 | jq '.result | length'

echo "Hospital 3 peers:"
curl -s -X POST --data '{"jsonrpc":"2.0","method":"admin_peers","params":[],"id":1}' localhost:8547 | jq '.result | length'

echo "Hospital 4 peers:"
curl -s -X POST --data '{"jsonrpc":"2.0","method":"admin_peers","params":[],"id":1}' localhost:8548 | jq '.result | length'

# Test QBFT consensus
echo "Testing QBFT consensus..."

echo "Current validators:"
curl -s -X POST --data '{"jsonrpc":"2.0","method":"qbft_getValidatorsByBlockNumber","params":["latest"],"id":1}' localhost:8545 | jq

# Check block production
echo "Checking block production..."
BLOCK_NUMBER_1=$(curl -s -X POST --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' localhost:8545 | jq -r '.result')
echo "Current block number: $BLOCK_NUMBER_1"

echo "Waiting 10 seconds for new blocks..."
sleep 10

BLOCK_NUMBER_2=$(curl -s -X POST --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' localhost:8545 | jq -r '.result')
echo "New block number: $BLOCK_NUMBER_2"

if [ "$BLOCK_NUMBER_1" != "$BLOCK_NUMBER_2" ]; then
  echo "✅ Block production is working!"
else
  echo "❌ No new blocks produced. Check node logs for issues."
fi

echo "Network testing complete!"
