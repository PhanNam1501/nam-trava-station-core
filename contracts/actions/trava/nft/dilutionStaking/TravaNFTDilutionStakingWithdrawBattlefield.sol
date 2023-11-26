// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "../../../ActionBase.sol";
import "../../../../utils/TokenUtils.sol";
import "./helpers/TravaNFTDilutionStakingHelper.sol";

contract TravaNFTDilutionStakingWithdrawBattlefield is
    ActionBase,
    TravaNFTDilutionStakingHelper
{
    using TokenUtils for address;

    struct Params {
        address vault;
        uint256 armyId;
        address toKnight;
        address toToken;
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

        params.armyId = _parseParamUint(
            params.armyId,
            _paramMapping[1],
            _subData,
            _returnValues
        );

        params.toKnight = _parseParamAddr(
            params.toKnight,
            _paramMapping[2],
            _subData,
            _returnValues
        );

        params.toToken = _parseParamAddr(
            params.toToken,
            _paramMapping[3],
            _subData,
            _returnValues
        );

        (uint256 armyId, bytes memory logData) = _withdraw(
            params.vault,
            params.armyId,
            params.toKnight,
            params.toToken
        );

        emit ActionEvent("TravaNFTDilutionStakingWithdrawBattlefield", logData);
        return bytes32(armyId);
    }

    /// @inheritdoc ActionBase
    function executeActionDirect(
        bytes memory _callData
    ) public payable override {
        Params memory params = parseInputs(_callData);
        (, bytes memory logData) = _withdraw(
            params.vault,
            params.armyId,
            params.toKnight,
            params.toToken
        );
        logger.logActionDirectEvent(
            "TravaNFTDilutionStakingWithdrawBattlefield",
            logData
        );
    }

    /// @inheritdoc ActionBase
    function actionType() public pure virtual override returns (uint8) {
        return uint8(ActionType.STANDARD_ACTION);
    }

    //////////////////////////// ACTION LOGIC ////////////////////////////

    function _withdraw(
        address _vault,
        uint256 _armyId,
        address _toKnight,
        address _toToken
    ) internal returns (uint256, bytes memory) {
        if (_toKnight == address(0)) {
            _toKnight = address(this);
        }

        if (_toToken == address(0)) {
            _toToken = address(this);
        }

        INFTDilutionStaking.ArmyInfo memory armyInfo = INFTDilutionStaking(
            _vault
        ).getArmyInfo(_armyId);

        address lock_token_address = address(TRAVA_TOKEN_LOCK);

        // get balance token reward before withdraw
        uint256 balanceBefore = lock_token_address.getBalance(address(this));

        INFTDilutionStaking(_vault).withdrawAndClaimRewardBattlefield(_armyId);

        uint256 balanceAfter = lock_token_address.getBalance(address(this));

        if (_toToken != address(this)) {
            lock_token_address.withdrawTokens(
                _toToken,
                balanceAfter - balanceBefore
            );
        }

        if (_toKnight != address(this)) {
            for (uint256 id = 0; id < armyInfo.stakedKnight.length; id++) {
                INFTCollection(NFT_COLLECTION).transferFrom(
                    address(this),
                    _toKnight,
                    armyInfo.stakedKnight[id]
                );
            }
        }

        bytes memory logData = abi.encode(_vault, _armyId, _toKnight, _toToken);
        return (_armyId, logData);
    }

    function parseInputs(
        bytes memory _callData
    ) public pure returns (Params memory params) {
        params = abi.decode(_callData, (Params));
    }
}
