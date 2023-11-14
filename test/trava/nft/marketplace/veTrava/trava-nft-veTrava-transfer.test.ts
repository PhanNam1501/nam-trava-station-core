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
//     const public_key2 = "0x2b3fBc2c23E300C6A188e790E59668D501F2568a";

//     let url = "https://bsc-testnet.publicnode.com";
//     const provider = new ethers.providers.JsonRpcProvider(url);
//     const wallet = new Wallet(private_key, provider);

//     const proxyRegistry = new Contract(dsProxyRegistryAddress, ProxyRegisterAbi, wallet);
//     let proxyAddr = await proxyRegistry.proxies(public_key);

//     console.log("smart wallet " + proxyAddr);

//     const VeTravaContract = new Contract(veTravaAddress, veTravaAbi , wallet);
//     let tx_approve = await VeTravaContract.approve(proxyAddr , 39);

//     console.log("Success approve");

//     let owner = await VeTravaContract.ownerOf(39);
//     console.log(owner);

   
//     const trava_vetrava_transfer = new actions.trava.TravaNFTTransfer(
//         public_key,
//         public_key2,
//         "39",
//         veTravaAddress,
//         "0x7D2AA60a1741a52F66f81EA2acb30e5BF3761A55"
//     )
//     const recipe = new Recipe("Test-ve-trava-transfer",
//         97,
//         [
//             trava_vetrava_transfer
//         ]);
    
//     const encoded = recipe.encodeForDsProxyCall();
    
//     const proxyContract = new Contract("0x826D824BE55A403859A6Db67D5EeC5aC386307fE", DSProxyAbi, wallet);
//     let tx = await proxyContract["execute(address,bytes)"](encoded[0] as string, encoded[1] as unknown as string[],{ gasLimit: 5000000 })
//     await tx.wait();

//     console.log(tx);
//     console.log("Transfer success");
// }

// nfttest();
