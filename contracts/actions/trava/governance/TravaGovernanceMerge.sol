// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import "../../../utils/TokenUtils.sol";
import "../../ActionBase.sol";
import "./helpers/TravaGovernanceHelper.sol";

/// @title merge to 2 tokenid in trava governance

contract TravaGovernanceMerge is ActionBase, TravaGovernanceHelper {
    using TokenUtils for address;

    struct Params {
        uint from;
        uint to;
    }

    /// @inheritdoc ActionBase
    function executeAction(
        bytes memory _callData,
        bytes32[] memory _subData,
        uint8[] memory _paramMapping,
        bytes32[] memory _returnValues
    ) public payable virtual override returns (bytes32) {
        Params memory params = parseInputs(_callData);

        params.from = _parseParamUint(
            params.from,
            _paramMapping[0],
            _subData,
            _returnValues
        );

        params.to = _parseParamUint(
            params.to,
            _paramMapping[1],
            _subData,
            _returnValues
        );

        (uint to, bytes memory logData) = _merge(
           params.from,
           params.to
        );
        emit ActionEvent("TravaGovernanceMerge", logData);
        return bytes32(to);
    }

    /// @inheritdoc ActionBase
    function executeActionDirect(
        bytes memory _callData
    ) public payable override {
        Params memory params = parseInputs(_callData);
        (, bytes memory logData) = _merge(
            params.from,
            params.to
        );
        logger.logActionDirectEvent("TravaGovernanceMerge", logData);
    }

    /// @inheritdoc ActionBase
    function actionType() public pure virtual override returns (uint8) {
        return uint8(ActionType.STANDARD_ACTION);
    }

    //////////////////////////// ACTION LOGIC ////////////////////////////

    function _merge(
        uint from, 
        uint to
    ) internal returns (uint, bytes memory) {
        IVotingEscrow VotingEscrow = IVotingEscrow(VE_TRAVA);

        VotingEscrow.merge(from,to);

        bytes memory logData = abi.encode(from,to);

        return (to, logData);
    }

    function parseInputs(
        bytes memory _callData
    ) public pure returns (Params memory params) {
        params = abi.decode(_callData, (Params));
    }
}
