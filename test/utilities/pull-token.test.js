const { ethers } = require("hardhat");
const { getProxy } = require("../utils");
const { actions, Recipe } = require("trava-station-sdk");

describe("Send Token Action", function () {
  this.timeout(150000);

  it("Should stake tokens using Send Token action", async () => {
    const amount = 1e6;
    const proxy = await getProxy(process.env.PUBLIC_KEY);
    const onBehalf = proxy.address;

    const tokenAddress = process.env.USDT_TRON;
    // const tokenAddress = process.env.TRAVA_ADDRESS

    const ERC20Mock = (await ethers.getContractFactory("TetherToken")).attach(tokenAddress)

    let approveTx = await ERC20Mock.approve(onBehalf, amount)
    await approveTx.wait()
    console.log("approve success", approveTx.transactionHash)
    

    const pullAction = new actions.basic.PullTokenAction(
      tokenAddress,
      process.env.PUBLIC_KEY,
      amount
    )
    const recipe = new Recipe(
        "hill",
        97,
        [
          pullAction
        ]
    )

    const data = recipe.encodeForDsProxyCall()
    console.log(data)
    let tx = await proxy["execute(address,bytes)"](
      data[0],
      data[1],
      {
        gasLimit: 2e7,
      }
    );

    tx = await tx.wait();
    console.log("tx", tx);
  });
});
