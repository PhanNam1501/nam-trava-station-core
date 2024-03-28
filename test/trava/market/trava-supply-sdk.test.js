const { actions } = require("trava-station-sdk")
const { getProxy } = require("../../utils");

describe("Trava-supply action", function(){
    this.timeout(150000);
    it("should supply token using Trava supply action", async () => {
        const market = "0x6df52f798740504c24ccd374cf7ce81b28ce8330";
        const token = "0xE1F005623934D3D8C724EC68Cc9bFD95498D4435";//trava
        const amount = 1e1;
        const from = process.env.PUBLIC_KEY;
        const proxy = await getProxy(process.env.PUBLIC_KEY);
        const onBehalf = proxy.address;
        const enableAsColl = false;
        const contractAddress = process.env.TRAVA_SUPPLY_ADDRESS

        const IERC20 = await hre.ethers.getContractAt("IERC20Test", token);
        await IERC20.approve(proxy.address, amount);

        console.log("prepare supply");
        
        const traveSupply = new actions.trava.TravaSupply(
            market,
            token,
            amount,
            from,
            onBehalf,
            enableAsColl,
            contractAddress
        )

        const callData = traveSupply.encodeForDsProxyCall()[1];

        const supplyContract = await hre.ethers.getContractAt(
            "TravaSupply",
            process.env.TRAVA_SUPPLY_ADDRESS
          );

          let tx = await proxy["execute(address,bytes)"](
            supplyContract.address,
            callData,
            {
              gasLimit: 20000000,
            }
          );
      
          tx = await tx.wait();
          console.log("tx", tx);
    })
})