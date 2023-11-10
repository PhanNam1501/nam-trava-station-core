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

//     const trava_nft_hf_polish = new actions.trava.TravaNFTHeurisiticFarmingPolish(
//         hf,
//         ["109"],
//         "1",
//         "0x0891a7309d2071A94Eb59e8cf86AB8D9551c0DD8"
//     )

//     const recipe = new Recipe(
//         "hf-polish",
//         97,
//         [
//             trava_nft_hf_polish
//         ]
//     );

//     const encoded = recipe.encodeForDsProxyCall();
    
//     console.log(encoded);

//     const proxyContract = new Contract("0x826D824BE55A403859A6Db67D5EeC5aC386307fE", DSProxyAbi, wallet);
//     let tx_claim_reward = await proxyContract["execute(address,bytes)"](encoded[0] as string, encoded[1] as unknown as string[], { gasLimit: 5000000 })
//     await tx_claim_reward.wait();
//     console.log(tx_claim_reward);



// }

// test();