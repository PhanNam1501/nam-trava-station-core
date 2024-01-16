const hre = require("hardhat");
const abiCoder = new hre.ethers.utils.AbiCoder();
require("dotenv").config();

const { Action } = require("../teststrategy/Action");
const { expect } = require("chai");
const { getProxy } = require("../utils");
const {Recipe, actions} = require("trava-station-sdk");
const { MAX_UINT256 } = require("trava-simulation-route");

describe("Radiant-Supply", function () {
  this.timeout(150000);

  it("Test radiant supply", async () => {
    const market = "0xd50cf00b6e600dd036ba8ef475677d816d6c4281";
    const amount = 1e15.toFixed();
    const from = process.env.PUBLIC_KEY;
    const proxy = await getProxy(process.env.PUBLIC_KEY);
    const smartWalletAddress = proxy.address;
    const onBehalf = proxy.address;
    const tokenAddress = process.env.WBNB_BSCTESTNET;
    const rateMode = 2;
    

    console.log("prepare supply");

    let wrapAction = new actions.basic.WrapBnbAction(amount, process.env.WRAP_BNB_ADDRESS)
    let radiantSupply  = new actions.radiant.RadiantSupply(market, tokenAddress, MAX_UINT256, smartWalletAddress, smartWalletAddress, false,  process.env.RADIANT_SUPPLY_ADDRESS)

    let recipe = new Recipe("ok", 56, [wrapAction, radiantSupply]);
    let encodeData = recipe.encodeForDsProxyCall()
    let tx = await proxy["execute(address,bytes)"](
      encodeData[0],
      encodeData[1],
      {
        gasPrice: 3e9,
        gasLimit: 1e6,
      }
    );

    tx = await tx.wait();
    console.log("tx", tx);
   
  });
});
