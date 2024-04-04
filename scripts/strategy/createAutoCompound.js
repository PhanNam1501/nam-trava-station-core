const { getProxy } = require("../utils/utils");
require("dotenv").config();
const {
    Strategy,
    actions,
    triggers,
    services,
    StrategySub,
  } = require("test-trava-station-sdk");
  
async function main() {
 // const public_key = process.env.PUBLIC_KEY;

 const proxy = await getProxy(process.env.PUBLIC_KEY);
 const proxy_address = proxy.address;
 const trava_staking_stake = process.env.TRAVA_STAKING_STAKE_ADDRESS;
 const trava_staking_claim = process.env.TRAVA_STAKING_CLAIM_ADDRESS;


 const claim_reward = new actions.trava.TravaStakingClaimRewards(
     "%stakingPool",
     "%to",
     "%amount",
     "%contractAddress"
 )

 const stake = new actions.trava.TravaStakingStake(
     "%stakingPool",
     "%onBehalfOf",
     "%amount",
     "%from",
     "%contractAddress"
 )

 const take_gas_fee = new actions.fee.GasFeeTaker(
     '%gasUsed',
     '%feeToken',
     '%availableAmount',
     '%dfsFeeDivider',
     '%path',
     '%path',
     '%feeTakerStation'
 );

 const trigger = new triggers.TimeTrigger(
   "%startTime",
   "%endTime",
   "%contractAddress"
 );
 const autoCompound = new Strategy("AutoCompoundStrategy");

 autoCompound.addAction(claim_reward);
 autoCompound.addAction(stake);
 autoCompound.addAction(take_gas_fee);
 autoCompound.addTrigger(trigger);

 const encoded = autoCompound.encodeForDsProxyCall();
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
