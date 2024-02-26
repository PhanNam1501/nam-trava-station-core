const hre = require("hardhat");
const { MAX_UINT256 } = require("trava-simulation-route");
const abiCoder = new hre.ethers.utils.AbiCoder();
require("dotenv").config();

const { Action } = require("../../teststrategy/Action");
const { getProxy } = require("../../utils");

describe("Trava-GasFeeTaker", function () {
  this.timeout(150000);

  it("Test trava gas fee taker", async () => {
    const gasUsed = 50000;
    const feeToken = "0xE1F005623934D3D8C724EC68Cc9bFD95498D4435";
    const availableAmount = 1000;
    const dfsFeeDivider = 100;
    const proxy = await getProxy(process.env.PUBLIC_KEY);

    console.log("prepare");

    const token = await ethers.getContractAt(
      "ERC20Mock",
      feeToken
    );

    await token.approve(
      process.env.PUBLIC_KEY,
      MAX_UINT256
    );

    const travaFeeTaker = new Action(
      "gasFeeTaker",
      process.env.TRAVA_GAS_FEE_TAKER_ADDRESS,
      ["uint256", "address", "uint256","uint256"],
      [gasUsed, feeToken, availableAmount, dfsFeeDivider]
    );

    const calldata = travaFeeTaker.encodeForDsProxyCall()[1];
    console.log("calldata", calldata);

    const gasFeeTakerContract = await hre.ethers.getContractAt(
      "GasFeeTaker",
      process.env.TRAVA_GAS_FEE_TAKER_ADDRESS
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
