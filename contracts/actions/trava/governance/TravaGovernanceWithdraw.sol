// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import "../../../utils/TokenUtils.sol";
import "../../ActionBase.sol";
import "./helpers/TravaGovernanceHelper.sol";

/// @title Supply a token to an Trava market
contract TravaGovernanceWithdraw is ActionBase, TravaGovernanceHelper {
    using TokenUtils for address;

    struct Params {
        uint tokenId;
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

        params.tokenId = _parseParamUint(
            params.tokenId,
            _paramMapping[0],
            _subData,
            _returnValues
        );

        params.to = _parseParamAddr(
            params.to,
            _paramMapping[1],
            _subData,
            _returnValues
        );

        (uint tokenId, bytes memory logData) = _withdraw(
            params.tokenId,
            params.to
        );
        emit ActionEvent("TravaGovernanceWithdraw", logData);
        return bytes32(tokenId);
    }

    /// @inheritdoc ActionBase
    function executeActionDirect(
        bytes memory _callData
    ) public payable override {
        Params memory params = parseInputs(_callData);
        (, bytes memory logData) = _withdraw(params.tokenId, params.to);
        logger.logActionDirectEvent("TravaGovernanceWithdraw", logData);
    }

    /// @inheritdoc ActionBase
    function actionType() public pure virtual override returns (uint8) {
        return uint8(ActionType.STANDARD_ACTION);
    }

    //////////////////////////// ACTION LOGIC ////////////////////////////

    function _withdraw(
        uint tokenId,
        address to
    ) internal returns (uint, bytes memory) {
        IVotingEscrow VotingEscrow = IVotingEscrow(VE_TRAVA);

        if (to == address(0)) {
            to == address(this);
        }

        DataTypes.LockedBalance memory locked_Id = VotingEscrow.locked(tokenId);

        address lockedToken = locked_Id.token;

        address rewardToken = VotingEscrow.rewardToken();

        uint256 lockAmountBefore = lockedToken.getBalance(address(this));

        uint256 rewardBalanceBefore = rewardToken.getBalance(address(this));

        VotingEscrow.withdraw(tokenId);

        if (to != address(this)) {
            uint256 lockAmountAfter = lockedToken.getBalance(address(this));
            lockedToken.withdrawTokens(to, lockAmountAfter - lockAmountBefore);

            if (lockedToken != rewardToken) {
                uint256 rewardBalanceAfter = rewardToken.getBalance(
                    address(this)
                );
                rewardToken.withdrawTokens(
                    to,
                    rewardBalanceAfter - rewardBalanceBefore
                );
            }
        }

        bytes memory logData = abi.encode(tokenId, to);
        return (tokenId, logData);
    }

    function parseInputs(
        bytes memory _callData
    ) public pure returns (Params memory params) {
        params = abi.decode(_callData, (Params));
    }
}
