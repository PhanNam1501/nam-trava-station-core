// SPDX-License-Identifier: Unlicense
pragma solidity 0.8.4;

interface INFTDilutionStaking {
    enum ArmyRank {
        SQUAD,
        PLATOON,
        COMPANY
    }

    enum Rarity {
        UNOPENED,
        COPPER,
        SILVER,
        GOLD,
        DIAMOND,
        CRYSTAL,
        UNIQUE
    }

    struct KnightAmount {
        uint40 copper;
        uint40 silver;
        uint40 gold;
        uint40 diamond;
        uint40 crystal;
        uint40 unique;
    }

    struct ArmyRequirement {
        uint128 minPower;
        uint256 maxLock;
        KnightAmount knightRequirement;
    }

    struct ArmyInfo {
        ArmyRank armyRank;
        uint128 unlockTime;
        uint128 dilution;
        uint256 lockAmount;
        uint256 lockCirculatingSupply;
        uint256 unlockCirculatingSupply;
        uint256[] stakedKnight;
    }

    struct NFTPower {
        uint40 copper;
        uint40 silver;
        uint40 gold;
        uint40 diamond;
        uint40 crystal;
        uint40 unique;
    }

    struct PrivateBattleFieldInfo {
        address owner;
        uint256 tokenId;
        uint256 lockAmount;
        uint256 lockCirculatingSupply;
    }

    struct PrivateBattleFieldState {
        uint256 unlockTime;
        uint256 lastUpdate;
        uint256 index;
        uint256 totalPower;
        uint256 totalFee;
        uint256 unlockCirculatingSupply;
    }

    struct MercenaryInfo {
        address owner;
        uint256 index;
        uint256 lockTime;
        uint256 privateBattleId;
        uint256 lockAmount;
        uint256 lockCirculatingSupply;
    }

    struct PrivateBattleCondition {
        uint256 copperMaxLock;
        uint256 copperFee;
        uint256 silverMaxLock;
        uint256 silverFee;
        uint256 goldMaxLock;
        uint256 goldFee;
        uint256 diamondMaxLock;
        uint256 diamondFee;
        uint256 crystalMaxLock;
        uint256 crystalFee;
    }

    function joinBattlefield(
        uint256[] calldata _tokenIds,
        ArmyRank _stakeType,
        uint256 _lockAmount,
        uint256 _timeLock
    ) external;

    function withdrawAndClaimRewardBattlefield(uint256 _armyId) external;

    function calculateArmyPower(
        KnightAmount memory _knightAmount
    ) external view returns (uint256);

    function checkKnightRequirement(
        KnightAmount memory _knightAmount,
        KnightAmount memory _knightRequirement
    ) external pure returns (bool);

    function getCurrentCirculatingSupply() external view returns (uint256);

    function getBattlefieldReward(
        ArmyInfo memory _armyInfo
    ) external view returns (uint256);

    function deployPrivateBattlefield(
        uint256 _tokenId,
        uint256 _stakedAmount
    ) external;

    function retreatPrivateBattlefield(uint256 _privateBattleFieldId) external;

    function joinPrivateBattlefield(
        uint256 _privateBattleId,
        uint256[] calldata _tokenIds,
        uint256[] calldata _lockAmounts
    ) external;

    function withdrawPrivateBattlefield(
        uint256 _privateBattleId,
        uint256[] calldata _tokenIds
    ) external;

    function updateUnlockCirculatingSupplyPrivate(
        uint256 _privateBattleId
    ) external;

    function getCurrentMercenaryDilution(
        uint256 _tokenId
    ) external view returns (uint256);

    function getUniqueKnightDilutionReward(
        uint256 _privateBattleId
    ) external view returns (uint256);

    function getMercenaryDilutionReward(
        uint256 _tokenId
    ) external view returns (uint256);

    function getArmyInfo(
        uint256 _armyId
    ) external view returns (ArmyInfo memory);

    function getPrivateBattleInfos(
        uint256 _privateBattleFieldId
    ) external view returns (PrivateBattleFieldInfo memory);

    function getPrivateBattleStates(
        uint256 _privateBattleFieldId
    ) external view returns (PrivateBattleFieldState memory);

}
