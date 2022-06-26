#!/usr/bin/env node

var argv = require('yargs/yargs')(process.argv.slice(2)).argv;
const key = require("./key.js");

(async function () {
    await key.generateKeyShares(argv.apikey, argv.numshares, argv.threshold).catch((e) => { console.error(e); process.exit(1) })
    })()