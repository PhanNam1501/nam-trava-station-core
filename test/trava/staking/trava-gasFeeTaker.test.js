const { ethers } = require("hardhat");
const hre = require("hardhat");
const { MAX_UINT256 } = require("trava-simulation-route");
const abiCoder = new hre.ethers.utils.AbiCoder();
require("dotenv").config();

const { Action } = require("../../teststrategy/Action");
const { getProxy } = require("../../utils");
const { actions } = require("phuong-trava-station-sdk");


describe("Trava-GasFeeTaker", function () {
  this.timeout(150000);

  it("Test trava gas fee taker", async () => {
    const gasUsed = MAX_UINT256;
    const feeToken = "0xE1F005623934D3D8C724EC68Cc9bFD95498D4435"; //trava

    const availableAmount = "1000";
    const dfsFeeDivider = "100";
    const proxy = await getProxy(process.env.PUBLIC_KEY);
    const BUSD = "0x8ADE9A293528EB21f2fD9d7fF6eD919Adf1AdEC7";

    console.log("prepare");
    
    const travaFeeTaker = new actions.fee.GasFeeTaker(
      gasUsed,
      feeToken,
      availableAmount,
      dfsFeeDivider,
      [feeToken, BUSD],
      process.env.GAS_FEE_TAKER
    );

    const calldata = travaFeeTaker.encodeForDsProxyCall()[1];
    console.log("calldata", calldata);

    const gasFeeTakerContract = await hre.ethers.getContractAt(
      "GasFeeTaker",
      process.env.GAS_FEE_TAKER
    );

    let tx = await proxy["execute(address,bytes)"](
      gasFeeTakerContract.address,
      calldata,
      {
        gasLimit: 20000000,
      }
    );

    tx = await tx.wait();
    console.log("tx", tx);
  });
});
