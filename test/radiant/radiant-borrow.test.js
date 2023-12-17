const hre = require("hardhat");
const abiCoder = new hre.ethers.utils.AbiCoder();
require("dotenv").config();

const { Action } = require("../teststrategy/Action");
const { expect } = require("chai");
const { getProxy } = require("../utils");

describe("Radiant-Borrow", function () {
  this.timeout(150000);

  it("Test radiant borrow", async () => {
    const market = "0x6df52f798740504c24ccd374cf7ce81b28ce8330";
    const amount = 1e3;
    const to = process.env.PUBLIC_KEY;
    const proxy = await getProxy(process.env.PUBLIC_KEY);
    const onBehalf = proxy.address;
    const trava = "0xE1F005623934D3D8C724EC68Cc9bFD95498D4435";
    const rateMode = 2;

    console.log("prepare borrow");

    const radiantBorrow = new Action(
      "RadiantBorrow",
      process.env.RADIANT_BORROW_ADDRESS,
      ["address", "address", "uint256", "uint256", "address", "address"],
      [market, trava, amount, rateMode, to, onBehalf]
    );

    const calldata = radiantBorrow.encodeForDsProxyCall()[1];

    console.log("calldata", calldata);

    // const IERC20 = await hre.ethers.getContractAt("IERC20Test", trava);
    // await IERC20.approve(proxy.address, amount);

    const borrowContract = await hre.ethers.getContractAt(
      "RadiantBorrow",
      process.env.RADIANT_BORROW_ADDRESS
    );


    let tx = await proxy["execute(address,bytes)"](
      borrowContract.address,
      calldata,
      {
        gasLimit: 2e7,
      }
    );

    tx = await tx.wait();
    console.log("tx", tx);
   
  });
});
