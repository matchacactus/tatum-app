#!/usr/bin/env node
import dotenv from 'dotenv';
dotenv.config();

import meow from 'meow';
import { Config, ConfigOption } from './config'
const config = new Config()

const axiosInstance = axios.create({
    httpAgent: new http.Agent({ keepAlive: true }),
    httpsAgent: new https.Agent({ keepAlive: true })
});

const { input: command, flags } = meow(`
    Usage
        $ tatum-ssss command

    Commands
        generate-key-shares               Generate the number of key shares. 

    Options
        --api-key                         Tatum API Key to communicate with Tatum API.
        --num-shares                      Indicates the number of key shares to be generated
        --threshold                       Indicates the minimum number of key shares to retrive the full private key.

`, {
    flags: {
        'api-key': {
            type: 'string',
        },
        'num-shares': {
            type: 'number',
            default: 6,
        },
        'threshold': {
            type: 'number',
            default: 3,
        }
    }
});
const startup = async () => {
    if (command.length === 0) {
        return;
    }
    switch (command[0]) {
        case 'generate-key-shares':
            await getAddress(command[1], command[2], flags.path);
            break;
        default:
            console.error('Unsupported command. Use tatum-kms --help for details.');
            process.exit(-1);
    }
};

startup();
