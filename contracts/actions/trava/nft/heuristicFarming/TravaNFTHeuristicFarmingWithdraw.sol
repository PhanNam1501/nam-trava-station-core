// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "../../../ActionBase.sol";
import "./helpers/TravaNFTHeuristicFarmingHelper.sol";

contract TravaNFTHeuristicFarmingWithdraw is
    ActionBase,
    TravaNFTHeuristicFarmingHelper
{
    struct Params {
        address vault;
        uint256[] ids;
        uint128 level;
        address to;
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

        uint256 nKnight = params.ids.length;
        for (uint256 i = 0; i < nKnight; i++) {
            params.ids[i] = _parseParamUint(
                params.ids[i],
                _paramMapping[i + 1],
                _subData,
                _returnValues
            );
        }

        params.level = uint128(
            _parseParamUint(
                params.level,
                _paramMapping[1 + nKnight],
                _subData,
                _returnValues
            )
        );

        params.to = _parseParamAddr(
            params.to,
            _paramMapping[2 + nKnight],
            _subData,
            _returnValues
        );

        (uint256 level, bytes memory logData) = _redeemAndClaim(
            params.vault,
            params.ids,
            params.level,
            params.to
        );

        emit ActionEvent("TravaNFTHeuristicFarmingWithdraw", logData);
        return bytes32(level);
    }

    /// @inheritdoc ActionBase
    function executeActionDirect(
        bytes memory _callData
    ) public payable override {
        Params memory params = parseInputs(_callData);
        (, bytes memory logData) = _redeemAndClaim(
            params.vault,
            params.ids,
            params.level,
            params.to
        );
        logger.logActionDirectEvent(
            "TravaNFTHeuristicFarmingWithdraw",
            logData
        );
    }

    /// @inheritdoc ActionBase
    function actionType() public pure virtual override returns (uint8) {
        return uint8(ActionType.STANDARD_ACTION);
    }

    //////////////////////////// ACTION LOGIC ////////////////////////////

    function _redeemAndClaim(
        address _vault,
        uint256[] memory _ids,
        uint128 _level,
        address _to
    ) internal returns (uint256, bytes memory) {
        if (_to == address(0)) {
            _to = address(this);
        }

        IFarming(_vault).redeemAndClaim(_ids, _level);

        if (_to != address(this)) {
            INFTCollection(NFT_COLLECTION).batchTransferFrom(
                address(this),
                _to,
                _ids
            );
        }

        bytes memory logData = abi.encode(_vault, _ids, _level, _to);
        return (_level, logData);
    }

    function parseInputs(
        bytes memory _callData
    ) public pure returns (Params memory params) {
        params = abi.decode(_callData, (Params));
    }
}
