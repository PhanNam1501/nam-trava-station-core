const {ethers} = require("ethers");

const chainId ="0x0038";
const loggerAddress = "0x37CfAC15ede74F29Fe164C460974BD61cC799eff";
const wss = "wss://bsc.publicnode.com";


async function updateRecipeUse() {
    const provider = new ethers.providers.WebSocketProvider(wss);
    // const provider = new ethers.JsonRpcProvider("https://bsc.publicnode.com");
    // console.log((await provider.getNetwork()).chainId)
    const loggerABI = [
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "caller",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "string",
                    "name": "logName",
                    "type": "string"
                },
                {
                    "indexed": false,
                    "internalType": "bytes",
                    "name": "data",
                    "type": "bytes"
                }
            ],
            "name": "ActionDirectEvent",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "caller",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "string",
                    "name": "logName",
                    "type": "string"
                }
            ],
            "name": "RecipeEvent",
            "type": "event"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "_logName",
                    "type": "string"
                },
                {
                    "internalType": "bytes",
                    "name": "_data",
                    "type": "bytes"
                }
            ],
            "name": "logActionDirectEvent",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "_logName",
                    "type": "string"
                }
            ],
            "name": "logRecipeEvent",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        }
    ];
    const loggerContract = new ethers.Contract(
        loggerAddress,
        loggerABI,
        provider
    );
    console.log(loggerContract)
  
    const filter = {
        event: "RecipeEvent",
        fromBlock: 31952098, // Start block number
        toBlock: 31952070,   // End at the latest block
    };

    // Use the filter to get events(address,string)
    console.log(1111);
    let x = await loggerContract.queryFilter("*")
    console.log(x)
}

updateRecipeUse();