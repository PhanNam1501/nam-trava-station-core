// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

interface IIncentive {
    function timestamp() external view returns (uint256);
    function update_token() external;
    function  checkpoint_token() external;
    function setEmissionPerSecond(uint256 _emissionPerSecond) external;
    function ve_for_at(uint256 _tokenId, uint256 _timestamp) external view returns (uint256);
    function checkpoint_total_supply() external;
    function claimable(uint256 _tokenId) external view returns (uint256);
    function claim(uint256 _tokenId) external returns (uint256);
    function claim_many(uint256[] memory _tokenIds) external returns (bool);
}