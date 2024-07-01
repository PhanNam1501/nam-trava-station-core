// script test from another repo

import { Contract, Wallet, ethers } from 'ethers';
import DSProxyAbi from "../../src/abis/Dsproxy.json";
import Bep20Abi from "../../src/abis/Bep20.json";
import ProxyRegisterAbi from "../../src/abis/IProxyRegistry.json";
import StrategyStorageAbi from "../../src/abis/StrategyStorage.json";
import subProxyAbi from "../../src/abis/SubProxy.json";
import subStorageAbi from "../../src/abis/SubStorage.json";
import strategyExecutorAbi from "../../src/abis/StrategyExecutor.json";

import { Action, Strategy, actions, triggers } from "test-trava-station-sdk";
import { Recipe } from "test-trava-station-sdk";
const hre = require("hardhat");
const abiCoder = new hre.ethers.utils.AbiCoder();

require('dotenv').config();

async function test() {
    let url = "https://bsc-testnet.publicnode.com";
    const provider = new ethers.providers.JsonRpcProvider(url);
    const private_key = `0x${process.env.PRIVATE_KEY}`;
    const private_key2 = `0x${process.env.PRIVATE_KEY2}`;

    const public_key = `${process.env.PUBLIC_KEY}`;
    const public_key2 = `${process.env.PUBLIC_KEY2}`;

    const wallet2 = new Wallet(private_key2 , provider);
    const wallet = new Wallet(private_key, provider);

    const dsProxyRegistryAddress = `${process.env.DS_PROXY_REGISTRY_ADDRESS}`;

    const proxyRegistry = new Contract(dsProxyRegistryAddress, ProxyRegisterAbi, wallet);
    const proxy_address = await proxyRegistry.proxies(public_key);
    const proxy_address2 = await proxyRegistry.proxies(public_key2);

    const vaultTravaAddr = `${process.env.VAULT_TRAVA_ADDRESS}`;
    const MAX = "115792089237316195423570985008687907853269984665640564039457584007913129639935";
    const claimStation = `${process.env.LIQUIDITY_CAMPAIGN_CLAIM_REWARDS_ADDRESS}`;
    const stakeStation = `${process.env.LIQUIDITY_CAMPAIGN_STAKE_ADDRESS}`;

    const claim_reward = new actions.trava.LiquidityCampaignClaimRewards(
        '%vaultTravaAddr',
        '%public_key2',
        '%MAX',
        '%claimStation'
    )

    //const amountStake = BigInt(1e20).toString();

    const stake = new actions.trava.LiquidityCampaignStake(
        '%vaultTravaAddr',
        '%proxy_address2',
        '$1',
        '%public_key2',
        '%stakeStation'
    );

    const startTime = "0";
    const endTime = "1709657431";
    const timeTiggerAddress = "0xe6c3b4f18E063eF40A85885446FE3cd776490C26"
    const trigger = new triggers.TimeTrigger(
        startTime,
        endTime,
        timeTiggerAddress
    )
    const autoCompound = new Strategy("AutoCompound");

    autoCompound.addAction(claim_reward);
    autoCompound.addAction(stake);
    autoCompound.addTrigger(trigger);
    
    const encoded = autoCompound.encodeForDsProxyCall();
    let [strategyName, triggerIds, actionIds, paramMapping] = encoded;

    console.log(encoded);

    // ----------- Create strategy -----------------

    const strategy_storage_address = `${process.env.STRATEGY_STORAGE_ADDRESS}`;

    const strategyStorage = new Contract(strategy_storage_address, StrategyStorageAbi, wallet);

    const receipt = await strategyStorage.createStrategy(
        strategyName, triggerIds, actionIds, paramMapping, true
    );

    await receipt.wait();
    let strategyId = await strategyStorage.getStrategyCount();


    // ----------- Subcribe Strategy ------------
    // with strategySub = [strategyId, isBundle, [triggerData], [targetValueEncoded]];
    
    strategyId = (strategyId-1).toString();
    console.log("Startegy id " , strategyId.toString());
  
    const strategy_data = await strategyStorage.getStrategy(strategyId);
    console.log("Strategy Data " , strategy_data);

    const isBundle = false;

    const public_key2Encode = abiCoder.encode(['address'] , [public_key2]);
    const proxy2Encode = abiCoder.encode(['address'] , [proxy_address2]);
    const vaultTravaAddrEncoded = abiCoder.encode(['address'] , [vaultTravaAddr]);
    const MAXEncode = abiCoder.encode(['uint256'] , [MAX]);
    const amountStakeEncode = abiCoder.encode(['uint256'] , ['0']);

    const triggerData = abiCoder.encode(['uint256', 'uint256'], [startTime, endTime]);
    const strategySub = [strategyId, isBundle, [triggerData], [ vaultTravaAddrEncoded, public_key2Encode , MAXEncode , vaultTravaAddrEncoded, proxy2Encode , amountStakeEncode, public_key2Encode]];
    console.log("strategySub:", strategySub);

    const subProxyAddress = `${process.env.SUB_PROXY_ADDRESS}`;
    const SubProxy = new Contract(subProxyAddress, subProxyAbi, provider);

    const functionData = SubProxy.interface.encodeFunctionData(
        'subscribeToStrategy',
        [strategySub],
    );

    console.log("Function data after encode " , functionData);

    const proxyContract = new Contract(proxy_address2, DSProxyAbi, wallet2);
    const receipt_sub = await proxyContract['execute(address,bytes)'](subProxyAddress, functionData, {
        gasLimit: 1e7,
    });
    await receipt_sub.wait();

    const subStorageAddress = `${process.env.SUB_STORAGE_ADDRESS}`;
    const subStorage = new Contract(subStorageAddress, subStorageAbi, wallet);

    let latestSubId = await subStorage.getSubsCount();
    latestSubId = (latestSubId - 1).toString();

    console.log("subId ", latestSubId);
    
    let tx_stored_data = await subStorage.getSub(latestSubId);

    console.log(tx_stored_data.toString());

    // ------------- Call test for strategy -------------

    const subId = latestSubId;
    const strategyIndex = 0;
    const triggerCallData = [];
    const actionsCallData = [];
    
    const claim_reward_value = new actions.trava.LiquidityCampaignClaimRewards(
        vaultTravaAddr,
        public_key2,
        MAX,
        claimStation
    )

    const amountStake = '0';

    const stake_value = new actions.trava.LiquidityCampaignStake(
        vaultTravaAddr,
        proxy_address2,
        '0',
        public_key2,
        stakeStation
    );


    actionsCallData.push(claim_reward_value.encodeForRecipe()[0]);
    actionsCallData.push(stake_value.encodeForRecipe()[0]);
    triggerCallData.push(abiCoder.encode(["uint256", 'uint256'], [startTime, endTime]));

    console.log("subId: ", subId)
    console.log("strategyIndex: ", strategyIndex)
    console.log("triggerCallData: ", triggerCallData)
    console.log("actionsCallData: ", actionsCallData)
    console.log("strategySub: ", strategySub)

    const StrategyExecutorAddr = `${process.env.STRATEGY_EXECUTOR_ADDRESS}`
    const StrategyExecutor = new Contract(StrategyExecutorAddr, strategyExecutorAbi, wallet);

    const tx_callstrategy = await StrategyExecutor.executeStrategy(
        subId,
        strategyIndex,
        triggerCallData,
        actionsCallData,
        strategySub,
        {
            gasLimit: 8000000,
        },
    );

    await tx_callstrategy.wait();

    console.log(tx_callstrategy);
    console.log("Test strategy auto compound success");
}

test();