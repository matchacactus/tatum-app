const Mnemonic = require("bitcore-mnemonic");
const axios = require('axios');
const Decimal = require('decimal.js');
const shamir = require("./shamir.js");

const prime3217 = Decimal('2').pow(3217).sub(1);

async function generateKeyShares(apikey, numshares, threshold) {
    const config = {
        method: 'get',
        url: `https://api-us-west1.tatum.io/v3/bitcoin/wallet`,
        headers: { 'x-api-key': apikey }
    }

    let res = await axios(config)

    const mnemonic = new Mnemonic(res.data["mnemonic"])
    const derived = mnemonic.toHDPrivateKey().derive("m/44'/60'/0'/0/0")
    const key = "0x"+derived.privateKey.toBuffer().toString("hex")
    // uncomment to compare the private key with the combined secret result.
    console.log("original private key:" + key);

    // Split the secret into [num] shares such that at least [threshold] shares are required to reconstruct the secret
    const shares = shamir.split(key, numshares, threshold, prime3217);
    // => [{ x: 1, y: 0x... }, { x: 2, y: 0x... }, ... ,{ x: 6, y: 0x... }]
    // uncomment to see the full shares details.
    console.log("secret shares: ");
    console.log(shares);
    
    const secret = shamir.combine([shares[0], shares[1], shares[2]], prime3217).toHex();
    // example => 0xe9873d79c6d87dc0fb6a5778633389f4453213303da61f20bd67fc233aa33262
    console.log("combined secret:" + secret);
}

exports.generateKeyShares = generateKeyShares;