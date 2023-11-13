// import { Contract, Wallet, ethers } from 'ethers';

// import HeuFarmAbi from "../../src/abis/HeuristicFarming.json";
// import NFTCollectionabi from "../../src/abis/NFTCollection.json";
// import IStakedTokenabi from "../../src/abis/IStakedToken.json";
// import DSProxyAbi from "../../src/abis/Dsproxy.json";

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

//     const NFTCollection = `${process.env.TRAVA_NFT_COLLECTION}`;
//     const onBehalf = "0x826D824BE55A403859A6Db67D5EeC5aC386307fE";

//     const hf = "0xb0c3137d7C7d8cf994b9931359A97605dF277815";
//     const heuristicFarmingContract = new Contract(hf, HeuFarmAbi, wallet);

//     // let tx = await heuristicFarmingContract.approveToken(
//     //     "0x4ABEf176F22B9a71B45ddc6c4A115095d8761b37",
//     //     "0x1120E28F5D9eeABfC18afE9600315c6c184b9fcF");
//     // await tx.wait();

//     // console.log("Success approve1");

//     // let approveToken = await heuristicFarmingContract.approveToken("0x1120E28F5D9eeABfC18afE9600315c6c184b9fcF", "0x41Ad43Ae987F7bE3B5024E7B167f81772f097D5b");
//     // await approveToken.wait();
//     // console.log("Success approve2");

//     const trava_nft_hf_withdraw = new actions.trava.TravaNFTHeurisiticFarmingWithdraw(
//         hf,
//         ["109"],
//         "1",
//         public_key,
//         "0xf3D4113C9Bbf3E3C85FC9a90fCDD6E6d6Da072E7"
//     )
    
//     console.log(trava_nft_hf_withdraw.encodeForDsProxyCall());

//     const recipe = new Recipe(
//         "hf-withdraw",
//         97,
//         [
//             trava_nft_hf_withdraw
//         ]
//     );

//     const encoded = recipe.encodeForDsProxyCall();

//     const proxyContract = new Contract("0x826D824BE55A403859A6Db67D5EeC5aC386307fE", DSProxyAbi, wallet);
//     let tx_claim_reward = await proxyContract["execute(address,bytes)"](encoded[0] as string, encoded[1] as unknown as string[], { gasLimit: 5000000 })
//     await tx_claim_reward.wait();
//     console.log(tx_claim_reward);

    



// }

// test();