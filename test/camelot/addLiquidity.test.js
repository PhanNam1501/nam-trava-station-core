const hre = require("hardhat");
const abiCoder = new hre.ethers.utils.AbiCoder();
require("dotenv").config();

const { Action } = require("../teststrategy/Action");
const { getProxy } = require("../utils");
const { ethers } = require("ethers");
const { keccak256 } = require("web3-utils");
const { MAX_UINT256 } = require("trava-simulation-route");

describe("addLiquidityC", function () {
    this.timeout(150000);
    console.log("hello");
    it("Test addLiquidityC", async () => {
      const proxy = await getProxy(process.env.PUBLIC_KEY);
      const router = process.env.ROUTER;
      const tokenAAddr = process.env.TOKENA;
      const tokenBAddr = process.env.TOKENB;
      const from = process.env.PUBLIC_KEY;
      const deadline = MAX_UINT256;
      const amountA = hre.ethers.BigNumber.from("50");
      const amountB = hre.ethers.BigNumber.from("50");
      const amountAmin = hre.ethers.BigNumber.from("0");
      const amountBmin = hre.ethers.BigNumber.from("0");
      const tokenA = await hre.ethers.getContractAt("IERC20Test",tokenAAddr);
      console.log("TokenA: ", tokenA.address);
      const tokenB = await hre.ethers.getContractAt("IERC20Test",tokenBAddr);
      console.log("TokenB: ", tokenB.address);
      const tx1 = await tokenA.approve(proxy.address, 10**11);
      await tx1.wait();
      const tx2 = await tokenB.approve(proxy.address, 10**11);
      await tx2.wait();
   
      console.log("Add Liquidity");

      
  
      const addLiquidityC = new Action(
        "addLiquidityC",
        process.env.ADDLIQUIDITYC,
        ["address", "address", "address","uint256", "uint256","uint256","uint256","uint256","address"],
        [router, tokenAAddr, tokenBAddr, amountA, amountB, amountAmin, amountBmin, deadline, from]
      );
  
      // const calldata = traveSupply.encodeForRecipe()[0];
      const callData = addLiquidityC.encodeForDsProxyCall()[1];
  
      console.log("callData", callData);
  
      const addLiquidityCContract = await hre.ethers.getContractAt(
        "addLiquidityC",
        process.env.ADDLIQUIDITYC
      );

      console.log("addliquidityC_address",addLiquidityCContract.address);
  
      // call receive function in proxy contract to send BNB to proxy
      // const ownerAcc = (await hre.ethers.getSigners())[0];
      // await ownerAcc.sendTransaction({
      //   to: proxy.address,
      //   value: amount + amount,
      // });

    
  
      let tx = await proxy["execute(address,bytes)"](
        addLiquidityCContract.address,
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