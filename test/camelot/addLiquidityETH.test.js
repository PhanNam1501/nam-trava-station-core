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
      const tokenAddr = process.env.TOKENA;
      const from = process.env.PUBLIC_KEY;
      const deadline = MAX_UINT256;
      const amountToken = 50
      const amountETH = hre.ethers.BigNumber.from("50");
      const amountTokenmin = hre.ethers.BigNumber.from("0");
      const amountETHmin = hre.ethers.BigNumber.from("0");
      const token = await hre.ethers.getContractAt("IERC20Test",tokenAddr);
      console.log("Token: ", token.address);
      const tx1 = await token.approve(proxy.address, 10**11);
      await tx1.wait();
      
   
      console.log("Add LiquidityETH");

      
  
      const addLiquidityETH = new Action(
        "addLiquidityETH",
        process.env.ADDLIQUIDITYETH,
        ["address", "address", "uint256", "uint256", "uint256","uint256","address","uint256"],
        [router, tokenAddr, amountToken,  amountETH, amountTokenmin, amountETHmin, from, deadline]
      );
  
      // const calldata = traveSupply.encodeForRecipe()[0];
      const callData = addLiquidityETH.encodeForDsProxyCall()[1];
  
      console.log("callData", callData);
  
      const addLiquidityETHContract = await hre.ethers.getContractAt(
        "addLiquidityETH",
        process.env.ADDLIQUIDITYETH
      );

      console.log("addliquidityETH_address",addLiquidityETHContract.address);
  
      // call receive function in proxy contract to send BNB to proxy
      // const ownerAcc = (await hre.ethers.getSigners())[0];
      // await ownerAcc.sendTransaction({
      //   to: proxy.address,
      //   value: amount + amount,
      // });

    
  
      let tx = await proxy["execute(address,bytes)"](
        addLiquidityETHContract.address,
        callData,
        {
          gasLimit: 20000000,
          value: amountETH
        }
      );
      console.log("wait");
      tx = await tx.wait();
      
      console.log("tx", tx);
    });
  });