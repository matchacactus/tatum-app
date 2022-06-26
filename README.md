# Tatum Powered Wallet with Secret Share

Currently the generate wallet function provided by Tatum supports AES encryption. The most promoninent problem is when the key holder can be unavailble or disappeared and the private key to the wallet is permanently lost. 

Shamir's Secret Sharing is a solution to split the private into number of shares, and a minimum number of shares is required to retrieve the private key. This is more secure and distributed way to store private key for a wallet. 

The implementation utilized the Tatum API for wallet generation.

# Install

`npm install`

# Run

`node index.js --apikey='0d0978ea-92f9-44e1-803d-715dbfd4b568' --numshares=5 --threshold=3`
