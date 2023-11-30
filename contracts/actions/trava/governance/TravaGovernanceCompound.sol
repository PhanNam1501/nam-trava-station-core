// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import "../../../utils/TokenUtils.sol";
import "../../ActionBase.sol";
import "./helpers/TravaGovernanceHelper.sol";

/// @title Increase unlock time to tokenId in trava governance
contract TravaGovernanceCompound is ActionBase, TravaGovernanceHelper {
    using TokenUtils for address;

    struct Params {
        uint tokenId;
    }

    /// @inheritdoc ActionBase
    function executeAction(
        bytes memory _callData,
        bytes32[] memory _subData,
        uint8[] memory _paramMapping,
        bytes32[] memory _returnValues
    ) public payable virtual override returns (bytes32) {
        Params memory params = parseInputs(_callData);

        params.tokenId = _parseParamUint(
            params.tokenId,
            _paramMapping[0],
            _subData,
            _returnValues
        );

        (uint tokenId, bytes memory logData) = _compound(params.tokenId);
        emit ActionEvent("TravaGovernanceCompound", logData);
        return bytes32(tokenId);
    }

    /// @inheritdoc ActionBase
    function executeActionDirect(
        bytes memory _callData
    ) public payable override {
        Params memory params = parseInputs(_callData);
        (, bytes memory logData) = _compound(params.tokenId);
        logger.logActionDirectEvent("TravaGovernanceCompound", logData);
    }

    /// @inheritdoc ActionBase
    function actionType() public pure virtual override returns (uint8) {
        return uint8(ActionType.STANDARD_ACTION);
    }

    //////////////////////////// ACTION LOGIC ////////////////////////////

    function _compound(uint tokenId) internal returns (uint, bytes memory) {
        IIncentive IncentiveVault = IIncentive(INCENTIVE_VAULT);

        IncentiveVault.claim(tokenId);

        bytes memory logData = abi.encode(tokenId);
        return (tokenId, logData);
    }

    function parseInputs(
        bytes memory _callData
    ) public pure returns (Params memory params) {
        params = abi.decode(_callData, (Params));
    }
}
