
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

        const strategyStorage = await ethers.getContractAt("StrategyStorage", strategy_storage_address);
        // ----------- Subcribe Strategy ------------
        let strategyId = await strategyStorage.getStrategyCount();
        console.log("Strategy count:", strategyId.toString());

        strategyId = "2";
        console.log("Strategy id:", strategyId);

        const strategyData = await strategyStorage.getStrategy(strategyId);
        console.log("Strategy Data:", strategyData);
    });
});
