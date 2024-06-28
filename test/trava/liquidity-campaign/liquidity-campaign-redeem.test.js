const { actions, Recipe } = require("trava-station-sdk")
const { getProxy } = require("../../utils");

describe("Liquidty Campaign-redeem action", function(){
    this.timeout(150000);
    it("should redeem token using Liquidty Campaign redeem action", async () => {
        const stakingPool = "0x8E8Fa20eF2e6Cb3b0555D90CeBd7e49a80Fec8BA"
        const from = process.env.PUBLIC_KEY;
        const proxy = await getProxy(process.env.PUBLIC_KEY);
        const amount = "500000000000000000000"
        const redeemActionAddr = process.env.LIQUIDITY_CAMPAIGN_REDEEM_ADDRESS
        const liquidityCampaignRedeem = new actions.trava.LiquidityCampaignRedeem(
            stakingPool,
            from,
            amount,
            redeemActionAddr
        )

        const recipe = new Recipe(
          "testRedeem",
          56,
          [liquidityCampaignRedeem]
        )

        const callData = recipe.encodeForDsProxyCall()

        let tx = await proxy["execute(address,bytes)"](
            callData[0],
            callData[1],
            {
              gasLimit: 2e7,
            }
          );
          tx = await tx.wait();
          console.log("tx", tx.transactionHash);
    })
})