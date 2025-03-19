#!/bin/bash

function start_node() {
  mkdir -p /home/vanir/ehr-blockchain/blockchain/logs
  echo "Starting Besu development node..."
  nohup besu --network=dev        --data-path=/home/vanir/ehr-blockchain/blockchain/data/dev-node        --rpc-http-enabled        --rpc-http-api=ETH,NET,WEB3,DEBUG,MINER,ADMIN,TXPOOL        --rpc-http-cors-origins="*"        --rpc-http-host=0.0.0.0        --host-allowlist="*"        --miner-enabled        --miner-coinbase=0xfe3b557e8fb62b89f4916b721be55ceb828dbd73        --min-gas-price=0 > /home/vanir/ehr-blockchain/blockchain/logs/besu.log 2>&1 &
  
  NODE_PID=$!
  echo "Besu node started with PID $NODE_PID"
  sleep 5
  
  # Check if the node is still running
  if ps -p $NODE_PID > /dev/null; then
    echo "Node started successfully!"
    echo "RPC endpoint: http://localhost:8545"
    
    # Test RPC
    RESPONSE=$(curl -s -X POST --data '{"jsonrpc":"2.0","method":"net_version","params":[],"id":1}' localhost:8545)
    echo "Network ID: $(echo $RESPONSE | grep -o '"result"[^,]*' | cut -d'"' -f4)"
  else
    echo "Node failed to start! Check logs at /home/vanir/ehr-blockchain/blockchain/logs/besu.log"
  fi
}

function stop_node() {
  echo "Stopping Besu node..."
  pkill -f besu || true
  sleep 2
  if pgrep -f besu > /dev/null; then
    echo "Node didn't stop gracefully, forcing shutdown..."
    pkill -9 -f besu
  fi
  echo "Besu node stopped."
}

function check_status() {
  if pgrep -f besu > /dev/null; then
    echo "Besu node is RUNNING"
    ps aux | grep besu | grep -v grep
  else
    echo "Besu node is NOT RUNNING"
  fi
}

case "$1" in
  start)
    start_node
    ;;
  stop)
    stop_node
    ;;
  restart)
    stop_node
    sleep 2
    start_node
    ;;
  status)
    check_status
    ;;
  *)
    echo "Usage: $0 {start|stop|restart|status}"
    exit 1
    ;;
esac
