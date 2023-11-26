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

        params.id = _parseParamUint(
            params.id,
            _paramMapping[1],
            _subData,
            _returnValues
        );

        params.to = _parseParamAddr(
            params.to,
            _paramMapping[2],
            _subData,
            _returnValues
        );

        (uint256 id, bytes memory logData) = _withdraw(
            params.vault,
            params.id,
            params.to
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
            params.to
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
        address _to
    ) internal returns (uint256, bytes memory) {
        if (_to == address(0)) {
            _to = address(this);
        }

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

        if (_to != address(this)) {
            // transfer the reward token
            payment_governor_token.withdrawTokens(
                _to,
                rewardBalanceAfter - rewardBalanceBefore
            );

            INFTCollection(NFT_COLLECTION).transferFrom(
                address(this),
                _to,
                _id
            );
        }

        bytes memory logData = abi.encode(_vault, _id, _to);
        return (_id, logData);
    }

    function parseInputs(
        bytes memory _callData
    ) public pure returns (Params memory params) {
        params = abi.decode(_callData, (Params));
    }
}
