#!/bin/bash

# Create directories
mkdir -p /home/vanir/ehr-blockchain/blockchain/keys/hospital1
mkdir -p /home/vanir/ehr-blockchain/blockchain/keys/hospital2
mkdir -p /home/vanir/ehr-blockchain/blockchain/keys/hospital3-validator

# Generate keys for each node
besu --data-path=/home/vanir/ehr-blockchain/blockchain/keys/hospital1 public-key export --to=/home/vanir/ehr-blockchain/blockchain/keys/hospital1/key.pub
besu --data-path=/home/vanir/ehr-blockchain/blockchain/keys/hospital2 public-key export --to=/home/vanir/ehr-blockchain/blockchain/keys/hospital2/key.pub
besu --data-path=/home/vanir/ehr-blockchain/blockchain/keys/hospital3-validator public-key export --to=/home/vanir/ehr-blockchain/blockchain/keys/hospital3-validator/key.pub

echo "Generated keys for all nodes"
