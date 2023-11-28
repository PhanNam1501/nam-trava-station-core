// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "../../../ActionBase.sol";
import "../../../../utils/TokenUtils.sol";
import "./helpers/TravaNFTDilutionStakingHelper.sol";

contract TravaNFTDilutionStakingJoinPrivateBattlefield is
    ActionBase,
    TravaNFTDilutionStakingHelper
{
    using TokenUtils for address;

    struct Params {
        address vault;
        uint256 privateBattleId;
        uint256[] tokenIds;
        uint256[] lockAmounts;
        address fromKnight;
        address fromToken;
    }

    /// @inheritdoc ActionBase
    function executeAction(
        bytes memory _callData,
        bytes32[] memory _subData,
        uint8[] memory _paramMapping,
        bytes32[] memory _returnValues
    ) public payable virtual override returns (bytes32) {
        Params memory params = parseInputs(_callData);

        params.vault = _parseParamAddr(
            params.vault,
            _paramMapping[0],
            _subData,
            _returnValues
        );

        params.privateBattleId = _parseParamUint(
            params.privateBattleId,
            _paramMapping[1],
            _subData,
            _returnValues
        );

        uint256 nKnight = params.tokenIds.length;
        for (uint256 i = 0; i < nKnight; i++) {
            params.tokenIds[i] = _parseParamUint(
                params.tokenIds[i],
                _paramMapping[i + 2],
                _subData,
                _returnValues
            );
        }

        uint256 nLock = params.lockAmounts.length;
        for (uint256 i = 0; i < nLock; i++) {
            params.lockAmounts[i] = _parseParamUint(
                params.lockAmounts[i],
                _paramMapping[i + 2 + nKnight],
                _subData,
                _returnValues
            );
        }
        params.fromKnight = _parseParamAddr(
            params.fromKnight,
            _paramMapping[2 + nKnight + nLock],
            _subData,
            _returnValues
        );

        params.fromToken = _parseParamAddr(
            params.fromToken,
            _paramMapping[3 + nKnight + nLock],
            _subData,
            _returnValues
        );

        (uint256 privateBattleId, bytes memory logData) = _joinPrivate(
            params.vault,
            params.privateBattleId,
            params.tokenIds,
            params.lockAmounts,
            params.fromKnight,
            params.fromToken
        );

        emit ActionEvent(
            "TravaNFTDilutionStakingJoinPrivateBattlefield",
            logData
        );
        return bytes32(privateBattleId);
    }

    /// @inheritdoc ActionBase
    function executeActionDirect(
        bytes memory _callData
    ) public payable override {
        Params memory params = parseInputs(_callData);
        (, bytes memory logData) = _joinPrivate(
            params.vault,
            params.privateBattleId,
            params.tokenIds,
            params.lockAmounts,
            params.fromKnight,
            params.fromToken
        );
        logger.logActionDirectEvent(
            "TravaNFTDilutionStakingJoinPrivateBattlefield",
            logData
        );
    }

    /// @inheritdoc ActionBase
    function actionType() public pure virtual override returns (uint8) {
        return uint8(ActionType.STANDARD_ACTION);
    }

    //////////////////////////// ACTION LOGIC ////////////////////////////

    function _joinPrivate(
        address _vault,
        uint256 _privateBattleId,
        uint256[] memory _tokenIds,
        uint256[] memory _lockAmounts,
        address _fromKnight,
        address _fromToken
    ) internal returns (uint256, bytes memory) {
        if (_fromKnight == address(0)) {
            _fromKnight = address(this);
        }

        if (_fromToken == address(0)) {
            _fromToken = address(this);
        }

        uint256 feeIncrease;
        uint256 totalLockAmount;

        for (uint256 id = 0; id < _tokenIds.length; id++) {
            require(
                INFTCollection(NFT_COLLECTION).ownerOf(_tokenIds[id]) ==
                    _fromKnight,
                "Owner NFT Knight does not possess token"
            );

            INFTCollection(NFT_COLLECTION).transferFrom(
                _fromKnight,
                address(this),
                _tokenIds[id]
            );

            require(
                INFTCollection(NFT_COLLECTION).ownerOf(_tokenIds[id]) ==
                    address(this),
                "Owner Smart Wallet does not possess token"
            );

            INFTDilutionStaking.Rarity _knightRarity = INFTDilutionStaking
                .Rarity(
                    INFTCollection(NFT_COLLECTION).viewCollectionRarity(
                        _tokenIds[id]
                    )
                );

            if (_knightRarity == INFTDilutionStaking.Rarity.COPPER) {
                // feeIncrease += privBattleCon.copperFee;
                feeIncrease += 500 * 10 ** 18;
            } else if (_knightRarity == INFTDilutionStaking.Rarity.SILVER) {
                // feeIncrease += privBattleCon.silverFee;
                feeIncrease += 1320 * 10 ** 18;
            } else if (_knightRarity == INFTDilutionStaking.Rarity.GOLD) {
                // feeIncrease += privBattleCon.goldFee;
                feeIncrease += 3600 * 10 ** 18;
            } else if (_knightRarity == INFTDilutionStaking.Rarity.DIAMOND) {
                // feeIncrease += privBattleCon.diamondFee;
                feeIncrease += 8667 * 10 ** 18;
            } else if (_knightRarity == INFTDilutionStaking.Rarity.CRYSTAL) {
                // feeIncrease += privBattleCon.crystalFee;
                feeIncrease += 84000 * 10 ** 18;
            } else {
                revert("NFT knight not valid");
            }
            totalLockAmount += _lockAmounts[id];
        }

        address lock_token_address = address(TRAVA_TOKEN_LOCK);

        // pull tokens to proxy so we can use to pay lock amount
        lock_token_address.pullTokensIfNeeded(_fromToken, totalLockAmount);

        // approve NFT dilution to pull token
        lock_token_address.approveToken(_vault, totalLockAmount);

        bytes memory logData = abi.encode(
            _vault,
            _privateBattleId,
            _tokenIds,
            _lockAmounts,
            _fromKnight,
            _fromToken
        );
        return (_privateBattleId, logData);
    }

    function parseInputs(
        bytes memory _callData
    ) public pure returns (Params memory params) {
        params = abi.decode(_callData, (Params));
    }
}
