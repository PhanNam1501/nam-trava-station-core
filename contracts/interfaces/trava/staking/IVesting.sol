// SPDX-License-Identifier: agpl-3.0
pragma solidity ^0.8.0;

interface IVesting {
    function STAKED_TOKEN() external view returns (address);

    function REWARD_TOKEN() external view returns (address);

    function claimRewards(address underlyingToken, address accountAddress) external;
}
