const { expect } = require("chai");
const { getProxy } = require("../../utils");
const { ethers } = require("ethers");
const { Action } = require("../../teststrategy/Action");
const { actions } = require("phuong-trava-station-sdk");

describe("Orai-Stake Action", function () {
  this.timeout(150000);

  it("Should stake tokens using OraiStake action", async () => {
    const oraiStakingContract = process.env.ORAI_STAKING_CONTRACT;
    const amountToStake = 1e1;
    const proxy = await getProxy(process.env.PUBLIC_KEY);
    const onBehalf = proxy.address;

    const tokenAddress = process.env.ORAI_ADDRESS;
    const from = process.env.PUBLIC_KEY;

    const timestamp = Date.now();
    console.log(timestamp);

    const exchangeRate = "1280004144816636700";
    const privateKey = process.env.PRIVATE_KEY;
    const wallet = new ethers.Wallet(privateKey);
    const message = ethers.utils.keccak256(
      ethers.utils.defaultAbiCoder.encode(
        ["uint", "uint"],
        [timestamp, exchangeRate]
      )
    );
    const signature = await wallet.signMessage(ethers.utils.arrayify(message));
    console.log(signature);
    // const nonce=await hre.ethers.provider.getTransactionCount("0xb94cf4a70d7edAd3D16B5dB1372E9578b150AbCA");
    // console.log(nonce);

    const IERC20 = await hre.ethers.getContractAt("IERC20Test", tokenAddress);
    await IERC20.approve(proxy.address, amountToStake);
    console.log("prepare stake");

    const oraiStake = new actions.trava.OraiStake(
      oraiStakingContract,
      tokenAddress,
      amountToStake,
      timestamp,
      exchangeRate,
      signature,
      from,
      onBehalf,
      process.env.ORAI_STAKE_ADDRESS
    );

    const calldata = oraiStake.encodeForDsProxyCall()[1];

    const stakeContract = await hre.ethers.getContractAt(
      "OraiStake",
      process.env.ORAI_STAKE_ADDRESS
    );

    let tx = await proxy["execute(address,bytes)"](
      stakeContract.address,
      calldata,
      {
        gasLimit: 2000000,
      }
    );

    tx = await tx.wait();
    console.log("tx", tx);
  });
});
