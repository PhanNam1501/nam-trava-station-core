const hre = require("hardhat");
const abiCoder = new hre.ethers.utils.AbiCoder();
require("dotenv").config();

const { Action } = require("../teststrategy/Action");
const { getProxy } = require("../utils");
const { ethers } = require("ethers");
const { keccak256 } = require("web3-utils");

describe("swapLiquidity", function () {
    this.timeout(150000);
    console.log("hello");
    it("Test swapLiquidity", async () => {
      const proxy = await getProxy(process.env.PUBLIC_KEY);
      const exchange = process.env.TOKEN_EXCHANGE;
      const tokenAddr = process.env.TOKEN;
      const from = process.env.PUBLIC_KEY;
      const to = process.env.PUBLIC_KEY;
      const maxSlippage = hre.ethers.utils.parseEther("0.11");
      const amount = hre.ethers.BigNumber.from("10");
      const token = await hre.ethers.getContractAt("IERC20Test",tokenAddr);
      const checkETH = true;
      console.log("Token: ", token.address);
      const tx1 = await token.approve(proxy.address, 10**11);
      await tx1.wait();
   
   

      const tokenexchange = await hre.ethers.getContractAt("TokenExchange", exchange);
      const tx2 = await tokenexchange.getLiquidity();
      console.log(tx2);
      console.log("Remove Liquidity");

      
  
      const swapLiquidity = new Action(
        "swapLiquidity",
        process.env.SWAPLIQUIDITY,
        ["address", "address", "address", "address", "uint256", "uint256", "bool"],
        [exchange, tokenAddr, from, to, maxSlippage, amount, checkETH]
      );
  
      // const calldata = traveSupply.encodeForRecipe()[0];
      const callData = swapLiquidity.encodeForDsProxyCall()[1];
  
      console.log("callData", callData);
  
      const swapLiquidityContract = await hre.ethers.getContractAt(
        "swapLiquidity",
        process.env.SWAPLIQUIDITY
      );

      console.log("swapliquidity_address",swapLiquidityContract.address);
  
      // call receive function in proxy contract to send BNB to proxy
      // const ownerAcc = (await hre.ethers.getSigners())[0];
      // await ownerAcc.sendTransaction({
      //   to: proxy.address,
      //   value: amount + amount,
      // });

    
  
      let tx = await proxy["execute(address,bytes)"](
        swapLiquidityContract.address,
        callData,
        {
          gasLimit: 20000000,
          value: checkETH ? amount : 0
        }
      );
      console.log("wait");
      tx = await tx.wait();
      
      console.log("tx", tx);
    });
  });