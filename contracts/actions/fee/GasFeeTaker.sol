// SPDX-License-Identifier: MIT

pragma solidity =0.8.4;

import "../../utils/FeeRecipient.sol";
import "../ActionBase.sol";
import "./helpers/GasFeeHelper.sol";
import "../../utils/TokenUtils.sol";

/// @title Helper action to send a token to the specified address
contract GasFeeTaker is ActionBase, GasFeeHelper {
    using TokenUtils for address;

    struct Params {
        uint256 gasUsed;
        address feeToken;
        uint256 availableAmount;
        uint256 dfsFeeDivider;
        address[] path;
    }

    /// @inheritdoc ActionBase
    function executeAction(
        bytes memory _callData,
        bytes32[] memory _subData,
        uint8[] memory _paramMapping,
        bytes32[] memory _returnValues
    ) public payable virtual override returns (bytes32) {
        Params memory inputData = parseInputsGasFeeTaker(_callData);

        uint256 t = 0;

        inputData.gasUsed = _parseParamUint(
            inputData.gasUsed,
            _paramMapping[0],
            _subData,
            _returnValues
        );
        inputData.feeToken = _parseParamAddr(
            inputData.feeToken,
            _paramMapping[1],
            _subData,
            _returnValues
        );
        inputData.availableAmount = _parseParamUint(
            inputData.availableAmount,
            _paramMapping[2],
            _subData,
            _returnValues
        );
        inputData.dfsFeeDivider = _parseParamUint(
            inputData.dfsFeeDivider,
            _paramMapping[3],
            _subData,
            _returnValues
        );

        t = inputData.path.length;
        for(uint256 i = 0; i < t; i++) {
            inputData.path[i] = _parseParamAddr(
                inputData.path[i],
                _paramMapping[4],
                _subData,
                _returnValues
            );
        }

        /// @dev This means inputData.availableAmount is not being piped into
        /// @dev To stop sender from sending any value here, if not piped take proxy balance
        if (_paramMapping[1] == 0) {
            inputData.availableAmount = inputData.feeToken.getBalance(
                address(this)
            );
        }

        uint256 amountLeft = _takeFee(
            inputData.gasUsed,
            inputData.feeToken,
            inputData.availableAmount,
            inputData.dfsFeeDivider,
            inputData.path
        );

        emit ActionEvent("GasFeeTaker", abi.encode(inputData, amountLeft));
        return bytes32(amountLeft);
    }

    /// @inheritdoc ActionBase
    // solhint-disable-next-line no-empty-blocks
    function executeActionDirect(
        bytes memory _callData
    ) public payable virtual override {
        Params memory inputData = parseInputsGasFeeTaker(_callData);
        uint256 amountLeft = _takeFee(
            inputData.gasUsed,
            inputData.feeToken,
            inputData.availableAmount,
            inputData.dfsFeeDivider,
            inputData.path
        );
        logger.logActionDirectEvent("TravaFeeTaker", abi.encode(inputData, amountLeft));
    }

        /// @inheritdoc ActionBase
    function actionType() public pure virtual override returns (uint8) {
        return uint8(ActionType.FEE_ACTION);
    }

    function _takeFee(
        uint256 gasUsed,
        address feeToken,
        uint256 availableAmount,
        uint256 dfsFeeDivider,
        address[] memory path
    ) internal returns (uint256 amountLeft) {
        uint256 txCost = calcGasCost(
            gasUsed,
            feeToken,
            path,
            0
        );

        // cap at 20% of the max amount
        if (txCost >= (availableAmount / 5)) {
            txCost = availableAmount / 5;
        }

        if (dfsFeeDivider != 0) {
            /// @dev If divider is lower the fee is greater, should be max 5 bps
            if (dfsFeeDivider < MAX_DFS_FEE) {
                dfsFeeDivider = MAX_DFS_FEE;
            }

            // add amount we take for dfs fee as well
            txCost += availableAmount / dfsFeeDivider;
        }

        amountLeft = sub(availableAmount, txCost);
        feeToken.withdrawTokens(feeRecipient.getFeeAddr(), txCost);
    }

    function parseInputsGasFeeTaker(
        bytes memory _callData
    ) public pure returns (Params memory inputData) {
        inputData = abi.decode(_callData, (Params));
    }
}
