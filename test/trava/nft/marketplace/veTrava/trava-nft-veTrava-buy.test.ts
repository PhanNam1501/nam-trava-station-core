// const hre = require("hardhat");
// import { providers, ethers, Wallet, Contract } from "ethers";
// import { Recipe, actions } from "test-trava-station-sdk";
// import DSProxyAbi from "../../src/abis/Dsproxy.json";
// import ProxyRegisterAbi from "../../src/abis/IProxyRegistry.json";
// import veTravaAbi from "../../src/abis/IVotingEscrow.json";
// import Bep20Abi from "../../src/abis/Bep20.json";

// require('dotenv').config();

// async function nfttest() {
//     const public_key = `${process.env.PUBLIC_KEY}`;
//     const private_key = `0x${process.env.PRIVATE_KEY}`;
//     const dsProxyRegistryAddress = `${process.env.DS_PROXY_REGISTRY_ADDRESS}`;
//     const veTravaAddress = `${process.env.VE_TRAVA_ADDRESS}`;

//     let url = "https://bsc-testnet.publicnode.com";
//     const provider = new ethers.providers.JsonRpcProvider(url);
//     const wallet = new Wallet(private_key, provider);

//     const private_key2 = `0x${process.env.PRIVATE_KEY4}`;
//     const public_key2 = "0x2b3fBc2c23E300C6A188e790E59668D501F2568a";
//     const wallet2 = new Wallet(private_key2, provider);

//     const proxyRegistry = new Contract(dsProxyRegistryAddress, ProxyRegisterAbi, wallet);
//     let proxyAddr1 = await proxyRegistry.proxies(public_key);
//     let proxyAddr2 = await proxyRegistry.proxies(public_key2);

//     console.log("smart wallet 1 " + proxyAddr1);
//     console.log("smart wallet 2 " + proxyAddr2);

//     const VeTravaContract = new Contract(veTravaAddress, veTravaAbi, wallet2);
//     let owner = await VeTravaContract.ownerOf(45);
//     console.log(owner);

//     // let tx_approve = await VeTravaContract.approve(proxyAddr2, 45);
//     // await tx_approve.wait();

//     // console.log("Approve for proxy2 success");

//     // const trava_vetrava_create_sale = new actions.trava.TravaNFTVeTravaCreateSale(
//     //     "45",
//     //     BigInt(1e21).toString(),
//     //     "1",
//     //     public_key2,
//     //     "0x74B2561141931a212769B86778C18d2501979Ed1"
//     // )

//     // const recipe = new Recipe("Test-ve-trava-create-sale",
//     //     97,
//     //     [
//     //         trava_vetrava_create_sale
//     //     ]);

//     // const encoded = recipe.encodeForDsProxyCall();

//     // const proxyContract = new Contract(proxyAddr2, DSProxyAbi, wallet2);
//     // let tx_create_sale = await proxyContract["execute(address,bytes)"](encoded[0] as string, encoded[1] as unknown as string[],{ gasLimit: 5000000 })
//     // await tx_create_sale.wait();

//     // console.log(tx_create_sale);
//     // console.log("Create sale success for account 2");

//     // --------------------BUY-------------------


//     const Bep20contract = new Contract("0xCE9f0487f07988003f511d6651153a6dacC32f50", Bep20Abi, wallet);
//     let balance = await Bep20contract.balanceOf(public_key);
//     let tx_allowance = await Bep20contract.allowance(public_key, proxyAddr1);
//     console.log(tx_allowance.toString());

//     const trava_vetrava_buy = new actions.trava.TravaNFTVeTravaBuy(
//         "45",
//         BigInt(1e21).toString(),
//         "1",
//         public_key,
//         public_key2,
//         "0x218598beDE847a2094Bf5712503868C7768e3C91"
//     );

//     const recipe = new Recipe("Test-ve-trava-buy",
//         97,
//         [
//             trava_vetrava_buy
//         ]);

//     const encoded = recipe.encodeForDsProxyCall();

//     const proxyContract = new Contract(proxyAddr1, DSProxyAbi, wallet);
//     let tx_create_buy = await proxyContract["execute(address,bytes)"](encoded[0] as string, encoded[1] as unknown as string[], { gasLimit: 5000000 })
//     await tx_create_buy.wait();

//     console.log(tx_create_buy);
//     console.log("Buy success");

//     owner = await VeTravaContract.ownerOf(45);
//     console.log(owner);
// }

// nfttest();
