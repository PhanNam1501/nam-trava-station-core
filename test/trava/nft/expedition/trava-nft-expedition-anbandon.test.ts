// import { Contract, Wallet, ethers } from 'ethers';
// import NFTCollectionabi from "../../src/abis/NFTCollection.json";
// import DSProxyAbi from "../../src/abis/Dsproxy.json";
// import ProxyRegisterAbi from "../../src/abis/IProxyRegistry.json";
// import { actions } from "test-trava-station-sdk";
// import { Recipe } from "test-trava-station-sdk";
// const hre = require("hardhat");
// require('dotenv').config();

// async function test() {
//     let url = "https://bsc-testnet.publicnode.com";
//     const provider = new ethers.providers.JsonRpcProvider(url);
//     const private_key = `0x${process.env.PRIVATE_KEY}`;
//     const public_key = `${process.env.PUBLIC_KEY}`;
//     const wallet = new Wallet(private_key, provider);
//     const dsProxyRegistryAddress = `${process.env.DS_PROXY_REGISTRY_ADDRESS}`;

//     const proxyRegistry = new Contract(dsProxyRegistryAddress, ProxyRegisterAbi, wallet);
//     let proxy_address = await proxyRegistry.proxies(public_key);

//     const vault = "0xD87998eE32f946D2bA9EEeD90cF3417C7A1c6524";

//     const trava_nft_expedition_abandon = new actions.trava.TravaNFTExpeditionAbandon(
//         vault,
//         "136",
//         public_key,
//         "0xE7C6aD8b6E1325517Dcb97838b1C71227e809f56"
//     )

//     const recipe = new Recipe(
//         "expedition-deploy",
//         97,
//         [
//             trava_nft_expedition_abandon
//         ]
//     );

//     const encoded = recipe.encodeForDsProxyCall();

//     const proxyContract = new Contract("0x826D824BE55A403859A6Db67D5EeC5aC386307fE", DSProxyAbi, wallet);
//     let tx = await proxyContract["execute(address,bytes)"](encoded[0] as string, encoded[1] as unknown as string[], { gasLimit: 5000000 })
//     await tx.wait();
//     console.log(tx);
    
//     console.log("Success abandon")
// }

// test();