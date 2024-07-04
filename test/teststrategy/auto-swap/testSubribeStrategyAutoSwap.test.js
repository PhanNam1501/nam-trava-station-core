
require('dotenv').config();

const { ethers } = require("hardhat");
const { Strategy, actions, triggers } = require("trava-station-sdk");
const hre = require("hardhat");
const abiCoder = new hre.ethers.utils.AbiCoder();
const { MAX_UINT256 } = require("trava-simulation-route");
const { default: BigNumber } = require('bignumber.js');
const { getProxy } = require('../../utils');

describe("Test AutoSwapStrategy", function () {
    this.timeout(150000);

    it("Test AutoSwapStrategy with gas fee", async () => {
        const proxy = await getProxy(process.env.PUBLIC_KEY);

        const pancakeSwapV2 = process.env.PANCAKE_SWAP_V2_ADDRESS;
        const amountIn = BigNumber(1000).multipliedBy(BigNumber(10).pow(18)).toFixed(0) 
        const amountOutMin = BigNumber(900).multipliedBy(BigNumber(10).pow(18)).toFixed(0) 
        const pathSwap = [process.env.TRAVA_ADDRESS, process.env.USDT_ADDRESS];
        const to = proxy.address
        const deadline = Math.floor(Date.now() / 1000) + 100 * 365 * 24 * 3600; // 20 minutes from now
        const from = proxy.address

        const gasUsed = 50000;
        const feeToken = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
        const availableAmount = 1000;
        const dfsFeeDivider = 100;
        const path = [process.env.WBNB_ADDRESS, process.env.USDT_ADDRESS];

        const startTime = "0";
        const endTime = Math.floor(Date.now() / 1000) + 100 * 365 * 24 * 3600; // 20 minutes from now

        const pancakeFactoryContract = await ethers.getContractAt("IPancakeFactory", process.env.PANCAKE_FACTORY_ADDRESS);
        const pairSwap = (String(await pancakeFactoryContract.getPair(path[0], path[1])))
        const pair = process.env.TRAVA_WBNB_PAIR; // Trava-WBNB pair
        const tokenIn = process.env.TRAVA_TOKEN_ADDRESS;
        const triggerPrice = BigNumber(0.00012).multipliedBy(BigNumber(10).pow(18)).toFixed(0)
        const state = "0";

        const startegyIdOrBundle = 1;
        const strategy_storage_address = process.env.STRATEGY_STORAGE_ADDRESS;

        const strategyStorage = await ethers.getContractAt("StrategyStorage", strategy_storage_address);
        // ----------- Subcribe Strategy ------------
        // let strategyId = await strategyStorage.getStrategyCount();
        // console.log("Strategy count:", strategyId.toString());

        const strategyId = "2";
        const strategyData = await strategyStorage.getStrategy(strategyId);
        console.log("Strategy Data:", strategyData);

        const isBundle = false;

        const amountInEncode = abiCoder.encode(['uint256'], [amountIn]);
        const amountOutMinEncode = abiCoder.encode(['uint256'], [amountOutMin]);
        const pathSwapEncode = pathSwap.map(e => abiCoder.encode(['address'], [e]));
        const toEncode = abiCoder.encode(['address'], [to]);
        const deadlineEncode = abiCoder.encode(['uint256'], [deadline]);
        const fromEncode = abiCoder.encode(['address'], [from]);

        const gasUsedEncode = abiCoder.encode(['uint256'], [gasUsed]);
        const feeTokenEncode = abiCoder.encode(['address'], [feeToken]);
        const availableAmountEncode = abiCoder.encode(['uint256'], [availableAmount]);
        const dfsFeeDividerEncode = abiCoder.encode(['uint256'], [dfsFeeDivider]);
        const pathEncode = path.map(e => abiCoder.encode(['address'], [e]))

        // const timeTriggerData = abiCoder.encode(['uint256', 'uint256'], [startTime, endTime]);
        const priceTrigger = abiCoder.encode(['address', 'address', 'uint256', 'uint8'], [pairSwap, pathSwap[0], triggerPrice, state]);
        console.log("priceTrigger", priceTrigger)
        const strategySub = [
            strategyId,
            isBundle,
            [priceTrigger],
            [
                amountInEncode,
                amountInEncode,
                ...pathSwapEncode,
                toEncode,
                deadlineEncode,
                fromEncode,
                gasUsedEncode,
                feeTokenEncode,
                availableAmountEncode,
                dfsFeeDividerEncode,
                ...pathEncode
            ],
        ];

        console.log(
            "subData",
            amountInEncode,
            amountInEncode,
            ...pathSwapEncode,
            toEncode,
            deadlineEncode,
            fromEncode,
            gasUsedEncode,
            feeTokenEncode,
            availableAmountEncode,
            dfsFeeDividerEncode,
            ...pathEncode
        )
        // const subProxyAddress = process.env.SUB_PROXY_ADDRESS;
        // const SubProxy = await ethers.getContractAt("SubProxy", subProxyAddress);
        // const functionData = SubProxy.interface.encodeFunctionData(
        //     'subscribeToStrategy',
        //     [strategySub]
        // );

        // console.log("Function data after encode:", functionData);

        // const receipt_sub = await proxy['execute(address,bytes)'](subProxyAddress, functionData, {
        //     gasLimit: 1e7,
        // });
        // let tx_sub = await receipt_sub.wait();
        // console.log(tx_sub)

        const subStorageAddress = process.env.SUB_STORAGE_ADDRESS;
        const subStorage = await ethers.getContractAt("SubStorage", subStorageAddress);
        let latestSubId = await subStorage.getSubsCount();
        latestSubId = (latestSubId - 1).toString();

        console.log("subId:", latestSubId);

        let tx_stored_data = await subStorage.getSub(latestSubId);
        console.log("Stored Sub Data:", tx_stored_data.toString());



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
