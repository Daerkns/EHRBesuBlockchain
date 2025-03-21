#!/bin/bash

# Start the Auth Service
echo "Starting Auth Service..."

# Check if MongoDB is running
echo "Checking MongoDB connection..."
mongo --eval "db.adminCommand('ping')" > /dev/null 2>&1
if [ $? -ne 0 ]; then
  echo "MongoDB is not running. Please start MongoDB first."
  echo "You can start MongoDB with: sudo systemctl start mongod"
  exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

# Start the service
echo "Starting Auth Service on port $(grep PORT .env | cut -d '=' -f2)..."
node src/app.js
