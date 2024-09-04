const hre = require("hardhat");
const abiCoder = new hre.ethers.utils.AbiCoder();
require("dotenv").config();

const { Action } = require("../teststrategy/Action");
const { getProxy } = require("../utils");
const { ethers } = require("ethers");
const { keccak256 } = require("web3-utils");

describe("addLiquidity", function () {
    this.timeout(150000);
    console.log("hello");
    it("Test addLiquidity", async () => {
      const proxy = await getProxy(process.env.PUBLIC_KEY);
      const exchange = process.env.TOKEN_EXCHANGE;
      const tokenAddr = process.env.TOKEN;
      const maxSlippage = hre.ethers.utils.parseEther("11");
      const from = process.env.PUBLIC_KEY;
      const amountETH = hre.ethers.BigNumber.from("100");
      const token = await hre.ethers.getContractAt("IERC20Test",tokenAddr);
      console.log("Token: ", token.address);
      const tx1 = await token.approve(proxy.address, 10**11);
      await tx1.wait();
   

      const tokenexchange = await hre.ethers.getContractAt("TokenExchange", exchange);
      const tx2 = await tokenexchange.getLiquidity();
      console.log(tx2);
      console.log("Add Liquidity");

      
  
      const addLiquidity = new Action(
        "addLiquidity",
        process.env.ADDLIQUIDITY,
        ["address", "address", "uint256", "address","uint256"],
        [exchange, tokenAddr, maxSlippage, from, amountETH]
      );
  
      // const calldata = traveSupply.encodeForRecipe()[0];
      const callData = addLiquidity.encodeForDsProxyCall()[1];
  
      console.log("callData", callData);
  
      const addLiquidityContract = await hre.ethers.getContractAt(
        "addLiquidity",
        process.env.ADDLIQUIDITY
      );

      console.log("addliquidity_address",addLiquidityContract.address);
  
      // call receive function in proxy contract to send BNB to proxy
      // const ownerAcc = (await hre.ethers.getSigners())[0];
      // await ownerAcc.sendTransaction({
      //   to: proxy.address,
      //   value: amount + amount,
      // });

    
  
      let tx = await proxy["execute(address,bytes)"](
        addLiquidityContract.address,
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