/* eslint-disable import/no-extraneous-dependencies */

const hre = require("hardhat");
const fs = require("fs");
const { deployAsOwner } = require("../utils/deployer");
const { start } = require("../utils/starter");

const { changeConstantInFiles } = require("../utils/utils");

const { redeploy } = require("../../test/utils");
const { owner } = require("../sdk/rdOwner");
const { writeToEnvFile } = require("../utils/helper");
// const { topUp } = require('../utils/fork');

async function main() {
  //await topUp(OWNER_ACC);

  // get signer
  const signer = owner;
  // await changeConstantInFiles(
  //   './contracts',
  //   ['MainnetActionsUtilAddresses'],
  //   'DFS_REG_CONTROLLER_ADDR',
  //   process.env.DFS_REG_CONTROLLER_ADDR,
  // );

  // await changeConstantInFiles(
  //   './contracts',
  //   ['MainnetActionsUtilAddresses'],
  //   'REGISTRY_ADDR',
  //   process.env.DFS_REGISTRY_ADDRESS,
  // );

  // await changeConstantInFiles(
  //   './contracts',
  //   ['MainnetActionsUtilAddresses'],
  //   'DEFISAVER_LOGGER',
  //   process.env.DEFISAVER_LOGGER_ADDRESS,
  // );

  // await changeConstantInFiles(
  //   './contracts',
  //   ['MainnetActionsUtilAddresses'],
  //   'SUB_STORAGE_ADDR',
  //   process.env.SUB_STORAGE_ADDRESS,
  // );

  // await changeConstantInFiles(
  //   './contracts',
  //   ['MainnetActionsUtilAddresses'],
  //   'PROXY_AUTH_ADDR',
  //   process.env.PROXY_AUTH_ADDRESS,
  // );

  //     /*
  //         ||--------------------------------------------------------------------------------||
  //         ||                                 Action Contract                                ||
  //         ||--------------------------------------------------------------------------------||
  //         */
  //     /*
  //         ||++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++||
  //         ||                              Utils Contract                                   ||
  //         ||++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++||
  //     */

  // await changeConstantInFiles(
  //   './contracts',
  //   ['TokenUtils'],
  //   'WBNB_ADDR',
  //   process.env.WBNB_BSCTESTNET,
  // );
  // run('compile');

  // const wrapBnb = await redeploy('WrapBnb', process.env.DFS_REGISTRY_ADDRESS);
  // writeToEnvFile("WRAP_BNB_ADDRESS", wrapBnb.address)

  // const upwrapBnb = await redeploy('UnwrapBnb', process.env.DFS_REGISTRY_ADDRESS);
  // writeToEnvFile("UNWRAP_BNB_ADDRESS", upwrapBnb.address)

  // const sendToken = await redeploy('SendToken', process.env.DFS_REGISTRY_ADDRESS);
  // writeToEnvFile("SEND_TOKEN_ADDRESS", sendToken.address)

  // const pullToken = await redeploy('PullToken', process.env.DFS_REGISTRY_ADDRESS);
  // writeToEnvFile("PULL_TOKEN_ADDRESS", pullToken.address)

  // //   const sendTokens = await redeploy('SendTokens', process.env.DFS_REGISTRY_ADDRESS);
  // // writeToEnvFile("SEND_TOKENS_ADDRESS", sendTokens.address)

  // //     const sendTokenAndUnwrap = await redeploy('SendTokenAndUnwrap', process.env.DFS_REGISTRY_ADDRESS);
  // //     writeToEnvFile("SEND_TOKEN_AND_UNWRAP_ADDRESS", sendTokenAndUnwrap.address)

  // //     /*
  //        ||++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++||
  //        ||                               Trava Market Contract                                   ||
  //        ||++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++||
  //    */
  // await changeConstantInFiles(
  //   './contracts',
  //   ['MainnetTravaAddresses'],
  //   'STAKED_TRAVA_TOKEN_ADDRESS',
  //   process.env.STAKED_TRAVA_TOKEN_ADDRESS,
  // );
  // run('compile');

  // await changeConstantInFiles(
  //   './contracts',
  //   ['MainnetTravaAddresses'],
  //   'INCENTIVES_ADDRESS',
  //   process.env.INCENTIVES_ADDRESS,
  // );
  // run('compile');

  // const travaBorrow = await redeploy(
  //   "TravaBorrow",
  //   process.env.DFS_REGISTRY_ADDRESS
  // );
  // writeToEnvFile("TRAVA_BORROW_ADDRESS", travaBorrow.address);

  // const travaRepay = await redeploy(
  //   "TravaRepay",
  //   process.env.DFS_REGISTRY_ADDRESS
  // );
  // writeToEnvFile("TRAVA_REPAY_ADDRESS", travaRepay.address);

  // const travaSupply = await redeploy('TravaSupply', process.env.DFS_REGISTRY_ADDRESS);
  // writeToEnvFile("TRAVA_SUPPLY_ADDRESS", travaSupply.address)

  // const OraiStake = await redeploy('OraiStake', process.env.DFS_REGISTRY_ADDRESS);
  // writeToEnvFile("ORAI_STAKE_ADDRESS", OraiStake.address)

  // const OraiUnstake = await redeploy('OraiUnstake', process.env.DFS_REGISTRY_ADDRESS);
  // writeToEnvFile("ORAI_UNSTAKE_ADDRESS", OraiUnstake.address)

  // const OraiWithdrawUnstaked = await redeploy('OraiWithdrawUnstaked', process.env.DFS_REGISTRY_ADDRESS);
  // writeToEnvFile("ORAI_WITHDRAWSTAKE_ADDRESS", OraiWithdrawUnstaked.address)

  // const travaWithdraw = await redeploy('TravaWithdraw', process.env.DFS_REGISTRY_ADDRESS);
  // writeToEnvFile("TRAVA_WITHDRAW_ADDRESS", travaWithdraw.address)

  // const travaClaimRewards = await redeploy('TravaClaimRewards', process.env.DFS_REGISTRY_ADDRESS);
  // writeToEnvFile("TRAVA_CLAIMS_REWARDS_ADDRESS", travaClaimRewards.address)

  // const travaClaimRewards = await redeploy('TravaClaimRewards', process.env.DFS_REGISTRY_ADDRESS);
  // writeToEnvFile("TRAVA_CLAIMS_REWARDS_ADDRESS", travaClaimRewards.address)

  // const travaConvertRewards = await redeploy('TravaConvertRewards', process.env.DFS_REGISTRY_ADDRESS);
  // writeToEnvFile("TRAVA_CONVERT_REWARDS_ADDRESS", travaConvertRewards.address)

  //        ||++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++||
  //        ||                               FeeContract                                   ||
  //        ||++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++||
   await changeConstantInFiles(
    './contracts',
    ['MainnetUtilAddresses'],
    'FEE_RECIPIENT',
    process.env.FEE_RECIPIENT,
  );
  run('compile');

  await changeConstantInFiles(
    './contracts',
    ['MainnetUtilAddresses'],
    'PANCAKE_ROUTER',
    process.env.PANCAKE_ROUTER_ADDRESS,
  );
  run('compile');

  const gasFeeTaker = await redeploy('GasFeeTaker', process.env.DFS_REGISTRY_ADDRESS);
  writeToEnvFile("GAS_FEE_TAKER_ADDRESS", gasFeeTaker.address)


  //        ||++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++||
  //        ||                               Trava Governance Contract                                   ||
  //        ||++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++||
  //    */
  // await changeConstantInFiles(
  //   './contracts',
  //   ['MainnetTravaGovernanceAddresses'],
  //   'VE_TRAVA',
  //   process.env.VE_TRAVA,
  // );
  // run('compile');

  // await changeConstantInFiles(
  //   './contracts',
  //   ['MainnetTravaGovernanceAddresses'],
  //   'INCENTIVE_VAULT',
  //   process.env.INCENTIVE_VAULT_ADDRESS,
  // );
  // run('compile');

  // const travaGovernanceCompound = await redeploy(
  //   "TravaGovernanceCompound",
  //   process.env.DFS_REGISTRY_ADDRESS
  // );
  // writeToEnvFile("TRAVA_GOVERNANCE_COMPOUND_ADDRESS", travaGovernanceCompound.address);

  // const travaGovernanceCreateLock = await redeploy(
  //   "TravaGovernanceCreateLock",
  //   process.env.DFS_REGISTRY_ADDRESS
  // );
  // writeToEnvFile("TRAVA_GOVERNANCE_CREATE_LOCK_ADDRESS", travaGovernanceCreateLock.address);

  // const travaGovernanceIncreaseAmount = await redeploy(
  //   "TravaGovernanceIncreaseAmount",
  //   process.env.DFS_REGISTRY_ADDRESS
  // );
  // writeToEnvFile("TRAVA_GOVERNANCE_INCREASE_AMOUNT_ADDRESS", travaGovernanceIncreaseAmount.address);

  // const travaGovernanceIncreaseUnlockTime = await redeploy(
  //   "TravaGovernanceIncreaseUnlockTime",
  //   process.env.DFS_REGISTRY_ADDRESS
  // );
  // writeToEnvFile("TRAVA_GOVERNANCE_INCREASE_UNLOCK_TIME_ADDRESS", travaGovernanceIncreaseUnlockTime.address);

  // const travaGovernanceMerge = await redeploy(
  //   "TravaGovernanceMerge",
  //   process.env.DFS_REGISTRY_ADDRESS
  // );
  // writeToEnvFile("TRAVA_GOVERNANCE_MERGE_ADDRESS", travaGovernanceMerge.address);

  // const travaGovernanceWithdraw = await redeploy(
  //   "TravaGovernanceWithdraw",
  //   process.env.DFS_REGISTRY_ADDRESS
  // );
  // writeToEnvFile("TRAVA_GOVERNANCE_WITHDRAW_ADDRESS", travaGovernanceWithdraw.address);

  //        ||++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++||
  //        ||                               Trava Staking Contract                                   ||
  //        ||++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++||
  // //    */

  // const travaStakingStake = await redeploy(
  //   "TravaStakingStake",
  //   process.env.DFS_REGISTRY_ADDRESS
  // );
  // writeToEnvFile("TRAVA_STAKING_STAKE_ADDRESS", travaStakingStake.address);

  // const travaStakingClaimRewards = await redeploy(
  //   "TravaStakingClaimRewards",
  //   process.env.DFS_REGISTRY_ADDRESS
  // );
  // writeToEnvFile("TRAVA_STAKING_CLAIM_REWARDS_ADDRESS", travaStakingClaimRewards.address);

  // const travaStakingRedeem = await redeploy(
  //   "TravaStakingRedeem",
  //   process.env.DFS_REGISTRY_ADDRESS
  // );
  // writeToEnvFile("TRAVA_STAKING_REDEEM_ADDRESS", travaStakingRedeem.address);

  //        ||++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++||
  //        ||                               Trava NFT Contract                                   ||
  //        ||++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++||
  //    */
  // await changeConstantInFiles(
  //   './contracts',
  //   ['MainnetTravaNFTAddresses'],
  //   'TRAVA_TOKEN',
  //   process.env.TRAVA_TOKEN_IN_MARKET,
  // );
  // run('compile');

  // await changeConstantInFiles(
  //   './contracts',
  //   ['MainnetTravaNFTAddresses'],
  //   'NFT_CORE',
  //   process.env.TRAVA_NFT_CORE,
  // );
  // run('compile');

  // await changeConstantInFiles(
  //   './contracts',
  //   ['MainnetTravaNFTAddresses'],
  //   'NFT_MARKETPLACE',
  //   process.env.TRAVA_NFT_MARKETPLACE,
  // );
  // run('compile');

  // const travaNFTTransfer = await redeploy(
  //   "TravaNFTTransfer",
  //   process.env.DFS_REGISTRY_ADDRESS
  // );
  // writeToEnvFile("TRAVA_NFT_TRANSFER_ADDRESS", travaNFTTransfer.address);

  //        ||++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++||
  //        ||                               Trava NFT  Marketplace Contract                                   ||
  //        ||++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++||
  //    */

  // const travaNFTBuy = await redeploy(
  //   "TravaNFTBuy",
  //   process.env.DFS_REGISTRY_ADDRESS
  // );
  // writeToEnvFile("TRAVA_NFT_BUY_ADDRESS", travaNFTBuy.address);

  // const travaNFTCreateSale = await redeploy(
  //   "TravaNFTCreateSale",
  //   process.env.DFS_REGISTRY_ADDRESS
  // );
  // writeToEnvFile("TRAVA_NFT_CREATE_SALE_ADDRESS", travaNFTCreateSale.address);

  // const travaNFTCancelSale = await redeploy(
  //   "TravaNFTCancelSale",
  //   process.env.DFS_REGISTRY_ADDRESS
  // );
  // writeToEnvFile("TRAVA_NFT_CANCLE_SALE_ADDRESS", travaNFTCancelSale.address);

  //        ||++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++||
  //        ||                               Trava NFT  Manager Contrac                       ||
  //        ||++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++||
  //    */

  // const travaNFTManagerMint = await redeploy(
  //   "TravaNFTManagerMint",
  //   process.env.DFS_REGISTRY_ADDRESS
  // );
  // writeToEnvFile("TRAVA_NFT_MANAGER_MINT_ADDRESS", travaNFTManagerMint.address);

  //        ||++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++||
  //        ||                               Trava NFT Heuristic Farming Contract             ||
  //        ||++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++||
  //    */

  // await changeConstantInFiles(
  //   "./contracts",
  //   ["MainnetTravaNFTHeuristicFarmingAddresses"],
  //   "NFT_COLLECTION",
  //   process.env.TRAVA_NFT_COLLECTION
  // );
  // run("compile");

  // const travaNftHeuristicFarmingStake = await redeploy(
  //   "TravaNFTHeuristicFarmingStake",
  //   process.env.DFS_REGISTRY_ADDRESS
  // );
  // writeToEnvFile(
  //   "TRAVA_NFT_HEURISTIC_FARMING_STAKE_ADDRESS",
  //   travaNftHeuristicFarmingStake.address
  // );

  // const travaNftHeuristicFarmingWithdraw = await redeploy(
  //   "TravaNFTHeuristicFarmingWithdraw",
  //   process.env.DFS_REGISTRY_ADDRESS
  // );
  // writeToEnvFile("TRAVA_NFT_HEURISTIC_FARMING_WITHDRAW_ADDRESS", travaNftHeuristicFarmingWithdraw.address);

  // const travaNftHeuristicFarmingClaimReward = await redeploy(
  //   "TravaNFTHeuristicFarmingClaimReward",
  //   process.env.DFS_REGISTRY_ADDRESS
  // );
  // writeToEnvFile("TRAVA_NFT_HEURISTIC_FARMING_CLAIM_REWARD_ADDRESS", travaNftHeuristicFarmingClaimReward.address);

  // const travaNftHeuristicFarmingPolish = await redeploy(
  //   "TravaNFTHeuristicFarmingPolish",
  //   process.env.DFS_REGISTRY_ADDRESS
  // );
  // writeToEnvFile("TRAVA_NFT_HEURISTIC_FARMING_POLISH_ADDRESS", travaNftHeuristicFarmingPolish.address);

  //        ||++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++||
  //        ||                               Trava NFT farm Contract                          ||
  //        ||++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++||
  //    */

  // const travaNFTVaultClaimReward = await redeploy(
  //   "TravaNFTVaultClaimReward",
  //   process.env.DFS_REGISTRY_ADDRESS
  // );
  // writeToEnvFile("TRAVA_NFT_VAULT_CLAIM_REWARD_ADDRESS", travaNFTVaultClaimReward.address);

  // const travaNFTVaultRedeem = await redeploy(
  //   "TravaNFTVaultRedeem",
  //   process.env.DFS_REGISTRY_ADDRESS
  // );
  // writeToEnvFile("TRAVA_NFT_VAULT_REDEEM_ADDRESS", travaNFTVaultRedeem.address);

  // const travaNFTVaultStake = await redeploy(
  //   "TravaNFTVaultStake",
  //   process.env.DFS_REGISTRY_ADDRESS
  // );
  // writeToEnvFile("TRAVA_NFT_VAULT_STAKE_ADDRESS", travaNFTVaultStake.address);

  //        ||++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++||
  //        ||                               Trava NFT Auction Contract                          ||
  //        ||++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++||
  //    */

  // await changeConstantInFiles(
  //   './contracts',
  //   ['MainnetTravaNFTAuctionAddresses'],
  //   'NFT_AUCTION',
  //   process.env.TRAVA_NFT_AUCTION,
  // );
  // run('compile');

  // await changeConstantInFiles(
  //   './contracts',
  //   ['MainnetTravaNFTAuctionAddresses'],
  //   'NFT_COLLECTION',
  //   process.env.TRAVA_NFT_COLLECTION,
  // );
  // run('compile');

  // await changeConstantInFiles(
  //   './contracts',
  //   ['MainnetTravaNFTAuctionAddresses'],
  //   'TRAVA_TOKEN',
  //   process.env.TRAVA_TOKEN_ADDRESS,
  // );
  // run('compile');

  // const travaNFTAuctionCreateAuction = await redeploy(
  //   "TravaNFTAuctionCreateAuction",
  //   process.env.DFS_REGISTRY_ADDRESS
  // );
  // writeToEnvFile("TRAVA_NFT_AUCTION_CREATE_AUCTION_ADDRESS", travaNFTAuctionCreateAuction.address);

  // const travaNFTAuctionMakeBid = await redeploy(
  //   "TravaNFTAuctionMakeBid",
  //   process.env.DFS_REGISTRY_ADDRESS
  // );
  // writeToEnvFile("TRAVA_NFT_AUCTION_MAKE_BID_ADDRESS", travaNFTAuctionMakeBid.address);

  // const travaNFTAuctionEditAuctionPrice = await redeploy(
  //   "TravaNFTAuctionEditAuctionPrice",
  //   process.env.DFS_REGISTRY_ADDRESS
  // );
  // writeToEnvFile("TRAVA_NFT_AUCTION_EDIT_AUCTION_PRICE_ADDRESS", travaNFTAuctionEditAuctionPrice.address);

  // const travaNFTAuctionCancelAuction = await redeploy(
  //   "TravaNFTAuctionCancelAuction",
  //   process.env.DFS_REGISTRY_ADDRESS
  // );
  // writeToEnvFile("TRAVA_NFT_AUCTION_CANCEL_AUCTION_ADDRESS", travaNFTAuctionCancelAuction.address);

  // const travaNFTAuctionFinalizeAuction = await redeploy(
  //   "TravaNFTAuctionFinalizeAuction",
  //   process.env.DFS_REGISTRY_ADDRESS
  // );
  // writeToEnvFile("TRAVA_NFT_AUCTION_FINALIZE_AUCTION_ADDRESS", travaNFTAuctionFinalizeAuction.address);

  //        ||++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++||
  //        ||                               Trava NFT Dilutiton Staking Contract                          ||
  //        ||++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++||
  //    */

  // const travaNFTDilutionStakingJoinBattlefield = await redeploy(
  //   "TravaNFTDilutionStakingJoinBattlefield",
  //   process.env.DFS_REGISTRY_ADDRESS
  // );
  // writeToEnvFile(
  //   "TRAVA_NFT_DILUTION_STAKING_JOIN_BATTLE_ADDRESS",
  //   travaNFTDilutionStakingJoinBattlefield.address
  // );

  //        ||++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++||
  //        ||                               Trava NFT Expedition Contract                                   ||
  //        ||++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++||
  //    */

  // await changeConstantInFiles(
  //   "./contracts",
  //   ["MainnetTravaNFTExpeditionAddresses"],
  //   "NFT_TICKET",
  //   process.env.TRAVA_NFT_TICKET
  // );
  // run("compile");

  // await changeConstantInFiles(
  //   "./contracts",
  //   ["MainnetTravaNFTExpeditionAddresses"],
  //   "NFT_COLLECTION",
  //   process.env.TRAVA_NFT_COLLECTION
  // );
  // run("compile");

  // await changeConstantInFiles(
  //   "./contracts",
  //   ["MainnetTravaNFTExpeditionAddresses"],
  //   "PAYMENT_GOVERNOR",
  //   process.env.TRAVA_TOKEN_IN_MARKET
  // );
  // run("compile");

  // const travaNFTExpeditionDeploy = await redeploy(
  //   "TravaNFTExpeditionDeploy",
  //   process.env.DFS_REGISTRY_ADDRESS
  // );
  // writeToEnvFile(
  //   "TRAVA_NFT_EXPEDITION_DEPLOY_ADDRESS",
  //   travaNFTExpeditionDeploy.address
  // );

  // const travaNFTExpeditionAbandon = await redeploy(
  //   "TravaNFTExpeditionAbandon",
  //   process.env.DFS_REGISTRY_ADDRESS
  // );
  // writeToEnvFile(
  //   "TRAVA_NFT_EXPEDITION_ABANDON_ADDRESS",
  //   travaNFTExpeditionAbandon.address
  // );

  // const travaNFTExpeditionWithdraw = await redeploy(
  //   "TravaNFTExpeditionWithdraw",
  //   process.env.DFS_REGISTRY_ADDRESS
  // );
  // writeToEnvFile(
  //   "TRAVA_NFT_EXPEDITION_WITHDRAW_ADDRESS",
  //   travaNFTExpeditionWithdraw.address
  // );

  //        ||++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++||
  //        ||                               Trava NFT veTrava Contract                       ||
  //        ||++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++||
  //    */

  // await changeConstantInFiles(
  //   "./contracts",
  //   ["MainnetTravaNFTVeTravaAddresses"],
  //   "VE_TRAVA_ADDRESS",
  //   process.env.VE_TRAVA
  // );
  // run("compile");

  // await changeConstantInFiles(
  //   "./contracts",
  //   ["MainnetTravaNFTVeTravaAddresses"],
  //   "VE_TRAVA_MARKETPLACE_ADDRESS",
  //   process.env.VE_TRAVA_MARKETPLACE_ADDRESS
  // );
  // run("compile");

  // const travaNFTVeTravaCreateSale = await redeploy(
  //   "TravaNFTVeTravaCreateSale",
  //   process.env.DFS_REGISTRY_ADDRESS
  // );
  // writeToEnvFile(
  //   "TRAVA_NFT_VE_TRAVA_CREATE_SALE_ADDRESS",
  //   travaNFTVeTravaCreateSale.address
  // );

  // const travaNFTVeTravaCancelSale = await redeploy(
  //   "TravaNFTVeTravaCancelSale",
  //   process.env.DFS_REGISTRY_ADDRESS
  // );
  // writeToEnvFile(
  //   "TRAVA_NFT_VE_TRAVA_CANCEL_SALE_ADDRESS",
  //   travaNFTVeTravaCancelSale.address
  // );

  // const travaNFTVeTravaBuy = await redeploy(
  //   "TravaNFTVeTravaBuy",
  //   process.env.DFS_REGISTRY_ADDRESS
  // );
  // writeToEnvFile("TRAVA_NFT_VE_TRAVA_BUY_ADDRESS", travaNFTVeTravaBuy.address);
  /*
       ||++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++||
       ||                               PancakeV2 Contract                               ||
       ||++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++||
   */
  // await changeConstantInFiles(
  //   './contracts',
  //   ['MainnetPancakeV2Addresses'],
  //   'PANCAKE_ROUTER',
  //   process.env.PANCAKE_ROUTER_ADDRESS,
  // );
  // run('compile');

  // const pancakeAddLiquidityV2 = await redeploy(
  //   "PancakeAddLiquidityV2",
  //   process.env.DFS_REGISTRY_ADDRESS
  // );
  // writeToEnvFile(
  //   "PANCAKE_ADD_LIQUIDITY_V2_ADDRESS",
  //   pancakeAddLiquidityV2.address
  // );

  // const pancakeSwapV2 = await redeploy(
  //   "PancakeSwapV2",
  //   process.env.DFS_REGISTRY_ADDRESS
  // );
  // writeToEnvFile("PANCAKE_SWAP_V2_ADDRESS", pancakeSwapV2.address);

  // const pancakeRemoveLiquidityV2 = await redeploy(
  //   "PancakeRemoveLiquidityV2",
  //   process.env.DFS_REGISTRY_ADDRESS
  // );
  // writeToEnvFile(
  //   "PANCAKE_REMOVE_LIQUIDITY_V2_ADDRESS",
  //   pancakeRemoveLiquidityV2.address
  // );

  /*
       ||++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++||
       ||                               PancakeV3 Contract                               ||
       ||++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++||
   */
  // await changeConstantInFiles(
  //   './contracts',
  //   ['MainnetPancakeV3Addresses'],
  //   'SMART_ROUTER',
  //   process.env.SMART_ROUTER_ADDRESS,
  // );
  // run('compile');

  // await changeConstantInFiles(
  //   './contracts',
  //   ['MainnetPancakeV3Addresses'],
  //   'NON_FUNGIBLE_POSITION_MANAGER',
  //   process.env.NON_FUNGIBLE_POSITION_MANAGER_ADDRESS,
  // );
  // run('compile');

  // const pancakeCreatePoolV3 = await redeploy('PancakeCreatePoolV3', process.env.DFS_REGISTRY_ADDRESS);
  // writeToEnvFile("PANCAKE_CREATE_POOL_V3_ADDRESS", pancakeCreatePoolV3.address)

  // const pancakeAddLiquidityV3 = await redeploy('PancakeAddLiquidityV3', process.env.DFS_REGISTRY_ADDRESS);
  // writeToEnvFile("PANCAKE_ADD_LIQUIDITY_V3_ADDRESS", pancakeAddLiquidityV3.address)

  // const pancakeIncreaseLiquidityV3 = await redeploy('PancakeIncreaseLiquidityV3', process.env.DFS_REGISTRY_ADDRESS);
  // writeToEnvFile("PANCAKE_INCREASE_LIQUIDITY_V3_ADDRESS", pancakeIncreaseLiquidityV3.address)

  // const pancakeSwapV3 = await redeploy('PancakeSwapV3', process.env.DFS_REGISTRY_ADDRESS);
  // writeToEnvFile("PANCAKE_SWAP_V3_ADDRESS", pancakeSwapV3.address)

  //  const pancakeCollectV3 = await redeploy('PancakeCollectV3', process.env.DFS_REGISTRY_ADDRESS);
  //  writeToEnvFile("PANCAKE_COLLECT_V3_ADDRESS", pancakeCollectV3.address)

  //  const pancakeRemoveLiquidityV3 = await redeploy('PancakeRemoveLiquidityV3', process.env.DFS_REGISTRY_ADDRESS);
  //  writeToEnvFile("PANCAKE_REMOVE_LIQUIDITY_V3_ADDRESS", pancakeRemoveLiquidityV3.address)

  /*
       ||++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++||
       ||                               Venus     Contract                               ||
       ||++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++||
   */
  // const venusBorrow = await redeploy(
  //   "VenusBorrow",
  //   process.env.DFS_REGISTRY_ADDRESS
  // );
  // writeToEnvFile("VENUS_BORROW_ADDRESS", venusBorrow.address);

  // const venusRepay = await redeploy(
  //   "VenusRepay",
  //   process.env.DFS_REGISTRY_ADDRESS
  // );
  // writeToEnvFile("VENUS_REPAY_ADDRESS", venusRepay.address);

  // const venusSupply = await redeploy(
  //   "VenusSupply",
  //   process.env.DFS_REGISTRY_ADDRESS
  // );
  // writeToEnvFile("VENUS_SUPPLY_ADDRESS", venusSupply.address);

  // const venusWithdraw = await redeploy(
  //   "VenusWithdraw",
  //   process.env.DFS_REGISTRY_ADDRESS
  // );
  // writeToEnvFile("VENUS_WITHDRAW_ADDRESS", venusWithdraw.address);

  /*
       ||++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++||
       ||                               Cream     Contract                               ||
       ||++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++||
   */
  // const creamBorrow = await redeploy(
  //   "CreamBorrow",
  //   process.env.DFS_REGISTRY_ADDRESS
  // );
  // writeToEnvFile("CREAM_BORROW_ADDRESS", creamBorrow.address);

  // const creamRepay = await redeploy(
  //   "CreamRepay",
  //   process.env.DFS_REGISTRY_ADDRESS
  // );
  // writeToEnvFile("CREAM_REPAY_ADDRESS", creamRepay.address);

  // const creamSupply = await redeploy(
  //   "CreamSupply",
  //   process.env.DFS_REGISTRY_ADDRESS
  // );
  // writeToEnvFile("CREAM_SUPPLY_ADDRESS", creamSupply.address);

  // const creamWithdraw = await redeploy(
  //   "CreamWithdraw",
  //   process.env.DFS_REGISTRY_ADDRESS
  // );
  // writeToEnvFile("CREAM_WITHDRAW_ADDRESS", creamWithdraw.address);

  /*
       ||++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++||
       ||                               Liqee     Contract                               ||
       ||++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++||
   */
  //  const liqeeBorrow = await redeploy(
  //   "LiqeeBorrow",
  //   process.env.DFS_REGISTRY_ADDRESS
  // );
  // writeToEnvFile("LIQEE_BORROW_ADDRESS", liqeeBorrow.address);

  // const liqeeRepay = await redeploy(
  //   "LiqeeRepay",
  //   process.env.DFS_REGISTRY_ADDRESS
  // );
  // writeToEnvFile("LIQEE_REPAY_ADDRESS", liqeeRepay.address);

  // const liqeeSupply = await redeploy(
  //   "LiqeeSupply",
  //   process.env.DFS_REGISTRY_ADDRESS
  // );
  // writeToEnvFile("LIQEE_SUPPLY_ADDRESS", liqeeSupply.address);

  // const liqeeWithdraw = await redeploy(
  //   "LiqeeWithdraw",
  //   process.env.DFS_REGISTRY_ADDRESS
  // );
  // writeToEnvFile("LIQEE_WITHDRAW_ADDRESS", liqeeWithdraw.address);

  /*
   ||++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++||
   ||                               WePiggy     Contract                               ||
   ||++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++||
//  */
  //      const WePiggyBorrow = await redeploy(
  //       "WePiggyBorrow",
  //       process.env.DFS_REGISTRY_ADDRESS
  //     );
  //     writeToEnvFile("WEPIGGY_BORROW_ADDRESS", WePiggyBorrow.address);

  // const WePiggyRepay = await redeploy(
  //   "WePiggyRepay",
  //   process.env.DFS_REGISTRY_ADDRESS
  // );
  // writeToEnvFile("WEPIGGY_REPAY_ADDRESS", WePiggyRepay.address);

  // const wePiggySupply = await redeploy(
  //   "WePiggySupply",
  //   process.env.DFS_REGISTRY_ADDRESS
  // );
  // writeToEnvFile("WEPIGGY_SUPPLY_ADDRESS", wePiggySupply.address);

  // const wePiggyWithdraw = await redeploy(
  //   "WePiggyWithdraw",
  //   process.env.DFS_REGISTRY_ADDRESS
  // );
  // writeToEnvFile("WEPIGGY_WITHDRAW_ADDRESS", wePiggyWithdraw.address);

  /*
   ||++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++||
   ||                               Radiant    Contract                               ||
   ||++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++||
*/
  //  const radiantBorrow = await redeploy(
  //   "RadiantBorrow",
  //   process.env.DFS_REGISTRY_ADDRESS
  // );
  // writeToEnvFile("RADIANT_BORROW_ADDRESS", radiantBorrow.address);

  // const radiantRepay = await redeploy(
  //   "RadiantRepay",
  //   process.env.DFS_REGISTRY_ADDRESS
  // );
  // writeToEnvFile("RADIANT_REPAY_ADDRESS", radiantRepay.address);

  // const radiantSupply = await redeploy(
  //   "RadiantSupply",
  //   process.env.DFS_REGISTRY_ADDRESS
  // );
  // writeToEnvFile("RADIANT_SUPPLY_ADDRESS", radiantSupply.address);

  // const radiantWithdraw = await redeploy(
  //   "RadiantWithdraw",
  //   process.env.DFS_REGISTRY_ADDRESS
  // );
  // writeToEnvFile("RADIANT_WITHDRAW_ADDRESS", radiantWithdraw.address);

  /*
   ||++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++||
   ||                               Granary    Contract                               ||
   ||++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++||
*/
  //  const granaryBorrow = await redeploy(
  //   "GranaryBorrow",
  //   process.env.DFS_REGISTRY_ADDRESS
  // );
  // writeToEnvFile("GRANARY_BORROW_ADDRESS", granaryBorrow.address);

  // const granaryRepay = await redeploy(
  //   "GranaryRepay",
  //   process.env.DFS_REGISTRY_ADDRESS
  // );
  // writeToEnvFile("GRANARY_REPAY_ADDRESS", granaryRepay.address);

  // const granarySupply = await redeploy(
  //   "GranarySupply",
  //   process.env.DFS_REGISTRY_ADDRESS
  // );
  // writeToEnvFile("GRANARY_SUPPLY_ADDRESS", granarySupply.address);

  // const granaryWithdraw = await redeploy(
  //   "GranaryWithdraw",
  //   process.env.DFS_REGISTRY_ADDRESS
  // );
  // writeToEnvFile("GRANARY_WITHDRAW_ADDRESS", granaryWithdraw.address);


  /*
   ||++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++||
   ||                               Trava Tod Liquidity Contract                               ||
   ||++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++||
*/
  // await changeConstantInFiles(
  //   './contracts',
  //   ['TokenUtils'],
  //   'WBNB_ADDR',
  //   process.env.WBNB_BSCTESTNET,
  // );
  // run('compile');

  // const liquidityCampaignBuyToken = await redeploy(
  //   "LiquidityCampaignBuyToken",
  //   process.env.DFS_REGISTRY_ADDRESS
  // );
  // writeToEnvFile("LIQUIDITY_CAMPAIGN_BUY_TOKEN_ADDRESS", liquidityCampaignBuyToken.address);

  // const liquidityCampaignBuyTokenGateway = await redeploy(
  //   "LiquidityCampaignBuyTokenGateway",
  //   process.env.DFS_REGISTRY_ADDRESS
  // );
  // writeToEnvFile("LIQUIDITY_CAMPAIGN_BUY_TOKEN_GATEWAY_ADDRESS", liquidityCampaignBuyTokenGateway.address);

  // const liquidityCampaignClaimRewards = await redeploy(
  //   "LiquidityCampaignClaimRewards",
  //   process.env.DFS_REGISTRY_ADDRESS
  // );
  // writeToEnvFile("LIQUIDITY_CAMPAIGN_CLAIM_REWARDS_ADDRESS", liquidityCampaignClaimRewards.address);

  // const liquidityCampaignRedeem = await redeploy(
  //   "LiquidityCampaignRedeem",
  //   process.env.DFS_REGISTRY_ADDRESS
  // );
  // writeToEnvFile("LIQUIDITY_CAMPAIGN_REDEEM_ADDRESS", liquidityCampaignRedeem.address);

  // const liquidityCampaignStake = await redeploy(
  //   "LiquidityCampaignStake",
  //   process.env.DFS_REGISTRY_ADDRESS
  // );
  // writeToEnvFile("LIQUIDITY_CAMPAIGN_STAKE_ADDRESS", liquidityCampaignStake.address);

  /*
     ||++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++||
     ||                               Granary Lending Pool                             ||
     ||++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++||
//  */

  //   const granaryBorrow = await redeploy(
  //     "GranaryBorrow",
  //     process.env.DFS_REGISTRY_ADDRESS
  //   );
  //   writeToEnvFile("GRANARY_BORROW_ADDRESS", granaryBorrow.address);

  // const granaryRepay = await redeploy(
  //   "GranaryRepay",
  //   process.env.DFS_REGISTRY_ADDRESS
  // );
  // writeToEnvFile("GRANARY_REPAY_ADDRESS", granaryRepay.address);

  // const granarySupply = await redeploy('GranarySupply', process.env.DFS_REGISTRY_ADDRESS);
  // writeToEnvFile("GRANARY_SUPPLY_ADDRESS", granarySupply.address)

  // const granaryWithdraw = await redeploy('GranaryWithdraw', process.env.DFS_REGISTRY_ADDRESS);
  // writeToEnvFile("GRANARY_WITHDRAW_ADDRESS", granaryWithdraw.address)

  /*
     ||++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++||
     ||                               Radiant-V2 Lending Pool                             ||
     ||++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++||
//  */

  // const radiantBorrow = await redeploy(
  //   "RadiantBorrow",
  //   process.env.DFS_REGISTRY_ADDRESS
  // );
  // writeToEnvFile("RADIANT_BORROW_ADDRESS", radiantBorrow.address);

  // const radiantRepay = await redeploy(
  //   "RadiantRepay",
  //   process.env.DFS_REGISTRY_ADDRESS
  // );
  // writeToEnvFile("RADIANT_REPAY_ADDRESS", radiantRepay.address);

  // const radiantSupply = await redeploy('RadiantSupply', process.env.DFS_REGISTRY_ADDRESS);
  // writeToEnvFile("RADIANT_SUPPLY_ADDRESS", radiantSupply.address)

  // const radiantWithdraw = await redeploy('RadiantWithdraw', process.env.DFS_REGISTRY_ADDRESS);
  // writeToEnvFile("RADIANT_WITHDRAW_ADDRESS", radiantWithdraw.address)

  /*
     ||++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++||
     ||                               Venus Lending Pool                               ||
     ||++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++||
//  */
  //  await changeConstantInFiles(
  //     './contracts',
  //     ['MainnetVenusAddresses'],
  //     'COMPTROLLER_ADDR',
  //     process.env.VENUS_UNICONTROLLER_ADDRESS,
  //   );
  //   run('compile');

  //   await changeConstantInFiles(
  //     './contracts',
  //     ['MainnetVenusAddresses'],
  //     'V_BNB_ADDR',
  //     process.env.V_BNB_ADDRESS,
  //   );
  //   run('compile');

  //   await changeConstantInFiles(
  //     './contracts',
  //     ['TokenUtilsVenus'],
  //     'WBNB_ADDR',
  //     process.env.WBNB_BSCTESTNET,
  //   );
  //   run('compile');

  // const venusCollateral = await redeploy(
  //   "VenusCollateral",
  //   process.env.DFS_REGISTRY_ADDRESS
  // );
  // writeToEnvFile("VENUS_COLLATERAL_ADDRESS", venusCollateral.address);

  // const venusBorrow = await redeploy("VenusBorrow", process.env.DFS_REGISTRY_ADDRESS);
  // writeToEnvFile("VENUS_BORROW_ADDRESS", venusBorrow.address);

  // const venusRepay = await redeploy("VenusRepay", process.env.DFS_REGISTRY_ADDRESS);
  // writeToEnvFile("VENUS_REPAY_ADDRESS", venusRepay.address);

  // const venusSupply = await redeploy('VenusSupply', process.env.DFS_REGISTRY_ADDRESS);
  // writeToEnvFile("VENUS_SUPPLY_ADDRESS", venusSupply.address)

  // const venusWithdraw = await redeploy('VenusWithdraw', process.env.DFS_REGISTRY_ADDRESS);
  // writeToEnvFile("VENUS_WITHDRAW_ADDRESS", venusWithdraw.address)

  //   /*
  //    ||++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++||
  //    ||                               Cream Lending Pool                               ||
  //    ||++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++||
  // //  */

  // await changeConstantInFiles(
  //   './contracts',
  //   ['MainnetCreamAddresses'],
  //   'COMPTROLLER_ADDR_CREAM',
  //   process.env.CREAM_COMPTROLLER_ADDRESS,

  // );
  // run('compile');

  // await changeConstantInFiles(
  //   './contracts',
  //   ['MainnetVenusAddresses'],
  //   'crBNB',
  //   process.env.CR_BNB_ADDRESS,
  // );
  // run('compile');

  // await changeConstantInFiles(
  //   './contracts',
  //   ['TokenUtilsVenus'],
  //   'WBNB_ADDR',
  //   process.env.WBNB_BSCTESTNET,
  // );
  // run('compile');

  // const creamCollateral = await redeploy("CreamCollateral", process.env.DFS_REGISTRY_ADDRESS);
  // writeToEnvFile("CREAM_COLLATERAL_ADDRESS", creamCollateral.address);

  // const creamBorrow = await redeploy("CreamBorrow", process.env.DFS_REGISTRY_ADDRESS);
  // writeToEnvFile("CREAM_BORROW_ADDRESS", creamBorrow.address);

  // const creamRepay = await redeploy("CreamRepay", process.env.DFS_REGISTRY_ADDRESS);
  // writeToEnvFile("CREAM_REPAY_ADDRESS", creamRepay.address);

  // const creamSupply = await redeploy('CreamSupply', process.env.DFS_REGISTRY_ADDRESS);
  // writeToEnvFile("CREAM_SUPPLY_ADDRESS", creamSupply.address)

  // const creamWithdraw = await redeploy('CreamWithdraw', process.env.DFS_REGISTRY_ADDRESS);
  // writeToEnvFile("CREAM_WITHDRAW_ADDRESS", creamWithdraw.address)

  //   /*
  //    ||++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++||
  //    ||                               WePiggy Lending Pool                               ||
  //    ||++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++||
  // //  */

  // await changeConstantInFiles(
  //   './contracts',
  //   ['MainnetWePiggyAddresses'],
  //   'COMPTROLLER_ADDR_WEPIGGY',
  //   process.env.WEPIGGY_COMPTROLLER_ADDRESS,
  // );
  // run('compile');

  // await changeConstantInFiles(
  //   './contracts',
  //   ['MainnetWePiggyAddresses'],
  //   'P_BNB_ADDR',
  //   process.env.P_BNB_ADDRESS,
  // );
  // run('compile');

  // await changeConstantInFiles(
  //   './contracts',
  //   ['TokenUtilsVenus'],
  //   'WBNB_ADDR',
  //   process.env.WBNB_BSCTESTNET,
  // );
  // run('compile');

  // const wePiggyCollateral = await redeploy("WePiggyCollateral", process.env.DFS_REGISTRY_ADDRESS);
  // writeToEnvFile("WEPIGGY_COLLATERAL_ADDRESS", wePiggyCollateral.address);

  // const wePiggyBorrow = await redeploy("WePiggyBorrow", process.env.DFS_REGISTRY_ADDRESS);
  // writeToEnvFile("WEPIGGY_BORROW_ADDRESS", wePiggyBorrow.address);

  // const wePiggyRepay = await redeploy("WePiggyRepay", process.env.DFS_REGISTRY_ADDRESS);
  // writeToEnvFile("WEPIGGY_REPAY_ADDRESS", wePiggyRepay.address);

  // const wePiggySupply = await redeploy('WePiggySupply', process.env.DFS_REGISTRY_ADDRESS);
  // writeToEnvFile("WEPIGGY_SUPPLY_ADDRESS", wePiggySupply.address)

  // const wePiggyWithdraw = await redeploy('WePiggyWithdraw', process.env.DFS_REGISTRY_ADDRESS);
  // writeToEnvFile("WEPIGGY_WITHDRAW_ADDRESS", wePiggyWithdraw.address)

  //   /*
  //    ||++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++||
  //    ||                               Liqee Lending Pool                               ||
  //    ||++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++||
  // //  */

  // await changeConstantInFiles(
  //   './contracts',
  //   ['MainnetLiqeeAddresses'],
  //   'COMPTROLLER_ADDR_LIQEE',
  //   process.env.LIQEE_COMPTROLLER_ADDRESS,
  // );
  // run('compile');

  // await changeConstantInFiles(
  //   './contracts',
  //   ['MainnetLiqeeAddresses'],
  //   'iBNB',
  //   process.env.I_BNB_ADDRESS,
  // );
  // run('compile');

  // await changeConstantInFiles(
  //   './contracts',
  //   ['TokenUtilsVenus'],
  //   'WBNB_ADDR',
  //   process.env.WBNB_BSCTESTNET,
  // );
  // run('compile');

  // const liqeeBorrow = await redeploy("LiqeeBorrow", process.env.DFS_REGISTRY_ADDRESS);
  // writeToEnvFile("LIQEE_BORROW_ADDRESS", liqeeBorrow.address);

  // const liqeeRepay = await redeploy("LiqeeRepay", process.env.DFS_REGISTRY_ADDRESS);
  // writeToEnvFile("LIQEE_REPAY_ADDRESS", liqeeRepay.address);

  // const liqeeSupply = await redeploy('LiqeeSupply', process.env.DFS_REGISTRY_ADDRESS);
  // writeToEnvFile("LIQEE_SUPPLY_ADDRESS", liqeeSupply.address)

  // const liqeeWithdraw = await redeploy('LiqeeWithdraw', process.env.DFS_REGISTRY_ADDRESS);
  // writeToEnvFile("LIQEE_WITHDRAW_ADDRESS", liqeeWithdraw.address)


}

start(main);
