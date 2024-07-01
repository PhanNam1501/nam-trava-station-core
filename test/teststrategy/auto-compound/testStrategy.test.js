// script test from another repo
const { ethers } = require("hardhat");
const { MAX_UINT256 } = require("trava-simulation-route");
const { getProxy } = require("../../utils");

const {Strategy, actions, triggers } = require("phuong-trava-station-sdk");

const hre = require("hardhat");
const abiCoder = new hre.ethers.utils.AbiCoder();

require('dotenv').config();

describe("Test strategy", function () {
    this.timeout(150000);
  
    it("Test strategy", async () => {

    const public_key = process.env.PUBLIC_KEY;
    const proxy = await getProxy(process.env.PUBLIC_KEY);

    const vaultTravaAddr = process.env.TRAVA_STAKING_POOL;
    const MAX = MAX_UINT256;
    const claimStation = process.env.LIQUIDITY_CAMPAIGN_CLAIM_REWARDS_ADDRESS;
    const stakeStation = process.env.LIQUIDITY_CAMPAIGN_STAKE_ADDRESS;
    const feeTakerStation = process.env.GAS_FEE_TAKER;

    const gasUsed = 50000;
    const feeToken = process.env.TRAVA_ADDRESS; //WBNB
    const availableAmount = 1000;
    const dfsFeeDivider = 100;
    const BUSD = process.env.BUSD_TOKEN_ADDRESS;
    const path = [feeToken, BUSD];

    const claim_reward = new actions.trava.LiquidityCampaignClaimRewards(
        '%vaultTravaAddr',
        '%public_key',
        '%MAX',
        '%claimStation'
    )

    const stake = new actions.trava.LiquidityCampaignStake(
        '%vaultTravaAddr',
        '%proxy_address',
        '$1',
        '%public_key',
        '%stakeStation'
    );
    
    const take_gas_fee = new actions.fee.GasFeeTaker(
        '%gasUsed',
        '%feeToken',
        '%availableAmount',
        '%dfsFeeDivider',
        '%path',
        '%path',
        '%feeTakerStation'
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
    autoCompound.addAction(take_gas_fee);
    autoCompound.addTrigger(trigger);
    
    const encoded = autoCompound.encodeForDsProxyCall();
    let [strategyName, triggerIds, actionIds, paramMapping] = encoded;

    console.log(encoded);

    // ----------- Create strategy -----------------

    const strategy_storage_address = process.env.STRATEGY_STORAGE_ADDRESS;

    const strategyStorage = await ethers.getContractAt("StrategyStorage", strategy_storage_address);
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

    const public_keyEncode = abiCoder.encode(['address'] , [public_key]);
    const proxyEncode = abiCoder.encode(['address'] , [proxy.address]);
    const vaultTravaAddrEncoded = abiCoder.encode(['address'] , [vaultTravaAddr]);
    const MAXEncode = abiCoder.encode(['uint256'] , [MAX]);
    const amountStakeEncode = abiCoder.encode(['uint256'] , ['0']);

    const gasUsedEncode = abiCoder.encode(['uint256'] , [gasUsed]);
    const feeTokenEncode = abiCoder.encode(['address'] , [feeToken]);
    const availableAmountEncode = abiCoder.encode(['uint256'] , [availableAmount]);
    const dfsFeeDividerEncode = abiCoder.encode(['uint256'] , [dfsFeeDivider]);
    let pathEncode = [];
    for(let i=0; i<path.length; i++){
        pathEncode[i] = abiCoder.encode(['address'] , [path[i]]);
    }

    const triggerData = abiCoder.encode(['uint256', 'uint256'], [startTime, endTime]);
    const strategySub = [
      strategyId,
      isBundle,
      [triggerData],
      [
        vaultTravaAddrEncoded,
        public_keyEncode,
        MAXEncode,
        vaultTravaAddrEncoded,
        proxyEncode,
        amountStakeEncode,
        public_keyEncode,
        gasUsedEncode,
        feeTokenEncode,
        availableAmountEncode,
        dfsFeeDividerEncode
      ],
    ];

    for (let i = 0; i < pathEncode.length; i++) {
        strategySub[3].push(pathEncode[i]);
    }

    console.log("strategySub:", strategySub);

    const subProxyAddress = process.env.SUB_PROXY_ADDRESS;
    const SubProxy = await ethers.getContractAt("SubProxy", subProxyAddress);
    const functionData = SubProxy.interface.encodeFunctionData(
        'subscribeToStrategy',
        [strategySub],
    );

    console.log("Function data after encode " , functionData);

    const receipt_sub = await proxy['execute(address,bytes)'](subProxyAddress, functionData, {
        gasLimit: 1e7,
    });
    await receipt_sub.wait();

    const subStorageAddress = process.env.SUB_STORAGE_ADDRESS;
    const subStorage = await ethers.getContractAt("SubStorage", subStorageAddress);
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
        public_key,
        MAX,
        claimStation
    )

    const stake_value = new actions.trava.LiquidityCampaignStake(
        vaultTravaAddr,
        proxy.address,
        '0',
        public_key,
        stakeStation
    );

    const take_gas_fee_value = new actions.fee.GasFeeTaker(
        gasUsed,
        feeToken,
        availableAmount,
        dfsFeeDivider,
        path,
        feeTakerStation
    );


    actionsCallData.push(claim_reward_value.encodeForRecipe()[0]);
    actionsCallData.push(stake_value.encodeForRecipe()[0]);
    actionsCallData.push(take_gas_fee_value.encodeForRecipe()[0]);
    triggerCallData.push(abiCoder.encode(["uint256", 'uint256'], [startTime, endTime]));

    console.log("subId: ", subId)
    console.log("strategyIndex: ", strategyIndex)
    console.log("triggerCallData: ", triggerCallData)
    console.log("actionsCallData: ", actionsCallData)
    console.log("strategySub: ", strategySub)

    const StrategyExecutorAddr = process.env.STRATEGY_EXECUTOR_ADDRESS;
    const StrategyExecutor = await ethers.getContractAt("StrategyExecutor", StrategyExecutorAddr);
    let tx_callstrategy = await StrategyExecutor.executeStrategy(
        subId,
        strategyIndex,
        triggerCallData,
        actionsCallData,
        strategySub,
        {
            gasLimit: 8000000,
        },
    ); 
   
    tx_callstrategy = await tx_callstrategy.wait();

    console.log(tx_callstrategy);
    console.log("Test strategy auto compound success");
    });
});
