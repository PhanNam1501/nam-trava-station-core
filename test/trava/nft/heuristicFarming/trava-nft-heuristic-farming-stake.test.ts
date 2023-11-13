// import {Contract, Wallet, ethers} from 'ethers';

// import HeuFarmAbi from "../../src/abis/HeuristicFarming.json";
// import NFTCollectionabi from  "../../src/abis/NFTCollection.json";
// import DSProxyAbi from "../../src/abis/Dsproxy.json";
// import stakefarminabi from "../../src/abis/stakefarming.json";

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
//     const proxy_address = "0x826D824BE55A403859A6Db67D5EeC5aC386307fE";
    
//     const hf = "0xb0c3137d7C7d8cf994b9931359A97605dF277815";
//     const heuristicFarmingContract = new Contract(hf , HeuFarmAbi , wallet);

    
//     // let approveToken = await heuristicFarmingContract.approveToken("0x4ABEf176F22B9a71B45ddc6c4A115095d8761b37" , "0x1120E28F5D9eeABfC18afE9600315c6c184b9fcF");
//     // await approveToken.wait();

//     const NFTCollectioncontract = new Contract(NFTCollection, NFTCollectionabi , wallet);

//     let owner = await NFTCollectioncontract.ownerOf(109);
//     console.log("Owner 109 " + owner);

//     const trava_nft_farming_stake_contract = new Contract("0xfFd92C5AB65E72f6F324404FA95d846149B5ecbA" , stakefarminabi , wallet);
    
//     // let tx_approve = await NFTCollectioncontract.setApprovalForAll(hf, true);
//     // await tx_approve.wait();
//     // console.log("Approve success for hf contract");

//     // let tx_approve_proxy = await NFTCollectioncontract.setApprovalForAll(proxy_address, true);
//     // await tx_approve_proxy.wait();
//     // console.log("Approve success for proxy");


//     // let tx_register_vault = await NFTCollectioncontract.registerVault(hf,{ gasLimit: 5000000 });
//     // await tx_register_vault.wait();

//     // let x = [BigInt(0.001 * 1e18), BigInt(0.0001 * 1e18)]; // min 0.001 TRAVA/s - 0.0001 TRAVA/s
//     // let y = [BigInt(0.0015 * 1e18), BigInt(0.00015 * 1e18)]; // max 0.0015 TRAVA/s - 0.00015 TRAVA/s
//     // let z = [BigInt(0.00125 * 1e18), BigInt(0.000125 * 1e18)]; // long run 0.00125 TRAVA/s - 0.000125 TRAVA/s
//     // let m = [500, 500]; // max at 500 NFTs
//     // let level = [2, 1];
  
//     // let txid = await heuristicFarmingContract.setCoefficient(level, x, y, z, m,{ gasLimit: 5000000 });
//     // await txid.wait();

//     // console.log("success");


//    const trava_nft_heuristic_farming = new actions.trava.TravaNFTHeuristicFarmingStake(
//     "0xb0c3137d7C7d8cf994b9931359A97605dF277815",
//     ["109"],
//     "1",
//     public_key,
//     "0x40B45b24f0cc21323f42F9e4CFf76226c8366f9a"
//    )

//     const recipe = new Recipe(
//         "hf-stake",
//         97,
//         [
//             trava_nft_heuristic_farming
//         ]
//     );

//     const encoded = recipe.encodeForDsProxyCall();

//     const proxyContract = new Contract("0x826D824BE55A403859A6Db67D5EeC5aC386307fE", DSProxyAbi, wallet);
//     let tx = await proxyContract["execute(address,bytes)"](encoded[0] as string, encoded[1] as unknown as string[], { gasLimit: 5000000 })
//     await tx.wait();
//     console.log(tx);

// }

// test();