#!/bin/bash

# Create genesis directory if it doesn't exist
mkdir -p /home/vanir/ehr-blockchain/blockchain/genesis

# Create a genesis file
cat << EOT > /home/vanir/ehr-blockchain/blockchain/genesis/qbft-genesis.json
{
  "config": {
    "chainId": 1337,
    "qbft": {
      "blockperiodseconds": 5,
      "epochlength": 30000,
      "requesttimeoutseconds": 10
    }
  },
  "nonce": "0x0",
  "timestamp": "0x0",
  "gasLimit": "0x1fffffffffffff",
  "difficulty": "0x1",
  "mixHash": "0x63746963616c2062797a616e74696e65206661756c7420746f6c6572616e6365",
  "coinbase": "0x0000000000000000000000000000000000000000",
  "alloc": {},
  "extraData": "0xf87ea00000000000000000000000000000000000000000000000000000000000000000f8549434f22f6374061187efe207b9c21ed895f772463a4946d3c975e5d2979c8298af0a4ae11f9fe3fd8a254949153d29e9cc592d2f5955dc379116106b5bc83ab808400000000c0"
}
EOT

echo "Genesis file created at: /home/vanir/ehr-blockchain/blockchain/genesis/qbft-genesis.json"
