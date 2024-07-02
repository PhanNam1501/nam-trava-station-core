// script test from another repo
const { ethers } = require("hardhat");
const { MAX_UINT256 } = require("trava-simulation-route");
const { getProxy } = require("../../utils");
const { default: BigNumber } = require('bignumber.js');
const {Strategy, actions, triggers } = require("trava-station-sdk");

const hre = require("hardhat");
const abiCoder = new hre.ethers.utils.AbiCoder();

require('dotenv').config();

describe("Test strategy", function () {
    this.timeout(150000);
  
    it("Test strategy", async () => {


    // ------------- Call test for strategy -------------

    const strategyIndex = 0;
    const actionsCallData = [];
    
    const feeTakerStation = process.env.GAS_FEE_TAKER_ADDRESS;
    const pancakeSwapV2 = process.env.PANCAKE_SWAP_V2_ADDRESS;
    const amountIn = BigNumber(1000).multipliedBy(BigNumber(10).pow(18)).toFixed(0) 
    const amountOutMin = BigNumber(900).multipliedBy(BigNumber(10).pow(18)).toFixed(0) 
    const pathSwap = [process.env.TRAVA_ADDRESS, process.env.WBNB_ADDRESS];
    const to = "0x8E79c4f9c4D71aecd0B00a755Bcfe0b86A5d181E"
    const deadline = Math.floor(Date.now() / 1000) + 100 * 365 * 24 * 3600; // 20 minutes from now
    const from = "0x8E79c4f9c4D71aecd0B00a755Bcfe0b86A5d181E"

    const gasUsed = 50000;
    const feeToken = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
    const availableAmount = 1000;
    const dfsFeeDivider = 100;
    const path = [process.env.WBNB_ADDRESS, process.env.TRAVA_ADDRESS];

    const startTime = "0";
    const endTime = Math.floor(Date.now() / 1000) + 100 * 365 * 24 * 3600; // 20 minutes from now

    const pancakeFactoryContract = await ethers.getContractAt("IPancakeFactory", process.env.PANCAKE_FACTORY_ADDRESS);
    const pairSwap = (String(await pancakeFactoryContract.getPair(pathSwap[0], pathSwap[1])))
    const pair = process.env.TRAVA_WBNB_PAIR; // Trava-WBNB pair
    const tokenIn = process.env.TRAVA_TOKEN_ADDRESS;
    const triggerPrice = BigNumber(0.00012).multipliedBy(BigNumber(10).pow(18)).toFixed(0)
    const state = "1";
    const onchainPriceTriggerAddress = process.env.ONCHAIN_PRICE_TRIGGER;
    const startegyIdOrBundle = 2;

    const pancake_swap = new actions.pancake.PancakeSwapV2(
        amountIn,
        amountOutMin,
        pathSwap,
        to,
        deadline,
        from,
        pancakeSwapV2
    )

    const take_gas_fee = new actions.fee.GasFeeTaker(
        gasUsed,
        feeToken,
        availableAmount,
        dfsFeeDivider,
        path,
        feeTakerStation
    );

    const trigger = new triggers.OnchainPriceTrigger(
        pairSwap,
        tokenIn,
        triggerPrice,
        state,
        onchainPriceTriggerAddress
    )

    actionsCallData.push(pancake_swap.encodeForRecipe()[0]);
    actionsCallData.push(take_gas_fee.encodeForRecipe()[0]);

    console.log("actionsCallData: ", actionsCallData)
    console.log("Test strategy auto compound success");
    });
});


