#!/bin/bash

echo "Setting up 4-node QBFT network..."

# Create configuration file
cat << EOT > /home/vanir/ehr-blockchain/blockchain/scripts/qbft-4nodes.json
{
  "genesis": {
    "config": {
      "chainId": 1337,
      "constantinoplefixblock": 0,
      "qbft": {
        "blockperiodseconds": 2,
        "epochlength": 30000,
        "requesttimeoutseconds": 4
      }
    },
    "nonce": "0x0",
    "timestamp": "0x0",
    "gasLimit": "0x1fffffffffffff",
    "difficulty": "0x1",
    "mixHash": "0x63746963616c2062797a616e74696e65206661756c7420746f6c6572616e6365",
    "coinbase": "0x0000000000000000000000000000000000000000"
  },
  "blockchain": {
    "nodes": {
      "generate": true,
      "count": 4
    }
  }
}
EOT

# Create required directories
mkdir -p /home/vanir/ehr-blockchain/blockchain/networkFiles
mkdir -p /home/vanir/ehr-blockchain/blockchain/genesis
mkdir -p /home/vanir/ehr-blockchain/blockchain/keys/hospital1
mkdir -p /home/vanir/ehr-blockchain/blockchain/keys/hospital2
mkdir -p /home/vanir/ehr-blockchain/blockchain/keys/hospital3-validator
mkdir -p /home/vanir/ehr-blockchain/blockchain/keys/hospital4-validator
mkdir -p /home/vanir/ehr-blockchain/blockchain/nodes/hospital1
mkdir -p /home/vanir/ehr-blockchain/blockchain/nodes/hospital2
mkdir -p /home/vanir/ehr-blockchain/blockchain/nodes/hospital3-validator
mkdir -p /home/vanir/ehr-blockchain/blockchain/nodes/hospital4-validator
mkdir -p /home/vanir/ehr-blockchain/blockchain/data/hospital1
mkdir -p /home/vanir/ehr-blockchain/blockchain/data/hospital2
mkdir -p /home/vanir/ehr-blockchain/blockchain/data/hospital3-validator
mkdir -p /home/vanir/ehr-blockchain/blockchain/data/hospital4-validator
mkdir -p /home/vanir/ehr-blockchain/blockchain/logs

# Generate blockchain configuration
echo "Generating blockchain configuration..."
besu operator generate-blockchain-config --config-file=/home/vanir/ehr-blockchain/blockchain/scripts/qbft-4nodes.json --to=/home/vanir/ehr-blockchain/blockchain/networkFiles --private-key-file-name=key

# Copy the genesis file
cp /home/vanir/ehr-blockchain/blockchain/networkFiles/genesis.json /home/vanir/ehr-blockchain/blockchain/genesis/qbft-genesis.json

