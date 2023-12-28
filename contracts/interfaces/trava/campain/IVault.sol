// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "../../IBEP20.sol";

interface IVault {
     function stake(address onBehalfOf, uint256 amount) external;

    function redeem(address to, uint256 amount) external;

    function cooldown() external;

    function claimRewards(address to, uint256 amount) external;

    function swapToken(
        uint256 amountIn,
        uint256 amountOutMin,
        address[] memory path,
        address to,
        uint256 deadline,
        address referred
    ) external;

    function withdrawAssets(
        address to,
        uint256 amount
    ) external returns (uint256);

    function repayAssets(
        address campainController,
        uint256 amount
    ) external returns (uint256);

    function STAKE_TOKEN() external returns (IBEP20);

    function setUnstakeWindow(uint256 _unstakeWindow) external;

    function setCoolDownSeconds(uint256 _coolDownSeconds) external;

    function setRewardVault(address _rewardVault) external;

    function setJoinTime(uint256 _joinTime) external;

    function setLockTime(uint256 _lockTime) external;

    function JOIN_TIME() external returns (uint256);

    function LOCK_TIME() external returns (uint256);
}
