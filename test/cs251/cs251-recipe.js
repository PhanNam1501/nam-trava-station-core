const { ethers } = require("hardhat");
const { getProxy } = require("../utils");
const { actions , Recipe} = require("tuannam1-trava-station-sdk");
require("dotenv").config();

describe("Send Token Action", function () {
  this.timeout(150000);

  it("Should stake tokens using Send Token action", async () => {
    const proxy = await getProxy(process.env.PUBLIC_KEY);
      const exchange = process.env.TOKEN_EXCHANGE;
      const tokenAddr = process.env.TOKEN;
      const maxSlippage = hre.ethers.utils.parseEther("0.11");
      const from = process.env.PUBLIC_KEY;
      const to = process.env.PUBLIC_KEY;
      const amountETH_add = hre.ethers.BigNumber.from("100");
      const amountETH_remove = hre.ethers.BigNumber.from("10");
      const amount_swap = hre.ethers.BigNumber.from("10");
      const checkETH = true;

    const IERC20 = await hre.ethers.getContractAt("IERC20Test", tokenAddr);
    const tx1 = await IERC20.approve(proxy.address, 10**11);
    await tx1.wait();
    

    const addLiquidityAction = new actions.cs251.addLiquidity(
        exchange, 
        tokenAddr, 
        maxSlippage, 
        from, 
        amountETH_add,
        process.env.ADDLIQUIDITY
    )

    const removeLiquidityAction = new actions.cs251.removeLiquidity(
        exchange, tokenAddr, to, amountETH_remove,
        process.env.REMOVELIQUIDITY
    )
    console.log("remove:", removeLiquidityAction.address);

    const swapAction = new actions.cs251.swapLiquidity(
        exchange, tokenAddr, from, maxSlippage, amount_swap, checkETH,
        process.env.SWAPLIQUIDITY
    )

    

    const recipe = new Recipe(
        "hill",
        97,
        [
            //addLiquidityAction,
            removeLiquidityAction
        ]
    )

    const data = recipe.encodeForDsProxyCall()
    console.log(data)
    let tx = await proxy["execute(address,bytes)"](
      data[0],
      data[1],
      {
        gasLimit: 2e7,
        value:amountETH_add
      }
    );

    tx = await tx.wait();
    console.log("tx", tx);
  });
});