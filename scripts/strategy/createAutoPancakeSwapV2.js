const { getProxy } = require("../utils/utils");
require("dotenv").config();
const {
    Strategy,
    actions,
    triggers,
    services,
    StrategySub,
  } = require("trava-station-sdk");
  
async function main() {
 // const public_key = process.env.PUBLIC_KEY;

 const proxy = await getProxy(process.env.PUBLIC_KEY);
 const proxy_address = proxy.address;
//  const pancake_swap_v2 = process.env.PANCAKE_SWAP_V2_ADDRESS;

 const swap = new actions.pancake.PancakeSwapV2(
      "%amountIn",
      "%amountOutMin",
      ["%path",
      "%path"],
      "%to",
      "%deadline",
      "%from",
      "%contractAddress"
  );

 const take_gas_fee = new actions.fee.GasFeeTaker(
     '%gasUsed',
     '%feeToken',
     '%availableAmount',
     '%dfsFeeDivider',
     ['%path',
     '%path'],
     '%feeTakerStation'
 );

 const trigger = new triggers.OnchainPriceTrigger(
    "%pair",
    "%tokenIn",
    "%triggerPrice",
    "%state",
    "%contractAddress"
)

 const autoPancakeSwapV2 = new Strategy("AutoPancakeSwapV2Strategy");

 autoPancakeSwapV2.addAction(swap);
 autoPancakeSwapV2.addAction(take_gas_fee);
 autoPancakeSwapV2.addTrigger(trigger);

 const encoded = autoPancakeSwapV2.encodeForDsProxyCall();
 let [strategyName, triggerIds, actionIds, paramMapping] = encoded;

 console.log(encoded);

 // ----------- Create strategy -----------------

 const strategy_storage_address = process.env.STRATEGY_STORAGE_ADDRESS;

 const strategyStorage = await ethers.getContractAt("StrategyStorage", strategy_storage_address);
 const receipt = await strategyStorage.createStrategy(
     strategyName, triggerIds, actionIds, paramMapping, true
 );

 await receipt.wait();
 console.log("create strategy successed", receipt)
 let strategyId = await strategyStorage.getStrategyCount();

 strategyId = (strategyId-1).toString();
 console.log("Startegy id " , strategyId.toString());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
