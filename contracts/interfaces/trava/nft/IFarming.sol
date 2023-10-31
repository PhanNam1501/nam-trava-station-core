// SPDX-License-Identifier: agpl-3.0
pragma solidity 0.8.4;

interface IFarming {
    struct NFTInfo {
        address nftOwner;
        uint128 value;
        uint128 level;
        uint128 lastPolishTime;
        uint128 depositTime;
    }

    function nftInfos(uint256 tokenId) external returns (NFTInfo memory);

    function stake(uint256[] calldata _ids, uint128 _level) external;

    function redeemAndClaim(uint256[] calldata _ids, uint128 _level) external;

    function claimReward(uint256[] calldata _ids, uint128 _level) external;

    function polishNFT(uint256[] calldata _ids, uint128 _level) external;

    function getTotalRewardsBalance(
        uint256[] calldata _ids
    ) external view returns (uint256);
}
