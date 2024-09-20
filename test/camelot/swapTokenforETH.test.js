const hre = require("hardhat");
const abiCoder = new hre.ethers.utils.AbiCoder();
require("dotenv").config();

const { Action } = require("../teststrategy/Action");
const { getProxy } = require("../utils");
const { ethers } = require("ethers");
const { keccak256 } = require("web3-utils");
const { MAX_UINT256 } = require("trava-simulation-route");

describe("swapTokenforETH", function () {
    this.timeout(150000);
    console.log("hello");
    it("Test swapTokenforETH", async () => {
      const proxy = await getProxy(process.env.PUBLIC_KEY);
      const router = process.env.ROUTER;
      const tokenAddr = process.env.TOKENC;
      const weth = process.env.WETH9;
      const from = process.env.PUBLIC_KEY;
      const deadline = MAX_UINT256;
      const amountETHIn = hre.ethers.BigNumber.from("10");
      const amountOutMin = hre.ethers.BigNumber.from("0");
      const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000';
      const referrer = ADDRESS_ZERO;
      
      const tokenA = await hre.ethers.getContractAt("IERC20Test",tokenAddr);
      console.log("TokenA: ", tokenA.address);
      const tokenB = await hre.ethers.getContractAt("IERC20Test",weth);
      console.log("TokenB: ", tokenB.address);
      const tx1 = await tokenA.approve(proxy.address, 10**11);
      await tx1.wait();
    //   const tx2 = await tokenB.approve(proxy.address, 10**11);
    //   await tx2.wait();
   
      console.log("Swap Liquidity");

      
  
      const swapTokenforETH = new Action(
        "swapTokenforETH",
        process.env.SWAPTOKENFORTOKEN,
        ["address", "address[]", "uint256", "uint256","address","address", "uint256"],
        [router, [tokenAddr, weth], amountETHIn, amountOutMin ,from, referrer, deadline]
      );
  
      // const calldata = traveSupply.encodeForRecipe()[0];
      const callData = swapTokenforETH.encodeForDsProxyCall()[1];
  
      console.log("callData", callData);
  
      const swapTokenforETHContract = await hre.ethers.getContractAt(
        "swapTokenforETH",
        process.env.SWAPTOKENFORETH
      );

      console.log("swapTokenforETH_address",swapTokenforETHContract.address);
  
      // call receive function in proxy contract to send BNB to proxy
      // const ownerAcc = (await hre.ethers.getSigners())[0];
      // await ownerAcc.sendTransaction({
      //   to: proxy.address,
      //   value: amount + amount,
      // });

    
  
      let tx = await proxy["execute(address,bytes)"](
        swapTokenforETHContract.address,
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