const hre = require("hardhat");
const abiCoder = new hre.ethers.utils.AbiCoder();
require("dotenv").config();

const { Action } = require("../teststrategy/Action");
const { expect } = require("chai");
const { getProxy } = require("../utils");

describe("Radiant-Repay", function () {
  this.timeout(150000);

  it("Test radiant repay", async () => {
    // const market = "0xd50cf00b6e600dd036ba8ef475677d816d6c4281";
    //0x9c3B4DC4512e78F9E5a847bBB074D1b86FcC0961
    const market = "0x7171054f8d148fe1097948923c91a6596fc29032";
    const amount = "1000000000000";
    const from = process.env.PUBLIC_KEY;
    const proxy = await getProxy(process.env.PUBLIC_KEY);
    const onBehalf = proxy.address;
    // const wbnb = "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c";
    const usdc = "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d";
    const rateMode = 2;


    // const _contractAddress = "0x8FFA62586B97182a48C3D428552F8cd1f7985788";
    const _contractAddress = "0x9c3B4DC4512e78F9E5a847bBB074D1b86FcC0961";
    const tokenAddr = usdc;
    console.log("prepare repay");

    const radiantRepay = new Action(
        "GranaryRepay",
        _contractAddress, //getAddr("GranaryRepay"),
        ["address", "address", "uint256", "uint256", "address", "address"],
        [market, tokenAddr, amount, rateMode, onBehalf, onBehalf]
    );

    const calldata = radiantRepay.encodeForDsProxyCall()[1];

    console.log("calldata", calldata);

    // const IERC20 = await hre.ethers.getContractAt("IERC20Test", trava);
    // await IERC20.approve(proxy.address, amount);

    const repayContract = await hre.ethers.getContractAt(
      "GranaryRepay",
      process.env.GRANARY_REPAY_ADDRESS
    );


    let tx = await proxy["execute(address,bytes)"](
      repayContract.address,
      calldata,
      {
        gasLimit: 2e6,
      }
    );
    await tx.wait()

    console.log("tx", tx);
   
  });
});
