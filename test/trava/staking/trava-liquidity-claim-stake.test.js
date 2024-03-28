const hre = require("hardhat");
const abiCoder = new hre.ethers.utils.AbiCoder();
require("dotenv").config();
const { ethers } = require("hardhat");


const { Action } = require("../../teststrategy/Action");
const { getProxy, balanceOf } = require("../../utils");
const { keccak256 } = require("web3-utils");
const vaultTravaAbi = require("./VaultTrava.json")
const { MAX_UINT256 } = require("trava-simulation-route")
const AbiCoder = require('web3-eth-abi');


describe("Liquidity-Campaign-claim-stake", function () {
  this.timeout(150000);
  
  it("Liquidity-Campaign-claim-stake", async () => {
    //let triggerCallData = [];
    let actionsCallData = [];
    let subData = [];
    let actionIds = [];

    const vaultTrava = process.env.TRAVA_STAKING_POOL;
    const proxy = await getProxy(process.env.PUBLIC_KEY);
    const onBehalf = proxy.address;
    const from = proxy.address;
    
    let vaultTokenContract = await ethers.getContractAt(
      vaultTravaAbi,
      process.env.TRAVA_STAKING_POOL
    );

    let stakedTokenAddress= await vaultTokenContract.STAKED_TOKEN();

    const stakedTokenContract = await ethers.getContractAt(
      "ERC20Mock",
      stakedTokenAddress
    );

    await stakedTokenContract.approve(
      proxy.address,
      MAX_UINT256
    );
    
    let rewardVault = await vaultTokenContract.REWARDS_VAULT();

    await stakedTokenContract.approve(
      rewardVault,
      MAX_UINT256
    )

    const claimAction = new Action(
        "LiquidityCampaignClaimRewards",
        process.env.LIQUIDITY_CAMPAIGN_CLAIM_REWARDS_ADDRESS,
        ["address", "address", "uint256"],
        [
          vaultTrava,
          onBehalf,
          MAX_UINT256
        ]
      );
    
    const stakeAction = new Action(
      "LiquidityCampaignStake",
      process.env.LIQUIDITY_CAMPAIGN_STAKE_ADDRESS,
      ["address", "address", "uint256","address"],
      [
        vaultTrava,
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
      [131, 132, 133, 134],
    ];

    //subdata for claim 
    const subDatavaultTravaClaim = abiCoder.encode(["address"], [vaultTrava]);
    const subDataOnBehalfClaim = abiCoder.encode(["address"], [onBehalf]);
    const subDataAmountClaim = abiCoder.encode(["uint256"], [MAX_UINT256]);

    //subdata for stake
    const subDatavaultTravaStake = abiCoder.encode(["address"], [vaultTrava]);
    const subDataOnBehalfStake = abiCoder.encode(["address"], [onBehalf]);
    const subDataAmountStake = abiCoder.encode(["uint256"], [MAX_UINT256]);
    const subDataFromStake = abiCoder.encode(["address"], [from]);

    subData = [
      subDatavaultTravaClaim,
      subDataOnBehalfClaim,
      subDataAmountClaim,
      subDatavaultTravaStake,
      subDataOnBehalfStake,
      subDataAmountStake,
      subDataFromStake
    ]

    actionIds = [
      keccak256("LiquidityCampaignClaimRewards").substr(0, 10),
      keccak256("LiquidityCampaignStake").substr(0, 10),
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