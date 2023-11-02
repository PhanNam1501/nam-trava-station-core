// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import "../../../utils/TokenUtils.sol";
import "../../ActionBase.sol";
import "./helpers/TravaGovernanceHelper.sol";


/// @title Increase amount to tokenId in trava governance
contract TravaGovernanceIncreaseAmount is ActionBase, TravaGovernanceHelper {
    using TokenUtils for address;

    struct Params{
        address token;
        uint tokenId;
        uint value;
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

        params.value = _parseParamUint(
            params.value,
            _paramMapping[2],
            _subData,
            _returnValues
        );
        
        params.from = _parseParamAddr(
            params.from,
            _paramMapping[3],
            _subData,
            _returnValues
        );

        (uint tokenId, bytes memory logData) = _increaseAmount(
            params.token,
            params.tokenId,
            params.value,
            params.from
        );
        emit ActionEvent("TravaGovernanceIncreaseAmount", logData);
        return bytes32(tokenId);
    }

    /// @inheritdoc ActionBase
    function executeActionDirect(
        bytes memory _callData
    ) public payable override {
        Params memory params = parseInputs(_callData);
        (, bytes memory logData) = _increaseAmount(
            params.token,
            params.tokenId,
            params.value,
            params.from
        );
        logger.logActionDirectEvent("TravaGovernanceIncreaseAmount", logData);
    }

    /// @inheritdoc ActionBase
    function actionType() public pure virtual override returns (uint8) {
        return uint8(ActionType.STANDARD_ACTION);
    }

    //////////////////////////// ACTION LOGIC ////////////////////////////

    function _increaseAmount(
        address token,
        uint tokenId,
        uint value,
        address from 
    ) internal returns (uint, bytes memory) {
        
        IVotingEscrow VotingEscrow = IVotingEscrow(VE_TRAVA);
        
        DataTypes.LockedBalance memory locked_Id = VotingEscrow.locked(tokenId);

        address _token = locked_Id.token;
        
        require( _token == token , "Token address is wrong");

        if (value == type(uint256).max) {
            value = token.getBalance(from);
        }

        // pull tokens to proxy so we can create lock
        token.pullTokensIfNeeded(from, value);

        // approve veTrava to pull tokens
        token.approveToken(address(VotingEscrow), value);

        VotingEscrow.increase_amount(tokenId, value);

        bytes memory logData = abi.encode(tokenId, value);
        return (tokenId, logData);
    }

    function parseInputs(
        bytes memory _callData
    ) public pure returns (Params memory params) {
        params = abi.decode(_callData, (Params));
    }
  
}
