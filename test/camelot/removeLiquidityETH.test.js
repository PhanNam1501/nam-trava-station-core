const hre = require("hardhat");
const abiCoder = new hre.ethers.utils.AbiCoder();
require("dotenv").config();

const { Action } = require("../teststrategy/Action");
const { getProxy } = require("../utils");
const { ethers } = require("ethers");
const { keccak256 } = require("web3-utils");
const { MAX_UINT256 } = require("trava-simulation-route");

describe("removeLiquidityETH", function () {
    this.timeout(150000);
    console.log("hello");
    it("Test addLiquidityETH", async () => {
      const proxy = await getProxy(process.env.PUBLIC_KEY);
      const router = process.env.ROUTER;
      const tokenAddr = process.env.TOKENC;
      const weth = process.env.WETH9;
      const tokenPair = process.env.PAIR_CWETH;
      const from = process.env.PUBLIC_KEY;
      const deadline = MAX_UINT256;
    //   const amountA = hre.ethers.BigNumber.from("50");
    //   const amountB = hre.ethers.BigNumber.from("50");
      const liquidity = hre.ethers.BigNumber.from("10");
      const amountAmin = hre.ethers.BigNumber.from("0");
      const amountBmin = hre.ethers.BigNumber.from("0");
      const tokenpair = await hre.ethers.getContractAt("IERC20Test",tokenPair);
      console.log("Tokenpair: ", tokenpair.address);
    //   const tokenB = await hre.ethers.getContractAt("IERC20Test",tokenBAddr);
    //   console.log("TokenB: ", tokenB.address);
      const tx1 = await tokenpair.approve(proxy.address, 10**11);
      await tx1.wait();
    //   const tx2 = await tokenB.approve(proxy.address, 10**11);
    //   await tx2.wait();
   
      console.log("remove LiquidityETH");

      
  
      const removeLiquidityETH = new Action(
        "removeLiquidityETH",
        process.env.ADDLIQUIDITYC,
        ["address", "address","address", "uint256","uint256","uint256","uint256","address"],
        [router, tokenAddr, tokenPair, liquidity, amountAmin, amountBmin, deadline, from]
      );
  
      // const calldata = traveSupply.encodeForRecipe()[0];
      const callData = removeLiquidityETH.encodeForDsProxyCall()[1];
  
      console.log("callData", callData);
  
      const removeLiquidityETHContract = await hre.ethers.getContractAt(
        "removeLiquidityETH",
        process.env.REMOVELIQUIDITYETH
      );

      console.log("removeliquidityC_address",removeLiquidityETHContract.address);
  
      // call receive function in proxy contract to send BNB to proxy
      // const ownerAcc = (await hre.ethers.getSigners())[0];
      // await ownerAcc.sendTransaction({
      //   to: proxy.address,
      //   value: amount + amount,
      // });

    
  
      let tx = await proxy["execute(address,bytes)"](
        removeLiquidityETHContract.address,
        callData,
        {
          gasLimit: 20000000,

        }
      );
      console.log("wait");
      tx = await tx.wait();
      
      console.log("tx", tx);
    });
  });