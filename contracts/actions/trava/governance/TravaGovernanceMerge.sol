// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import "../../../utils/TokenUtils.sol";
import "../../ActionBase.sol";
import "./helpers/TravaGovernanceHelper.sol";

/// @title merge to 2 tokenid in trava governance

contract TravaGovernanceMerge is ActionBase, TravaGovernanceHelper {
    using TokenUtils for address;

    struct Params {
        uint tokenId1;
        uint tokenId2;
        address from;
    }

    /// @inheritdoc ActionBase
    function executeAction(
        bytes memory _callData,
        bytes32[] memory _subData,
        uint8[] memory _paramMapping,
        bytes32[] memory _returnValues
    ) public payable virtual override returns (bytes32) {
        Params memory params = parseInputs(_callData);

        params.tokenId1 = _parseParamUint(
            params.tokenId1,
            _paramMapping[0],
            _subData,
            _returnValues
        );

        params.tokenId2 = _parseParamUint(
            params.tokenId2,
            _paramMapping[1],
            _subData,
            _returnValues
        );

        params.from = _parseParamAddr(
            params.from,
            _paramMapping[2],
            _subData,
            _returnValues
        );

        (uint tokenId2, bytes memory logData) = _merge(
            params.tokenId1,
            params.tokenId2,
            params.from
        );
        emit ActionEvent("TravaGovernanceMerge", logData);
        return bytes32(tokenId2);
    }

    /// @inheritdoc ActionBase
    function executeActionDirect(
        bytes memory _callData
    ) public payable override {
        Params memory params = parseInputs(_callData);
        (, bytes memory logData) = _merge(
            params.tokenId1,
            params.tokenId2,
            params.from
        );
        logger.logActionDirectEvent("TravaGovernanceMerge", logData);
    }

    /// @inheritdoc ActionBase
    function actionType() public pure virtual override returns (uint8) {
        return uint8(ActionType.STANDARD_ACTION);
    }

    //////////////////////////// ACTION LOGIC ////////////////////////////

    function _merge(
        uint tokenId1,
        uint tokenId2,
        address from
    ) internal returns (uint, bytes memory) {
        IVotingEscrow VotingEscrow = IVotingEscrow(VE_TRAVA);

        if (from == address(0)) {
            from == address(this);
        }

        if (from != address(this)) {
            VotingEscrow.transferFrom(from, address(this), tokenId1);
            VotingEscrow.transferFrom(from, address(this), tokenId2);
        }

        VotingEscrow.merge(tokenId1, tokenId2);

        bytes memory logData = abi.encode(tokenId1, tokenId2);

        return (tokenId2, logData);
    }

    function parseInputs(
        bytes memory _callData
    ) public pure returns (Params memory params) {
        params = abi.decode(_callData, (Params));
    }
}
