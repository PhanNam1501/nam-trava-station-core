// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "../../../ActionBase.sol";
import "./helpers/TravaNFTHeuristicFarmingHelper.sol";

contract TravaNFTHeuristicFarmingClaimReward is
    ActionBase,
    TravaNFTHeuristicFarmingHelper
{
    struct Params {
        address vault;
        uint256[] ids;
        uint128 level;
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

        (uint256 level, bytes memory logData) = _claimReward(
            params.vault,
            params.ids,
            params.level
        );

        emit ActionEvent("TravaNFTHeuristicFarmingClaimReward", logData);
        return bytes32(level);
    }

    /// @inheritdoc ActionBase
    function executeActionDirect(
        bytes memory _callData
    ) public payable override {
        Params memory params = parseInputs(_callData);
        (, bytes memory logData) = _claimReward(
            params.vault,
            params.ids,
            params.level
        );
        logger.logActionDirectEvent("TravaNFTHeuristicFarmingClaimReward", logData);
    }

    /// @inheritdoc ActionBase
    function actionType() public pure virtual override returns (uint8) {
        return uint8(ActionType.STANDARD_ACTION);
    }

    //////////////////////////// ACTION LOGIC ////////////////////////////

    function _claimReward(
        address _vault,
        uint256[] memory _ids,
        uint128 _level
    ) internal returns (uint256, bytes memory) {

        
        IFarming(_vault).claimReward(_ids, _level);

        bytes memory logData = abi.encode(_vault, _ids, _level);

        return (_level, logData);
    }

    function parseInputs(
        bytes memory _callData
    ) public pure returns (Params memory params) {
        params = abi.decode(_callData, (Params));
    }
}
