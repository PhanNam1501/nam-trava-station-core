// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import "../../../utils/TokenUtils.sol";
import "../../ActionBase.sol";
import "./helpers/TravaGovernanceHelper.sol";


/// @title Supply a token to an Trava market
contract TravaGovernanceUnlockTime is ActionBase, TravaGovernanceHelper {
    using TokenUtils for address;

    struct Params{
        address token;
        uint tokenId;
        uint lock_duration;
    }

     /// @inheritdoc ActionBase
    function executeAction(
        bytes memory _callData,
        bytes32[] memory _subData,
        uint8[] memory _paramMapping,
        bytes32[] memory _returnValues
    ) public payable virtual override returns (bytes32) {
        Params memory params = parseInputs(_callData);

        params.token = _parseParamAddr(
            params.token,
            _paramMapping[0],
            _subData,
            _returnValues
        );

        params.tokenId = _parseParamUint(
            params.tokenId,
            _paramMapping[1],
            _subData,
            _returnValues
        );

        params.lock_duration = _parseParamUint(
            params.lock_duration,
            _paramMapping[2],
            _subData,
            _returnValues
        );
        

        (uint tokenId, bytes memory logData) = _increaseLock(
            params.token,
            params.tokenId,
            params.lock_duration
        );
        emit ActionEvent("TravaGovernanceIncreaseLock", logData);
        return bytes32(tokenId);
    }

    /// @inheritdoc ActionBase
    function executeActionDirect(
        bytes memory _callData
    ) public payable override {
        Params memory params = parseInputs(_callData);
        (, bytes memory logData) = _increaseLock(
            params.token,
            params.tokenId,
            params.lock_duration
        );
        logger.logActionDirectEvent("TravaGovernanceIncreaseLock", logData);
    }

    /// @inheritdoc ActionBase
    function actionType() public pure virtual override returns (uint8) {
        return uint8(ActionType.STANDARD_ACTION);
    }

    //////////////////////////// ACTION LOGIC ////////////////////////////

    function _increaseLock(
        address token,
        uint tokenId,
        uint lock_duration
    ) internal returns (uint, bytes memory) {
        
        IVotingEscrow VotingEscrow = IVotingEscrow(VE_TRAVA);
        
        DataTypes.LockedBalance memory locked_Id = VotingEscrow.locked(tokenId);

        address _token = locked_Id.token;
        
        require( _token == token , "Token address is wrong");

        VotingEscrow.increase_unlock_time(tokenId, lock_duration);

        bytes memory logData = abi.encode(tokenId, lock_duration);
        return (tokenId, logData);
    }

    function parseInputs(
        bytes memory _callData
    ) public pure returns (Params memory params) {
        params = abi.decode(_callData, (Params));
    }
  
}
