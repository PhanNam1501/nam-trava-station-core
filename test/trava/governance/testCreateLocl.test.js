const { expect } = require("chai");
const { getProxy } = require("../../utils");
const { ethers } = require("ethers");
const { Recipe, actions } = require("trava-station-sdk");

describe("Governace - Create Lock Action", function () {
  this.timeout(150000);

  it("Should create lock using CreateLock action", async () => {
    const from = process.env.PUBLIC_KEY;
    const proxy = await getProxy(process.env.PUBLIC_KEY);
    const tokenAddress = process.env.TRAVA_TOKEN_ADDRESS;
    const amount = "100"
    // const IERC20 = await hre.ethers.getContractAt("IERC20Test", tokenAddress);
    // await IERC20.approve(proxy.address, amount);
    // console.log("prepare create lock");

    const createLock = new actions.trava.TravaGovernanceCreateLock(
      tokenAddress,
      amount,
      "604800",
      proxy.address,
      from,
      process.env.TRAVA_GOVERNANCE_CREATE_LOCK_ADDRESS
    )

    const recipe = new Recipe(
      "ok",
      56,
      [createLock]
    )
    const calldata = recipe.encodeForDsProxyCall();

    let tx = await proxy["execute(address,bytes)"](
      calldata[0], 
      calldata[1],
      {
        gasLimit: 2000000,
      }
    );

    tx = await tx.wait();
    console.log("tx", tx);
  });
});
