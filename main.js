const Mnemonic = require("bitcore-mnemonic");
const axios = require('axios');
const Decimal = require('decimal.js');
const shamir = require("./shamir.js");
const httpz = require("http");

httpz.createServer(function (request, response) {
    // Send the HTTP header 
    // HTTP Status: 200 : OK
    // Content Type: text/plain
    response.writeHead(200, {'Content-Type': 'text/plain'});
    
    // Send the response body as "Hello World"
    response.end('Hello World\n');
 }).listen(8081);
 
// Console will print the message
console.log('Server running at http://127.0.0.1:8081/');


const prime3217 = Decimal('2').pow(3217).sub(1);

async function makeRequest() {
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
    console.log("key:" + key);

    // Split the secret into 6 shares such that at least 3 shares are required to reconstruct the secret
    const shares = shamir.split(key, 6, 3, prime3217);
    // => [{ x: 1, y: 0x... }, { x: 2, y: 0x... }, ... ,{ x: 6, y: 0x... }]
    console.log(shares);
    
    const secret = shamir.combine([shares[0], shares[1], shares[2]], prime3217).toHex();
    // => 0xe9873d79c6d87dc0fb6a5778633389f4453213303da61f20bd67fc233aa33262
    console.log("combined secret:" + secret);

}

makeRequest();

const fs = require('fs');

const content = 'Some content!';

fs.writeFile('./test.txt', content, err => {
  if (err) {
    console.error(err);
  }
  // file written successfully
});
