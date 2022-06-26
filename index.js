const meow = require("meow");

const { input: command } = meow(`
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
            await generateKeyShares(command[1], command[2]);
            break;
        default:
            console.error('Unsupported command. Use tatum-ssss --help for details.');
            process.exit(-1);
    }
};

startup();
