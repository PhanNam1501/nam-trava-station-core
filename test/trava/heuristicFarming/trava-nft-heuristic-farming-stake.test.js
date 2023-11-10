// Tạo 2 token -> tạo 1 pool vói 2 token -> Test action 1 là addLiquidity cả 2 token đó -> Test action 2 là increaseLiquidity 1 đồng -> Test action 3 là swap -> Test action 4 là collect lãi do 1 thằng khác đã swap ở bước trước > Test aciton 5 là removeLiquidity

const { ethers } = require("hardhat");
const {
  // getProxy,
  addLiquidity,
  increaseLiquidity,
  createPool,
  collectLiquidity,
  removeLiquidity,
  swapExactTokenForToken,
  swapExactInputSingle,
  combinatorPancakeswap,
} = require("../../testrecipepancakeswap/utils");
const { Action } = require("../../teststrategy/Action");
const { getProxy } = require("../../utils");
const { keccak256 } = require("web3-utils");
const abiCoder = new hre.ethers.utils.AbiCoder();
// Account Owner support 2 token
// Account A swap

async function main() {
  let ownerAcc;
  let accA;
  let proxy;
  let tokenA;
  let proxyA;
  let trava;

  // get bignumber 2**96
  ownerAcc = (await hre.ethers.getSigners())[0];

  console.log(
    `Owner address:: ${
      ownerAcc.address
    } with balance ${hre.ethers.utils.formatEther(
      await ethers.provider.getBalance(ownerAcc.address)
    )} TBNB`
  );

  proxy = await getProxy(ownerAcc.address);
  console.log(
    `Proxy address:: ${
      proxy.address
    } with balance ${hre.ethers.utils.formatEther(
      await ethers.provider.getBalance(proxy.address)
    )} TBNB`
  );

  // const stakedTokenContract = await ethers.getContractAt(
  //   "IStakedToken",
  //   process.env.TRAVA_STAKING_POOL
  // );
  // const stakedTokenAddress = await stakedTokenContract.STAKED_TOKEN();
  // console.log("staked token address :", stakedTokenAddress);

  // const rewardTokenAddress = await stakedTokenContract.REWARD_TOKEN();
  // console.log("reward token address :", stakedTokenAddress);

  // const stakeTokenContract = await ethers.getContractAt(
  //   "ERC20Mock",
  //   stakedTokenAddress
  // );

  // // console.log("owner", ownerAcc.address);

  // await stakeTokenContract.approve(
  //   proxy.address,
  //   ethers.utils.parseEther("10")
  // );

  const stakingAction = new Action(
    "TravaHeurisitcFarmingStake",
    process.env.TRAVA_NFT_HEURISTIC_FARMING_STAKE_ADDRESS,
    ["address", "uint256[]", "uint128", "address"],
    [
      "0xb0c3137d7C7d8cf994b9931359A97605dF277815",
      [109],
      1,
      ownerAcc.address
    ]
  );

  const calldataStaking = stakingAction.encodeForDsProxyCall()[1];
  console.log(calldataStaking);

  const stakeTokenContract = await ethers.getContractAt(
    "ERC20Mock",
    stakedTokenAddress
  );
//   const tx = await proxy.execute(
//     process.env.TRAVA_NFT_HEURISTIC_FARMING_STAKE_ADDRESS,
//     calldataStaking,
//     {
//       gasLimit: 2e7,
//     }
//   );
//   console.log("tx::", tx);
}
main();
