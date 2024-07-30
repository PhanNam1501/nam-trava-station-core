const hre = require("hardhat");
const abiCoder = new hre.ethers.utils.AbiCoder();
require("dotenv").config();

const { Action } = require("../teststrategy/Action");
const { expect } = require("chai");
const { getProxy } = require("../utils");

describe("Radiant-Repay", function () {
  this.timeout(150000);

  it("Test radiant repay", async () => {
    const market = "0xd50cf00b6e600dd036ba8ef475677d816d6c4281";
    const amount = "10000000000001";
    const from = process.env.PUBLIC_KEY;
    const proxy = await getProxy(process.env.PUBLIC_KEY);
    const onBehalf = proxy.address;
    const wbnb = "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c";
    const rateMode = 2;


    const _contractAddress = "0x8FFA62586B97182a48C3D428552F8cd1f7985788";
    const tokenAddr = wbnb;
    console.log("prepare repay");

    const radiantRepay = new Action(
        "RadiantRepay",
        _contractAddress, //getAddr("RadiantRepay"),
        ["address", "address", "uint256", "uint256", "address", "address"],
        [market, tokenAddr, amount, rateMode, from, onBehalf]
    );

    const calldata = radiantRepay.encodeForDsProxyCall()[1];

    console.log("calldata", calldata);

    // const IERC20 = await hre.ethers.getContractAt("IERC20Test", trava);
    // await IERC20.approve(proxy.address, amount);

    const repayContract = await hre.ethers.getContractAt(
      "RadiantRepay",
      process.env.RADIANT_REPAY_ADDRESS
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
