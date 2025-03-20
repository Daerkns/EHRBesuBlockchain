#!/bin/bash

echo "Setting up and deploying the EHR Blockchain system..."

# Step 1: Clean up existing data
echo "Step 1: Cleaning up existing data..."
./blockchain/scripts/clean-data.sh

# Step 2: Start the 4-node network
echo "Step 2: Starting the 4-node network..."
./blockchain/scripts/start-4node-network.sh

# Wait for the network to stabilize
echo "Waiting for the network to stabilize (30 seconds)..."
sleep 30

# Step 3: Test the network
echo "Step 3: Testing the network..."
./blockchain/scripts/test-network.sh

# Step 4: Deploy the smart contracts
echo "Step 4: Deploying smart contracts..."
cd blockchain
node scripts/deploy.js
cd ..

# Step 5: Verify contract deployment
echo "Step 5: Verifying contract deployment..."
if [ -f "blockchain/build/contract-addresses.json" ]; then
    echo "Contract addresses:"
    cat blockchain/build/contract-addresses.json
    echo ""
    echo "✅ Contracts deployed successfully!"
else
    echo "❌ Contract deployment failed. Check logs for errors."
    exit 1
fi

echo ""
echo "EHR Blockchain system setup complete!"
echo ""
echo "Network Information:"
echo "- Hospital 1 RPC: http://localhost:8545"
echo "- Hospital 2 RPC: http://localhost:8546"
echo "- Hospital 3 RPC: http://localhost:8547"
echo "- Hospital 4 RPC: http://localhost:8548"
echo ""
echo "To interact with the contracts, use the addresses in blockchain/build/contract-addresses.json"
