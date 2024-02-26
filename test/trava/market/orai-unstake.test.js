const { expect } = require("chai");
const { getProxy } = require("../../utils");
const { ethers } = require("ethers");
const { Action } = require("../../teststrategy/Action");

describe("Trava-Unstake Action", function () {
  this.timeout(150000);

  it("Should unstake tokens using TravaUnstake action", async () => {
    const oraiStakingContract = process.env.ORAI_STAKING_CONTRACT;
    const amountToUnStake = 7;
    const proxy = await getProxy(process.env.PUBLIC_KEY);
    const onBehalf = proxy.address;

    const tokenAddress = process.env.SC_ORAI_ADDRESS;
    const to = process.env.PUBLIC_KEY;

    const timestamp = Date.now();
    console.log(timestamp);

    const exchangeRate = "1280004144816636700";
    const privateKey = process.env.PRIVATE_KEY;
    const wallet = new ethers.Wallet(privateKey);
    const message = ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(["uint", "uint"], [timestamp, exchangeRate]));
    const signature = await wallet.signMessage(ethers.utils.arrayify(message));
    console.log(signature);

    // const IERC20 = await hre.ethers.getContractAt("IERC20Test", tokenAddress);
    // await IERC20.approve(proxy.address, amountToUnStake);

    console.log("prepare unstake");

    const oraiUnstake = new Action (
      "OraiUnstake",
      process.env.ORAI_UNSTAKE_ADDRESS,
      ["address","address","uint256", "uint256", "uint256", "bytes", "address"],
      [oraiStakingContract, tokenAddress, amountToUnStake, timestamp, exchangeRate, signature, onBehalf]
    )


    const calldata = oraiUnstake.encodeForDsProxyCall()[1];

    const unstakeContract = await hre.ethers.getContractAt(
      "OraiUnstake",
      process.env.ORAI_UNSTAKE_ADDRESS
    );

    let tx = await proxy["execute(address,bytes)"](
      unstakeContract.address,
      calldata,
      {
        gasLimit: 20000000,
      }
    );

    tx = await tx.wait();
    console.log("tx", tx);
  });
});
