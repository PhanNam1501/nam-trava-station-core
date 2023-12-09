// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "../../interfaces/IWBNB.sol";
import "../../utils/TokenUtilsVenus.sol";
import "../ActionBase.sol";
import "./helpers/WePiggyHelper.sol";

/// @title Payback a token a user borrowed from WePiggy
contract WePiggyPayback is ActionBase, WePiggyHelper {
    using TokenUtilsVenus for address;

    struct Params {
        address pTokenAddr;
        uint256 amount;
        address from;
        address onBehalf;
    }
    error WePiggyPaybackError();

    /// @inheritdoc ActionBase
    function executeAction(
        bytes memory _callData,
        bytes32[] memory _subData,
        uint8[] memory _paramMapping,
        bytes32[] memory _returnValues
    ) public payable virtual override returns (bytes32) {
        Params memory params = parseInputs(_callData);

        params.pTokenAddr = _parseParamAddr(
            params.pTokenAddr,
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
            params.pTokenAddr,
            params.amount,
            params.from,
            params.onBehalf
        );
        emit ActionEvent("WePiggyPayback", logData);
        return bytes32(paybackAmount);
    }

    /// @inheritdoc ActionBase
    function executeActionDirect(
        bytes memory _callData
    ) public payable override {
        Params memory params = parseInputs(_callData);
        (, bytes memory logData) = _payback(
            params.pTokenAddr,
            params.amount,
            params.from,
            params.onBehalf
        );
        logger.logActionDirectEvent("WePiggyPayback", logData);
    }

    /// @inheritdoc ActionBase
    function actionType() public pure virtual override returns (uint8) {
        return uint8(ActionType.STANDARD_ACTION);
    }

    //////////////////////////// ACTION LOGIC ////////////////////////////

    /// @notice Payback a borrowed token from the WePiggy protocol
    /// @dev Amount type(uint).max will take the whole borrow amount
    /// @param _pTokenAddr Address of the vToken we are paying back
    /// @param _amount Amount of the underlying token
    /// @param _from Address where we are pulling the underlying tokens from
    /// @param _onBehalf Repay on behalf of which address (if 0x0 defaults to proxy)
    function _payback(
        address _pTokenAddr,
        uint256 _amount,
        address _from,
        address _onBehalf
    ) internal returns (uint256, bytes memory) {
        address tokenAddr = getUnderlyingAddr(_pTokenAddr);

        // default to onBehalf of proxy
        if (_onBehalf == address(0)) {
            _onBehalf = address(this);
        }

        uint256 maxDebt = IPToken(_pTokenAddr).borrowBalanceCurrent(_onBehalf);
        _amount = _amount > maxDebt ? maxDebt : _amount;

        tokenAddr.pullTokensIfNeeded(_from, _amount);

        // we always expect actions to deal with WETH never Eth
        if (tokenAddr != TokenUtilsVenus.WBNB_ADDR) {
            tokenAddr.approveToken(_pTokenAddr, _amount);
            if (
                IPToken(_pTokenAddr).repayBorrowBehalf(_onBehalf, _amount) !=
                NO_ERROR
            ) {
                revert WePiggyPaybackError();
            }
        } else {
            TokenUtilsVenus.withdrawWbnb(_amount);
            IPToken(_pTokenAddr).repayBorrowBehalf{value: _amount}(_onBehalf); // reverts on fail
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
