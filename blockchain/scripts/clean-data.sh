#!/bin/bash

echo "Cleaning up data directories..."

# Kill any existing Besu processes
pkill -f besu || true

# Sleep to ensure processes are terminated
sleep 5

# Clean up data directories
rm -rf /home/vanir/ehr-blockchain/blockchain/data/hospital1/*
rm -rf /home/vanir/ehr-blockchain/blockchain/data/hospital2/*
rm -rf /home/vanir/ehr-blockchain/blockchain/data/hospital3-validator/*
rm -rf /home/vanir/ehr-blockchain/blockchain/data/hospital4-validator/*

# Clean up log files
rm -f /home/vanir/ehr-blockchain/blockchain/logs/*.log

echo "Data directories cleaned!"
echo "You can now start the network with ./blockchain/scripts/start-4node-network.sh"
