const hre = require("hardhat");
const abiCoder = new hre.ethers.utils.AbiCoder();
require("dotenv").config();

const { Action } = require("../teststrategy/Action");
const { getProxy } = require("../utils");
const { ethers } = require("ethers");
const { keccak256 } = require("web3-utils");

describe("removeLiquidity", function () {
    this.timeout(150000);
    console.log("hello");
    it("Test swapLiquidity", async () => {
      const proxy = await getProxy(process.env.PUBLIC_KEY);
      const exchange = process.env.TOKEN_EXCHANGE;
      const tokenAddr = process.env.TOKEN;
      const to = process.env.PUBLIC_KEY;
      const amount = hre.ethers.BigNumber.from("10");
      const token = await hre.ethers.getContractAt("IERC20Test",tokenAddr);
      console.log("Token: ", token.address);
      const tx1 = await token.approve(proxy.address, 10**11);
      await tx1.wait();
   
   

      const tokenexchange = await hre.ethers.getContractAt("TokenExchange", exchange);
      const tx2 = await tokenexchange.getLiquidity();
      console.log(tx2);
      console.log("Remove Liquidity");

      
  
      const removeLiquidity = new Action(
        "removeLiquidity",
        process.env.REMOVELIQUIDITY,
        ["address", "address", "address","uint256"],
        [exchange, tokenAddr, to, amountETH]
      );
  
      // const calldata = traveSupply.encodeForRecipe()[0];
      const callData = removeLiquidity.encodeForDsProxyCall()[1];
  
      console.log("callData", callData);
  
      const removeLiquidityContract = await hre.ethers.getContractAt(
        "removeLiquidity",
        process.env.REMOVELIQUIDITY
      );

      console.log("removeliquidity_address",removeLiquidityContract.address);
  
      // call receive function in proxy contract to send BNB to proxy
      // const ownerAcc = (await hre.ethers.getSigners())[0];
      // await ownerAcc.sendTransaction({
      //   to: proxy.address,
      //   value: amount + amount,
      // });

    
  
      let tx = await proxy["execute(address,bytes)"](
        removeLiquidityContract.address,
        callData,
        {
          gasLimit: 20000000,
          value:amountETH
        }
      );
      console.log("wait");
      tx = await tx.wait();
      
      console.log("tx", tx);
    });
  });