# Find validator directories
VALIDATOR_DIRS=(/home/vanir/ehr-blockchain/blockchain/networkFiles/keys/*)

if [ ${#VALIDATOR_DIRS[@]} -lt 4 ]; then
  echo "Error: Expected 4 validator directories, but found ${#VALIDATOR_DIRS[@]}"
  ls -la /home/vanir/ehr-blockchain/blockchain/networkFiles/keys/
  exit 1
fi

# Copy keys
cp ${VALIDATOR_DIRS[0]}/key /home/vanir/ehr-blockchain/blockchain/keys/hospital1/
cp ${VALIDATOR_DIRS[1]}/key /home/vanir/ehr-blockchain/blockchain/keys/hospital2/
cp ${VALIDATOR_DIRS[2]}/key /home/vanir/ehr-blockchain/blockchain/keys/hospital3-validator/
cp ${VALIDATOR_DIRS[3]}/key /home/vanir/ehr-blockchain/blockchain/keys/hospital4-validator/

# Copy public keys
cp ${VALIDATOR_DIRS[0]}/key.pub /home/vanir/ehr-blockchain/blockchain/keys/hospital1/
cp ${VALIDATOR_DIRS[1]}/key.pub /home/vanir/ehr-blockchain/blockchain/keys/hospital2/
cp ${VALIDATOR_DIRS[2]}/key.pub /home/vanir/ehr-blockchain/blockchain/keys/hospital3-validator/
cp ${VALIDATOR_DIRS[3]}/key.pub /home/vanir/ehr-blockchain/blockchain/keys/hospital4-validator/

# Extract enode information
NODE1_PUBKEY=$(cat ${VALIDATOR_DIRS[0]}/key.pub)

# Create config for Hospital 1 (first node/bootnode)
cat << EOT > /home/vanir/ehr-blockchain/blockchain/nodes/hospital1/config.toml
data-path="/home/vanir/ehr-blockchain/blockchain/data/hospital1"
genesis-file="/home/vanir/ehr-blockchain/blockchain/genesis/qbft-genesis.json"
node-private-key-file="/home/vanir/ehr-blockchain/blockchain/keys/hospital1/key"
rpc-http-enabled=true
rpc-http-api=["ETH","NET","QBFT","ADMIN","WEB3","MINER"]
rpc-http-cors-origins=["*"]
rpc-http-host="0.0.0.0"
rpc-http-port=8545
host-allowlist=["*"]
min-gas-price=0
p2p-port=30303
p2p-host="0.0.0.0"
miner-enabled=true
miner-coinbase="0xfe3b557e8fb62b89f4916b721be55ceb828dbd73"
# QBFT specific settings
qbft-validator-address="0xfe3b557e8fb62b89f4916b721be55ceb828dbd73"
qbft-block-period-seconds=2
EOT

# Create config for Hospital 2
cat << EOT > /home/vanir/ehr-blockchain/blockchain/nodes/hospital2/config.toml
data-path="/home/vanir/ehr-blockchain/blockchain/data/hospital2"
genesis-file="/home/vanir/ehr-blockchain/blockchain/genesis/qbft-genesis.json"
node-private-key-file="/home/vanir/ehr-blockchain/blockchain/keys/hospital2/key"
rpc-http-enabled=true
rpc-http-api=["ETH","NET","QBFT","ADMIN","WEB3"]
rpc-http-cors-origins=["*"]
rpc-http-host="0.0.0.0"
rpc-http-port=8546
host-allowlist=["*"]
min-gas-price=0
p2p-port=30304
p2p-host="0.0.0.0"
bootnodes=["enode://${NODE1_PUBKEY}@127.0.0.1:30303"]
EOT

# Create config for Hospital 3 Validator
cat << EOT > /home/vanir/ehr-blockchain/blockchain/nodes/hospital3-validator/config.toml
data-path="/home/vanir/ehr-blockchain/blockchain/data/hospital3-validator"
genesis-file="/home/vanir/ehr-blockchain/blockchain/genesis/qbft-genesis.json"
node-private-key-file="/home/vanir/ehr-blockchain/blockchain/keys/hospital3-validator/key"
rpc-http-enabled=true
rpc-http-api=["ETH","NET","QBFT","ADMIN","WEB3"]
rpc-http-cors-origins=["*"]
rpc-http-host="0.0.0.0"
rpc-http-port=8547
host-allowlist=["*"]
min-gas-price=0
p2p-port=30305
p2p-host="0.0.0.0"
bootnodes=["enode://${NODE1_PUBKEY}@127.0.0.1:30303"]
EOT

# Create config for Hospital 4 Validator
cat << EOT > /home/vanir/ehr-blockchain/blockchain/nodes/hospital4-validator/config.toml
data-path="/home/vanir/ehr-blockchain/blockchain/data/hospital4-validator"
genesis-file="/home/vanir/ehr-blockchain/blockchain/genesis/qbft-genesis.json"
node-private-key-file="/home/vanir/ehr-blockchain/blockchain/keys/hospital4-validator/key"
rpc-http-enabled=true
rpc-http-api=["ETH","NET","QBFT","ADMIN","WEB3"]
rpc-http-cors-origins=["*"]
rpc-http-host="0.0.0.0"
rpc-http-port=8548
host-allowlist=["*"]
min-gas-price=0
p2p-port=30306
p2p-host="0.0.0.0"
bootnodes=["enode://${NODE1_PUBKEY}@127.0.0.1:30303"]
EOT

# Create start-network script
cat << EOT > /home/vanir/ehr-blockchain/blockchain/scripts/start-4node-network.sh
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
EOT

chmod +x /home/vanir/ehr-blockchain/blockchain/scripts/start-4node-network.sh

echo "4-node QBFT network setup complete!"
echo "Run the following command to start the network:"
echo "./start-4node-network.sh"
