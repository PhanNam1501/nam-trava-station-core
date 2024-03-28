const { expect } = require("chai");
const { getProxy } = require("../../utils");
const { Action } = require("../../teststrategy/Action");

describe("Orai-WithdrawUnstaked Action", function () {
  this.timeout(150000);

  it("Should withdraw unstaked tokens using OraiWithdrawUnstaked action", async () => {
    const oraiStakingContract = process.env.ORAI_STAKING_CONTRACT;
    const proxy = await getProxy(process.env.PUBLIC_KEY);

    console.log("prepare withdraw unstaked");

    const oraiWithdrawUnstaked = new Action (
      "OraiWithdrawUnstaked",
      process.env.ORAI_WITHDRAWSTAKE_ADDRESS,
      ["address"],
      [oraiStakingContract]
    )


    const calldata = oraiWithdrawUnstaked.encodeForDsProxyCall()[1];
    console.log("calldata", calldata);

    const withdrawUnstakedContract = await hre.ethers.getContractAt(
      "OraiWithdrawUnstaked",
      process.env.ORAI_WITHDRAWSTAKE_ADDRESS
    );

    let tx = await proxy["execute(address,bytes)"](
      withdrawUnstakedContract.address,
      calldata,
      {
        gasLimit: 20000000,
      }
    );

    tx = await tx.wait();
    console.log("tx", tx);

  });
});
