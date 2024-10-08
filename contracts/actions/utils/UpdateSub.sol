// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import "../ActionBase.sol";
import "../../utils/TokenUtils.sol";
import "../../core/strategy/SubStorage.sol";
import "../../core/strategy/StrategyModel.sol";

/// @title Updates users sub information on SubStorage contract
/// @dev user can only change his own subscriptions
contract UpdateSub is ActionBase {
    struct Params {
        uint256 subId;
        StrategyModel.StrategySub sub;
    }

    /// @inheritdoc ActionBase
    function executeAction(
        bytes memory _callData,
        bytes32[] memory _subData,
        uint8[] memory _paramMapping,
        bytes32[] memory _returnValues
    ) public payable virtual override returns (bytes32) {
        Params memory inputData = parseInputs(_callData);

        inputData.subId = _parseParamUint(
            inputData.subId,
            _paramMapping[0],
            _subData,
            _returnValues
        );

        for (uint256 i = 0; i < inputData.sub.subData.length; i++) {
            inputData.sub.subData[i] = _parseParamABytes32(
                inputData.sub.subData[i],
                _paramMapping[1 + i],
                _subData,
                _returnValues
            );
        }

        updateSubData(inputData);

        return (bytes32(inputData.subId));
    }

    function executeActionDirect(
        bytes memory _callData
    ) public payable override {
        Params memory inputData = parseInputs(_callData);

        updateSubData(inputData);
    }

    /// @inheritdoc ActionBase
    function actionType() public pure virtual override returns (uint8) {
        return uint8(ActionType.STANDARD_ACTION);
    }

    //////////////////////////// ACTION LOGIC ////////////////////////////

    function updateSubData(Params memory _inputData) internal {
        SubStorage(SUB_STORAGE_ADDR).updateSubData(
            _inputData.subId,
            _inputData.sub
        );
    }

    function parseInputs(
        bytes memory _callData
    ) public pure returns (Params memory params) {
        params = abi.decode(_callData, (Params));
    }
}
