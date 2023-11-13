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

//     const VeTravaContract = new Contract(veTravaAddress, veTravaAbi , wallet);
//     let tx_approve = await VeTravaContract.approve(proxyAddr, 39);
//     await tx_approve.wait();

//     console.log("Approve for proxy success");

//     let owner = await VeTravaContract.ownerOf(39);
//     console.log(owner);

//     const trava_vetrava_create_sale = new actions.trava.TravaNFTVeTravaCreateSale(
//         "39",
//         BigInt(1e21).toString(),
//         "1",
//         public_key,
//         "0x74B2561141931a212769B86778C18d2501979Ed1"
//     )

//     const recipe = new Recipe("Test-ve-trava-create-sale",
//         97,
//         [
//             trava_vetrava_create_sale
//         ]);
    
//     const encoded = recipe.encodeForDsProxyCall();
    
//     const proxyContract = new Contract("0x826D824BE55A403859A6Db67D5EeC5aC386307fE", DSProxyAbi, wallet);
//     let tx = await proxyContract["execute(address,bytes)"](encoded[0] as string, encoded[1] as unknown as string[],{ gasLimit: 5000000 })
//     await tx.wait();

//     console.log(tx);
//     console.log("Create sale success");

// }

// nfttest();
