// const hre = require("hardhat");
// import { providers, ethers, Wallet, Contract } from "ethers";
// import { Recipe, actions } from "test-trava-station-sdk";
// import DSProxyAbi from "../../src/abis/Dsproxy.json";
// import ProxyRegisterAbi from "../../src/abis/IProxyRegistry.json";
// import veTravaAbi from "../../src/abis/IVotingEscrow.json";

// require('dotenv').config();

// async function nfttest() {
//     const public_key = `${process.env.PUBLIC_KEY}`;
//     const private_key = `0x${process.env.PRIVATE_KEY}`;
//     const dsProxyRegistryAddress = `${process.env.DS_PROXY_REGISTRY_ADDRESS}`;
//     const veTravaAddress = `${process.env.VE_TRAVA_ADDRESS}`;

//     let url = "https://bsc-testnet.publicnode.com";
//     const provider = new ethers.providers.JsonRpcProvider(url);
//     const wallet = new Wallet(private_key, provider);

//     const proxyRegistry = new Contract(dsProxyRegistryAddress, ProxyRegisterAbi, wallet);
//     let proxyAddr = await proxyRegistry.proxies(public_key);

//     console.log("smart wallet " + proxyAddr);

//     const trava_vetrava_cancel_sale = new actions.trava.TravaNFTVeTravaCancelSale(
//         "39",
//         public_key,
//         "0xBd206068bfC8D50d9f0b5733Fe0D28b5C5A4f13c"
//     )

//     const recipe = new Recipe("Test-ve-trava-cancel-sale",
//         97,
//         [
//             trava_vetrava_cancel_sale
//         ]);
    
//     const encoded = recipe.encodeForDsProxyCall();
    
//     const proxyContract = new Contract("0x826D824BE55A403859A6Db67D5EeC5aC386307fE", DSProxyAbi, wallet);
//     let tx = await proxyContract["execute(address,bytes)"](encoded[0] as string, encoded[1] as unknown as string[],{ gasLimit: 5000000 })
//     await tx.wait();

//     console.log(tx);
//     console.log("Cancel sale success");

// }

// nfttest();
