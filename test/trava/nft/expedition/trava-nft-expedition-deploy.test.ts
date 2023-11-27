// import { Contract, Wallet, ethers } from 'ethers';
// import NFTCollectionabi from "../../src/abis/NFTCollection.json";
// import DSProxyAbi from "../../src/abis/Dsproxy.json";
// import INFTTicketabi from "../../src/abis/INFTTicket.json";
// import Bep20Abi from "../../src/abis/Bep20.json";
// import ProxyRegisterAbi from "../../src/abis/IProxyRegistry.json";
// import NFTExpeditionAbi from "../../src/abis/NFTExpedition.json";
// import NFTTicketManagerAbi from "../../src/abis/NFTTicketManager.json";
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
//     const NFTTicketaddress = `${process.env.NFT_TICKET}`;
//     const paymentGovernorAddressToken = `${process.env.TRAVA_TOKEN_ADDRESS}`;
//     const dsProxyRegistryAddress = `${process.env.DS_PROXY_REGISTRY_ADDRESS}`;

//     const proxyRegistry = new Contract(dsProxyRegistryAddress, ProxyRegisterAbi, wallet);
//     let proxy_address = await proxyRegistry.proxies(public_key);

//     const vault = "0xD87998eE32f946D2bA9EEeD90cF3417C7A1c6524";
//     const recipient = "0xAE6e6bD17249a6bFFdbDC03A934aE4f774889252";

//     const NFTCollectioncontract = new Contract(NFTCollection, NFTCollectionabi , wallet);
//     let owner = await NFTCollectioncontract.ownerOf(136)
//     console.log("Owner " + owner);

//     let tx_approve_nft = await NFTCollectioncontract.setApprovalForAll(proxy_address , true);
//     await tx_approve_nft.wait();
//     console.log("Success approve nft");

//     // ------------------------- SET PARAMETER FOR EXPEDTION CONTRACT -------------------------

//     const NFTExpedition = new Contract(vault, NFTExpeditionAbi , wallet);
//     let tx_approve_nft_vault = await NFTCollectioncontract.setApprovalForAll(vault , true);
//     await tx_approve_nft_vault.wait();
//     console.log("Success approve nft");

//     let tx_set_ticket = await NFTExpedition.setNftTicketAddress(NFTTicketaddress);
//     await tx_set_ticket.wait();
//     console.log("Success to set ticket");

//     let tx_set_ticket_manager = await NFTExpedition.setticketManager("0x5c362e4626f8Ab946cA700Fd3122CAEc8aB7b5F8");
//     await tx_set_ticket_manager.wait();
//     console.log("Success to set ticket manager");

//     let tx_set_ticket_ids = await NFTExpedition.setItemIds([100001 , 100002, 100003]);
//     await tx_set_ticket_ids.wait();
//     console.log("Success to se ticket Ids");

//     const NFTTicket = new Contract(NFTTicketaddress , INFTTicketabi , wallet);
//     let tx_approve_ticket_vault = await NFTTicket.setApprovalForAll(vault , true);
//     await tx_approve_ticket_vault.wait();

//     console.log("Success approve ticket");

//     const payment_governor_token = new Contract(paymentGovernorAddressToken , Bep20Abi , wallet);
//     let tx_balance = await payment_governor_token.balanceOf(public_key);
//     console.log(tx_balance.toString());

//     let tx_approve_token_vault = await payment_governor_token.approve(vault , BigInt(1e30));
//     await tx_approve_token_vault.wait();
//     console.log("Approve token success");

//     let tx_approve_token_recipient = await payment_governor_token.approve(recipient , BigInt(1e30));
//     await tx_approve_token_recipient.wait();
//     console.log("Approve success for recipient");

//     const NFTTicketMmanager = new Contract("0x5c362e4626f8Ab946cA700Fd3122CAEc8aB7b5F8" , NFTTicketManagerAbi , wallet);
//     let tx_set_manager = await NFTTicketMmanager.setManager(vault , true);
//     await tx_set_manager.wait();

//     let tx_manager = await NFTTicketMmanager.isManager(vault);
//     console.log(tx_manager.toString());

//     let tx_set_ticket_ids_manager = await NFTTicketMmanager.setTicketIds([100001 , 100002, 100003]);
//     await tx_set_ticket_ids_manager.wait();
//     console.log("Success set ticket Ids for ticket manager");

    
//     let tx_set_win_rate = await NFTExpedition.setWinRateBuffArray([0, 1000, 2500, 4500, 7000, 10000]);
//     await tx_set_win_rate.wait();

//     let tx_buff_rate = await NFTExpedition.setExpRateBuffArray([0, 500 , 1250, 2250, 3500 , 5000]);
//     await tx_buff_rate.wait();
//     console.log("Set win rate and set buff exp is success");

//     // -----------------------------------------------------------------------

//     let tx_approve_ticket = await NFTTicket.setApprovalForAll(proxy_address , true);
//     await tx_approve_ticket.wait();

//     console.log("Success approve ticket");
    
//     let tx_approve_token = await payment_governor_token.approve(proxy_address , BigInt(2e23));
//     let tx_allowance = await payment_governor_token.allowance(public_key , proxy_address);
//     console.log("allowance of proxy " + tx_allowance.toString());

//     let tx_allowance_vault = await payment_governor_token.allowance(public_key , vault);
//     console.log("allowance of vault " + tx_allowance_vault.toString());

//     console.log("Approve token success");

//     // // ---------------------------------------------------------------------------


//     const trava_nft_expedition_deploy = new actions.trava.TravaNFTExpeditionDeploy(
//        vault,
//        "136",
//        ["1" , "1" , "1"],
//        ["1" , "2" , "3"],
//        public_key,
//        public_key,
//        "0x28c5F98b20cF7F02f1b574cC6a24D4e386CB7e8A"
//     );
//     // 0x02219E5102Dcda139ac8BE3B3Ec1d04865f41902
//     const recipe = new Recipe(
//         "expedition-deploy",
//         97,
//         [
//             trava_nft_expedition_deploy
//         ]
//     );

//     const encoded = recipe.encodeForDsProxyCall();

//     const proxyContract = new Contract("0x826D824BE55A403859A6Db67D5EeC5aC386307fE", DSProxyAbi, wallet);
//     let tx = await proxyContract["execute(address,bytes)"](encoded[0] as string, encoded[1] as unknown as string[], { gasLimit: 5000000 })
//     await tx.wait();
//     console.log(tx);
    
//     console.log("deploy success");
// }

// test();