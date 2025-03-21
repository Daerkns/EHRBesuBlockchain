#!/bin/bash

# Create a directory for the keystore if it doesn't exist
mkdir -p /home/vanir/ehr-blockchain/blockchain/data/hospital1/keystore

# Create a test account (replace with your own private key if you have one)
echo '{"address":"fe3b557e8fb62b89f4916b721be55ceb828dbd73","crypto":{"cipher":"aes-128-ctr","ciphertext":"f05927d7570d22a8b74efe9f6052315f368965ec3bb7e2ad68521a26b08c889a","cipherparams":{"iv":"d2d4d846ac06a237d521130637471397"},"kdf":"scrypt","kdfparams":{"dklen":32,"n":262144,"p":1,"r":8,"salt":"3d4a0c865feaa3100f768c2af3e4a4691e1c40909fb7474c4ce571586e2a39a5"},"mac":"aa2a9c21c82fa4d3d54bb5129cc6185a12e839c4a0c4de9b626a8b919d3d9a9a"},"id":"ac0e9f2c-df2d-4180-b37f-80ac3d37410f","version":3}' > /home/vanir/ehr-blockchain/blockchain/data/hospital1/keystore/key1

echo "Test account imported with address: 0xfe3b557e8fb62b89f4916b721be55ceb828dbd73"
echo "Private key: 0x8f2a55949038a9610f50fb23b5883af3b4ecb3c3bb792cbcefbd1542c692be63"
