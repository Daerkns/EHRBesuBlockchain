#!/bin/bash

# Create directories
mkdir -p /home/vanir/ehr-blockchain/blockchain/nodes/hospital1
mkdir -p /home/vanir/ehr-blockchain/blockchain/nodes/hospital2
mkdir -p /home/vanir/ehr-blockchain/blockchain/nodes/hospital3-validator

# Create data directories if they don't exist
mkdir -p /home/vanir/ehr-blockchain/blockchain/data/hospital1
mkdir -p /home/vanir/ehr-blockchain/blockchain/data/hospital2
mkdir -p /home/vanir/ehr-blockchain/blockchain/data/hospital3-validator
mkdir -p /home/vanir/ehr-blockchain/blockchain/logs

# Get node public keys
PUB_KEY1=$(cat /home/vanir/ehr-blockchain/blockchain/keys/hospital1/key.pub)
PUB_KEY2=$(cat /home/vanir/ehr-blockchain/blockchain/keys/hospital2/key.pub)
PUB_KEY3=$(cat /home/vanir/ehr-blockchain/blockchain/keys/hospital3-validator/key.pub)

# Create config for Hospital 1
cat << EOT > /home/vanir/ehr-blockchain/blockchain/nodes/hospital1/config.toml
data-path="/home/vanir/ehr-blockchain/blockchain/data/hospital1"
genesis-file="/home/vanir/ehr-blockchain/blockchain/genesis/qbft-genesis.json"
node-private-key-file="/home/vanir/ehr-blockchain/blockchain/keys/hospital1/key"
rpc-http-enabled=true
rpc-http-api=["ETH","NET","QBFT","ADMIN","WEB3"]
rpc-http-cors-origins=["*"]
rpc-http-host="0.0.0.0"
rpc-http-port=8545
host-allowlist=["*"]
min-gas-price=0
p2p-port=30303
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
bootnodes=["enode://${PUB_KEY1}@127.0.0.1:30303"]
EOT

# Create config for Hospital 3 (Validator)
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
bootnodes=["enode://${PUB_KEY1}@127.0.0.1:30303"]
EOT

echo "Created config files for all nodes"
