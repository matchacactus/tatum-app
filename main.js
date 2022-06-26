const Mnemonic = require("bitcore-mnemonic");
const axios = require('axios');
const Decimal = require('decimal.js');
const shamir = require("./shamir.js");

const prime3217 = Decimal('2').pow(3217).sub(1);

async function generateKeyShares(num, threshold) {
    const config = {
        method: 'get',
        url: `https://api-us-west1.tatum.io/v3/bitcoin/wallet`,
        headers: { 'x-api-key': '0d0978ea-92f9-44e1-803d-715dbfd4b568' }
    }

    let res = await axios(config)

    console.log(res.data["mnemonic"]);

    const mnemonic = new Mnemonic(res.data["mnemonic"])
    const derived = mnemonic.toHDPrivateKey().derive("m/44'/60'/0'/0/0")
    const key = "0x"+derived.privateKey.toBuffer().toString("hex")
    // uncomment to compare the private key with the combined secret result.
    // console.log("key:" + key);

    // Split the secret into [num] shares such that at least [threshold] shares are required to reconstruct the secret
    const shares = shamir.split(key, num, threshold, prime3217);
    // => [{ x: 1, y: 0x... }, { x: 2, y: 0x... }, ... ,{ x: 6, y: 0x... }]
    // uncomment to see the full shares details.
    // console.log(shares);
    
    const secret = shamir.combine([shares[0], shares[4], shares[5]], prime3217).toHex();
    // => 0xe9873d79c6d87dc0fb6a5778633389f4453213303da61f20bd67fc233aa33262
    console.log("combined secret:" + secret);
}