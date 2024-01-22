// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "../../interfaces/liqee/ILiqeeController.sol";
import "../../interfaces/liqee/IIToken.sol";
import "../../interfaces/IWBNB.sol";
import "../../utils/TokenUtilsVenus.sol";
import "../ActionBase.sol";
import "./helpers/LiqeeHelper.sol";

/// @title Repay a token a user borrowed from Liqeee
contract LiqeeRepay is ActionBase, LiqeeHelper {
    using TokenUtilsVenus for address;

    struct Params {
        address iTokenAddr;
        uint256 amount;
        address from;
        address onBehalf;
    }
    error CreamRepayError();

    /// @inheritdoc ActionBase
    function executeAction(
        bytes memory _callData,
        bytes32[] memory _subData,
        uint8[] memory _paramMapping,
        bytes32[] memory _returnValues
    ) public payable virtual override returns (bytes32) {
        Params memory params = parseInputs(_callData);

        params.iTokenAddr = _parseParamAddr(
            params.iTokenAddr,
            _paramMapping[0],
            _subData,
            _returnValues
        );
        params.amount = _parseParamUint(
            params.amount,
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
        params.onBehalf = _parseParamAddr(
            params.onBehalf,
            _paramMapping[3],
            _subData,
            _returnValues
        );

        (uint256 paybackAmount, bytes memory logData) = _payback(
            params.iTokenAddr,
            params.amount,
            params.from,
            params.onBehalf
        );
        emit ActionEvent("LiqeeRepay", logData);
        return bytes32(paybackAmount);
    }

    /// @inheritdoc ActionBase
    function executeActionDirect(
        bytes memory _callData
    ) public payable override {
        Params memory params = parseInputs(_callData);
        (, bytes memory logData) = _payback(
            params.iTokenAddr,
            params.amount,
            params.from,
            params.onBehalf
        );
        logger.logActionDirectEvent("LiqeeRepay", logData);
    }

    /// @inheritdoc ActionBase
    function actionType() public pure virtual override returns (uint8) {
        return uint8(ActionType.STANDARD_ACTION);
    }

    //////////////////////////// ACTION LOGIC ////////////////////////////

    /// @notice Repay a borrowed token from the Liqee finance
    /// @dev Amount type(uint).max will take the whole borrow amount
    /// @param _iTokenAddr Address of the iToken we are paying back
    /// @param _amount Amount of the underlying token
    /// @param _from Address where we are pulling the underlying tokens from
    /// @param _onBehalf Repay on behalf of which address (if 0x0 defaults to proxy)
    function _payback(
        address _iTokenAddr,
        uint256 _amount,
        address _from,
        address _onBehalf
    ) internal returns (uint256, bytes memory) {
        address tokenAddr = getUnderlyingAddr(_iTokenAddr);

        // default to onBehalf of proxy
        if (_onBehalf == address(0)) {
            _onBehalf = address(this);
        }

        uint256 maxDebt = IIToken(_iTokenAddr).borrowBalanceCurrent(_onBehalf);
        _amount = _amount > maxDebt ? maxDebt : _amount;

        tokenAddr.pullTokensIfNeeded(_from, _amount);

        // we always expect actions to deal with WETH never Eth
        if (tokenAddr != TokenUtilsVenus.BNB_ADDR) {
            tokenAddr.approveToken(_iTokenAddr, _amount);
            
            IIToken(_iTokenAddr).repayBorrowBehalf(_onBehalf, _amount);
        } else {
            //TokenUtilsVenus.withdrawWbnb(_amount);
            IIToken(_iTokenAddr).repayBorrowBehalf{value: _amount}(_onBehalf); // reverts on fail
        }

        bytes memory logData = abi.encode(tokenAddr, _amount, _from, _onBehalf);
        return (_amount, logData);
    }

    function parseInputs(
        bytes memory _callData
    ) public pure returns (Params memory params) {
        params = abi.decode(_callData, (Params));
    }
}
