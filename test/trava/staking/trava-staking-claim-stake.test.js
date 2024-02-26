const hre = require("hardhat");
const abiCoder = new hre.ethers.utils.AbiCoder();
require("dotenv").config();
const { ethers } = require("hardhat");

const { Action } = require("../../teststrategy/Action");
const { getProxy, balanceOf } = require("../../utils");
const { keccak256 } = require("web3-utils");
const VaultTravaAbi = require("./VaultTrava.json")
const { MAX_UINT256 } = require("trava-simulation-route")


describe("Trava-staking-claim-stake", function () {
  this.timeout(150000);
  
  it("Test Trava-staking-claimReward-stake", async () => {
    let triggerCallData = [];
    let actionsCallData = [];
    let subData = [];
    let actionIds = [];

    const stakingPool = process.env.TRAVA_STAKING_POOL;
    const proxy = await getProxy(process.env.PUBLIC_KEY);
    const onBehalf = proxy.address;
    const from = process.env.PUBLIC_KEY;
    const trava = "0xE1F005623934D3D8C724EC68Cc9bFD95498D4435"
    
    let vaultTokenContract = await ethers.getContractAt(
      VaultTravaAbi,
      process.env.TRAVA_STAKING_POOL
    );

    let stakedTokenAddress= await vaultTokenContract.STAKED_TOKEN();

    const stakeTokenContract = await ethers.getContractAt(
      "ERC20Mock",
      stakedTokenAddress
    );

    await stakeTokenContract.approve(
      proxy.address,
      MAX_UINT256
    );
    
    let rewardVault = await vaultTokenContract.REWARDS_VAULT();

    await stakeTokenContract.approve(
      rewardVault,
      MAX_UINT256
    )

    if(balanceOf(stakedTokenAddress, onBehalf) > 0){
      stakedTokenAddress.safeTransferFrom(onBehalf, process.env.PUBLIC_KEY, MAX_UINT256);
    }

    const claimAction = new Action(
        "TravaStakingClaimRewards",
        process.env.TRAVA_STAKING_CLAIM_REWARDS_ADDRESS,
        ["address", "address", "uint256"],
        [
          stakingPool,
          onBehalf,
          MAX_UINT256
        ]
      );
    
    const stakeAction = new Action(
      "TravaStakingStake",
      process.env.TRAVA_STAKING_STAKE_ADDRESS,
      ["address", "address", "uint256","address"],
      [
        stakingPool,
        onBehalf,
        MAX_UINT256,
        from,
      ]
    );

    const callDataClaim = claimAction.encodeForRecipe()[0];
    const calldataStake = stakeAction.encodeForRecipe()[0];

    actionsCallData.push(callDataClaim);
    actionsCallData.push(calldataStake);

    let paramMapping = [
      // 3 elements in array
      [128, 129, 130],
      // 4 elements in array
      [133, 134, 135, 136],
    ];

    //subdata for claim 
    const subDataStakingPoolClaim = abiCoder.encode(["address"], [stakingPool]);
    const subDataOnBehalfClaim = abiCoder.encode(["address"], [onBehalf]);
    const subDataAmountClaim = abiCoder.encode(["uint256"], [MAX_UINT256]);

    //subdata for stake
    const subDataStakingPoolStake = abiCoder.encode(["address"], [stakingPool]);
    const subDataOnBehalfStake = abiCoder.encode(["address"], [onBehalf]);
    const subDataAmountStake = abiCoder.encode(["uint256"], [MAX_UINT256]);
    const subDataFromStake = abiCoder.encode(["address"], [from]);

    subData = [
      subDataStakingPoolClaim,
      subDataOnBehalfClaim,
      subDataAmountClaim,
      subDataStakingPoolStake,
      subDataOnBehalfStake,
      subDataAmountStake,
      subDataFromStake
    ]

    actionIds = [
      keccak256("TravaStakingClaimRewards").substr(0, 10),
      keccak256("TravaStakingStake").substr(0, 10),
    ];

    console.log("actionsCallData", actionsCallData);
    console.log("subData", subData);
    console.log("actionIds", actionIds);
    console.log("paramMapping", paramMapping);

    const RecipeExecutorContract = await hre.ethers.getContractAt(
      "RecipeExecutor",
      process.env.RECIPE_EXECUTOR_ADDRESS
    );

    const calldata = RecipeExecutorContract.interface.encodeFunctionData(
      "executeRecipe",
      [
        {
          name: "TravaRecipe",
          callData: actionsCallData,
          subData: subData,
          actionIds: actionIds,
          paramMapping: paramMapping,
        },
      ]
    );

    let tx = await proxy["execute(address,bytes)"](
      RecipeExecutorContract.address,
      calldata,
      {
        gasLimit: 20000000,
      }
    );

    tx = await tx.wait();
    console.log("tx", tx);
  })
})