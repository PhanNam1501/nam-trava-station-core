
require('dotenv').config();

const { ethers } = require("hardhat");
const {Strategy, actions, triggers } = require("trava-station-sdk");
const hre = require("hardhat");
const abiCoder = new hre.ethers.utils.AbiCoder();
const { MAX_UINT256 } = require("trava-simulation-route");

describe("Test AutoSwapStrategy", function () {
    this.timeout(150000);

    it("Test AutoSwapStrategy with gas fee", async () => {
        const pancakeSwapV2 = process.env.PANCAKE_SWAP_V2_ADDRESS;
        const amountIn = "1000000000000000000"; // 1 token
        const amountOutMin = "900000000000000000"; // 0.9 token
        const pathSwap = [process.env.TRAVA_TOKEN_ADDRESS, process.env.WBNB_TOKEN_ADDRESS];
        const to = process.env.PUBLIC_KEY_PROXY; // Smart Wallet
        const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from now
        const from = process.env.PUBLIC_KEY_PROXY;
        
        const gasUsed = 50000;
        const feeToken = process.env.WBNB_TOKEN_ADDRESS; // WBNB
        const availableAmount = 1000;
        const dfsFeeDivider = 100;
        const path = [feeToken, process.env.BUSD_TOKEN_ADDRESS];
        
        const pair = process.env.TRAVA_WBNB_PAIR; // Trava-WBNB pair
        const tokenIn = process.env.TRAVA_TOKEN_ADDRESS;
        const triggerPrice = "2000000000000000000"; // 2 tokens
        const state = "0";
        
        const startegyIdOrBundle = 1;
        const isBundle = false;

        const strategy_storage_address = process.env.STRATEGY_STORAGE_ADDRESS;

        const strategyStorage = new ethers.getContractAt("StrategyStorage", strategy_storage_address);
        await strategyStorage.wait();
        // ----------- Subcribe Strategy ------------
        let strategyId = await strategyStorage.getStrategyCount();
        console.log("Strategy count:", strategyId.toString());

        strategyId = "2";
        console.log("Strategy id:", strategyId);

        const strategyData = await strategyStorage.getStrategy(strategyId);
        console.log("Strategy Data:", strategyData);

        const subProxyAddress = process.env.SUB_PROXY_ADDRESS;
        const SubProxy = await ethers.getContractAt("SubProxy", subProxyAddress);
        // const functionData = SubProxy.interface.encodeFunctionData(
        //     'subscribeToStrategy',
        //     [strategySub]
        // );

        // console.log("Function data after encode:", functionData);

        // const proxy = await getProxy(process.env.PUBLIC_KEY);
        // const receipt_sub = await proxy['execute(address,bytes)'](subProxyAddress, functionData, {
        //     gasLimit: 1e7,
        // });
        // await receipt_sub.wait();

        // const subStorageAddress = process.env.SUB_STORAGE_ADDRESS;
        // const subStorage = await ethers.getContractAt("SubStorage", subStorageAddress);
        // let latestSubId = await subStorage.getSubsCount();
        // latestSubId = (latestSubId - 1).toString();

        // console.log("subId:", latestSubId);

        // let tx_stored_data = await subStorage.getSub(latestSubId);
        // console.log("Stored Sub Data:", tx_stored_data.toString());



        // ------------- Call test for strategy -------------
        // const subId = latestSubId;
        // const strategyIndex = 0;
        // const triggerCallData = [];
        // const actionsCallData = [];

        // const claim_reward_value = SubDataServicePancakeSwapV2.encodeForSubDataWithGas(
        //     pancakeSwapV2, amountIn, amountOutMin, pathSwap, to, deadline, from,
        //     gasUsed, feeToken, availableAmount, dfsFeeDivider, path
        // );

        // actionsCallData.push(claim_reward_value);
        // triggerCallData.push(abiCoder.encode(["uint256", 'uint256'], [triggerPrice, state]));

        // console.log("subId:", subId);
        // console.log("strategyIndex:", strategyIndex);
        // console.log("triggerCallData:", triggerCallData);
        // console.log("actionsCallData:", actionsCallData);
        // console.log("strategySub:", strategySub);

        // const StrategyExecutorAddr = process.env.STRATEGY_EXECUTOR_ADDRESS;
        // const StrategyExecutor = await ethers.getContractAt("StrategyExecutor", StrategyExecutorAddr);
        // let tx_callstrategy = await StrategyExecutor.executeStrategy(
        //     subId,
        //     strategyIndex,
        //     triggerCallData,
        //     actionsCallData,
        //     strategySub,
        //     {
        //         gasLimit: 8000000,
        //     }
        // ); 

        // tx_callstrategy = await tx_callstrategy.wait();

        // console.log(tx_callstrategy);
        // console.log("Test strategy auto swap success");
    });
});
