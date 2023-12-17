// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import "../../interfaces/IWBNB.sol";
import "../../utils/TokenUtilsVenus.sol";
import "../ActionBase.sol";
import "./helpers/WePiggyHelper.sol";

/// @title Withdraw a token from WePiggy
contract WePiggyWithdraw is ActionBase, WePiggyHelper {
    using TokenUtilsVenus for address;
    struct Params {
        address pTokenAddr;
        uint256 amount;
        address to;
    }

    error WePiggyRedeemError();
    error WePiggyUnderlyingRedeemError();

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
        params.to = _parseParamAddr(
            params.to,
            _paramMapping[2],
            _subData,
            _returnValues
        );

        (uint256 withdrawAmount, bytes memory logData) = _withdraw(
            params.pTokenAddr,
            params.amount,
            params.to
        );
        emit ActionEvent("WePiggyWithdraw", logData);
        return bytes32(withdrawAmount);
    }

    /// @inheritdoc ActionBase
    function executeActionDirect(
        bytes memory _callData
    ) public payable override {
        Params memory params = parseInputs(_callData);
        (, bytes memory logData) = _withdraw(
            params.pTokenAddr,
            params.amount,
            params.to
        );
        logger.logActionDirectEvent("WePiggyWithdraw", logData);
    }

    /// @inheritdoc ActionBase
    function actionType() public pure virtual override returns (uint8) {
        return uint8(ActionType.STANDARD_ACTION);
    }

    //////////////////////////// ACTION LOGIC ////////////////////////////

    /// @notice Withdraws a underlying token amount from wepiggy
    /// @dev Send type(uint).max to withdraw whole balance
    /// @param _pTokenAddr vToken address
    /// @param _amount Amount of underlying tokens to withdraw
    /// @param _to Address where to send the tokens to (can be left on proxy)
    function _withdraw(
        address _pTokenAddr,
        uint256 _amount,
        address _to
    ) internal returns (uint256, bytes memory) {
        address tokenAddr = getUnderlyingAddr(_pTokenAddr);

        // because comp returns native eth we need to check the balance of that

        if (tokenAddr == TokenUtilsVenus.WBNB_ADDR) {
            tokenAddr = TokenUtilsVenus.BNB_ADDR;
        }

        uint256 tokenBalanceBefore = tokenAddr.getBalance(address(this));
                
        // if _amount type(uint).max that means take out proxy whole balance
        if (_amount == type(uint256).max) {
            _amount = _pTokenAddr.getBalance(address(this));
            if (IPToken(_pTokenAddr).redeem(_amount) != NO_ERROR) {
                revert WePiggyRedeemError();
            }
        } else {
            // Sender redeems pTokens in exchange for a specified amount of underlying asset
            if (IPToken(_pTokenAddr).redeemUnderlying(_amount) != NO_ERROR) {
                revert WePiggyUnderlyingRedeemError();
            }
        }

        uint256 tokenBalanceAfter = tokenAddr.getBalance(address(this));

        // used to return the precise amount of tokens returned
        _amount = tokenBalanceAfter - tokenBalanceBefore;

        // always return WETH, never native Eth
        if (tokenAddr == TokenUtilsVenus.WBNB_ADDR) {
            TokenUtilsVenus.depositWbnb(_amount);
            tokenAddr = TokenUtilsVenus.BNB_ADDR;
        }

        // If tokens needs to be send to the _to address
        tokenAddr.withdrawTokens(_to, _amount);

        bytes memory logData = abi.encode(tokenAddr, _amount, _to);
        return (_amount, logData);
    }

    function parseInputs(
        bytes memory _callData
    ) public pure returns (Params memory params) {
        params = abi.decode(_callData, (Params));
    }
}
