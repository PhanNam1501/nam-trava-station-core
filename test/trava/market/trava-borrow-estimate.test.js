const hre = require("hardhat");
const { ethers } = require("ethers")
const abiCoder = new hre.ethers.utils.AbiCoder();
require("dotenv").config();

const { Action } = require("../../teststrategy/Action");
const { expect } = require("chai");
const { getProxy } = require("../../utils");
const lendingPoolABI = require("../../../artifacts/contracts/interfaces/trava/market/ILendingPool.sol/ILendingPool.json").abi


describe("Trava-Borrow", function () {


    this.timeout(150000);

    const estimateGasForFunctionCall = async (functionName, parameters) => {
        try {
            let lendingPoolAddr = "0x75de5f7c91a89c16714017c7443eca20c7a8c295";
            let provider = new ethers.providers.JsonRpcProvider("https://endpoints.omniatech.io/v1/bsc/mainnet/public");
            let lpContract = new ethers.Contract(lendingPoolAddr, lendingPoolABI, provider)
            // Encode the function call data
            const data = lpContract.interface.encodeFunctionData(functionName, parameters);
            console.log("data", data)
            // Estimate the gas cost
            const gasEstimate = await provider.estimateGas({
                to: lendingPoolAddr,
                data: data,
            });

            console.log(`Gas estimate for ${functionName}: ${gasEstimate.toString()}`);
            return gasEstimate;
        } catch (error) {
            console.error('Gas estimation error:', error);
            throw error; // Handle the error as needed
        }
    }

    it("Test trava borrow", async () => {


        let functionName = "deposit"
        let functionParameters = [
            "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
            "115792089237316195423570985008687907853269984665640564039457584007913129639935",
            "0x8E79c4f9c4D71aecd0B00a755Bcfe0b86A5d181E",
            "0"

        ]

        const gasEstimate = await estimateGasForFunctionCall(functionName, functionParameters);

        console.log("gasEstimate", gasEstimate)
        // const market = "0x50794d89dbdb2d3aba83820bc3557ff076ca481b";
        // const tokenAddress = process.env.TRAVA_TOKEN_IN_MARKET;
        // const amount = 1e1;
        // const to = process.env.PUBLIC_KEY;
        // const proxy = await getProxy(process.env.PUBLIC_KEY);
        // const onBehalf = proxy.address;
        // const enableAsColl = false;
        // const trava = "0xE1F005623934D3D8C724EC68Cc9bFD95498D4435";

        // console.log("prepare borrow");

        // const traveBorrow = new Action(
        //   "TravaBorrow",
        //   process.env.TRAVA_BORROW_ADDRESS,
        //   ["address", "address", "uint256", "address", "address"],
        //   [market, trava, amount, to, onBehalf]
        // );

        // const calldata = traveBorrow.encodeForDsProxyCall()[1];
        // console.log("calldata", calldata);

        // // const IERC20 = await hre.ethers.getContractAt("IERC20Test", trava);
        // // await IERC20.approve(proxy.address, amount);

        // const borrowContract = await hre.ethers.getContractAt(
        //   "TravaBorrow",
        //   process.env.TRAVA_BORROW_ADDRESS
        // );

        // // call receive function in proxy contract to send BNB to proxy
        // // const ownerAcc = (await hre.ethers.getSigners())[0];
        // // await ownerAcc.sendTransaction({
        // //   to: proxy.address,
        // //   value: amount + amount,
        // // });

        // let tx = await proxy["execute(address,bytes)"](
        //   borrowContract.address,
        //   calldata,
        //   {
        //     gasLimit: 20000000,
        //   }
        // );

        tx = await tx.wait();
        console.log("tx", tx);
        //        console.log("ok")
    });
});
