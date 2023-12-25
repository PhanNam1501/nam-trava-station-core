// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "../../../ActionBase.sol";
import "../../../../utils/TokenUtils.sol";
import "./helpers/TravaNFTExpeditionHelper.sol";

contract TravaNFTExpeditionWithdraw is ActionBase, TravaNFTExpeditionHelper {
    using TokenUtils for address;

    struct Params {
        address vault;
        uint256 id;
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

        params.id = _parseParamUint(
            params.id,
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

        (uint256 id, bytes memory logData) = _withdraw(
            params.vault,
            params.id,
            params.toKnight,
            params.toToken
        );

        emit ActionEvent("TravaNFTExpeditionWithdraw", logData);
        return bytes32(id);
    }

    /// @inheritdoc ActionBase
    function executeActionDirect(
        bytes memory _callData
    ) public payable override {
        Params memory params = parseInputs(_callData);
        (, bytes memory logData) = _withdraw(
            params.vault,
            params.id,
            params.toKnight,
            params.toToken
        );
        logger.logActionDirectEvent("TravaNFTExpeditionDeploy", logData);
    }

    /// @inheritdoc ActionBase
    function actionType() public pure virtual override returns (uint8) {
        return uint8(ActionType.STANDARD_ACTION);
    }

    //////////////////////////// ACTION LOGIC ////////////////////////////

    function _withdraw(
        address _vault,
        uint256 _id,
        address _toKnight,
        address _toToken
    ) internal returns (uint256, bytes memory) {
        if (_toKnight == address(0)) {
            _toKnight = address(this);
        }

        if (_toToken == address(0)) {
            _toToken = address(this);
        }

        require( !INFTExpedition(_vault).isOnDuty(_id) , "Not finished");

        address payment_governor_token = address(PAYMENT_GOVERNOR);

        // get balance token reward before withdraw
        uint256 rewardBalanceBefore = payment_governor_token.getBalance(
            address(this)
        );

        INFTExpedition(_vault).withdraw(_id);

        // get balance of token reward after withdraw
        uint256 rewardBalanceAfter = payment_governor_token.getBalance(
            address(this)
        );

        if (_toKnight != address(this)) {
        
            INFTCollection(NFT_COLLECTION).transferFrom(
                address(this),
                _toKnight,
                _id
            );
        }

        if(_toToken !=address(this)){
            // transfer the reward token
            payment_governor_token.withdrawTokens(
                _toToken,
                rewardBalanceAfter - rewardBalanceBefore
            );
        }

        bytes memory logData = abi.encode(_vault, _id, _toKnight, _toToken);
        return (_id, logData);
    }

    function parseInputs(
        bytes memory _callData
    ) public pure returns (Params memory params) {
        params = abi.decode(_callData, (Params));
    }
}
