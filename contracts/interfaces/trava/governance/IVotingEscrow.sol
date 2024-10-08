// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

library DataTypes {
    struct Point {
        int128 bias;
        int128 slope; // # -dweight / dt
        uint ts;
        uint blk; // block
    }

    struct LockedBalance {
        int128 rewardAmount;
        int128 amount;
        uint end;
        address token;
        int128 baseAmount;
    }
}

interface IVotingEscrow {
    function approve(address _approved, uint _tokenId) external;
    
    function attach(uint _tokenId) external;

    function detach(uint _tokenId) external;

    function merge(uint _from, uint _to) external;

    function getOwner() external view returns (address);

    function get_last_user_slope(uint _tokenId) external view returns (int128);

    function user_point_history__ts(
        uint _tokenId,
        uint _idx
    ) external view returns (uint);

    function locked__end(uint _tokenId) external view returns (uint);

    function checkpoint() external;

    function deposit_for(uint _tokenId, uint _value) external;

    function deposit_for_reward_distribution(
        uint _tokenId,
        uint _rewardValue
    ) external;

    function create_lock_for(
        address _token,
        uint _value,
        uint _lock_duration,
        address _to
    ) external returns (uint);

    function create_lock(
        address _token,
        uint _value,
        uint _lock_duration
    ) external returns (uint);

    function increase_amount(uint _tokenId, uint _value) external;

    function increase_unlock_time(uint _tokenId, uint _lock_duration) external;

    function withdraw(uint _tokenId) external;

    function balanceOfNFT(uint _tokenId) external view returns (uint);

    function balanceOfNFTAt(
        uint _tokenId,
        uint _t
    ) external view returns (uint);

    function totalSupplyAtT(uint t) external view returns (uint);

    function votingPowerOfUserAt(
        address _user,
        uint _t
    ) external view returns (uint);

    function votingPowerOfUser(address _user) external view returns (uint);

    function getveNFTOfUser(
        address _user
    ) external view returns (uint[] memory);

    function locked(
        uint tokenId
    ) external view returns (DataTypes.LockedBalance memory);

    function rewardToken() external view returns (address);

    function transferFrom(address _from, address _to, uint _tokenId) external;

    function ownerOf(uint _tokenId) external view returns (address);

}
