// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import "../../interfaces/IWBNB.sol";
import "../../interfaces/cream/ICToken.sol";
import "../../utils/TokenUtilsVenus.sol";
import "../ActionBase.sol";
import "./helpers/CreamHelper.sol";

/// @title Withdraw a token from Cream
contract CreamWithdraw is ActionBase, CreamHelper {
    using TokenUtilsVenus for address;
    struct Params {
        address cTokenAddr;
        uint256 amount;
        address to;
    }

    error CreamRedeemError();
    error CreampUnderlyingRedeemError();

    /// @inheritdoc ActionBase
    function executeAction(
        bytes memory _callData,
        bytes32[] memory _subData,
        uint8[] memory _paramMapping,
        bytes32[] memory _returnValues
    ) public payable virtual override returns (bytes32) {
        Params memory params = parseInputs(_callData);

        params.cTokenAddr = _parseParamAddr(
            params.cTokenAddr,
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
            params.cTokenAddr,
            params.amount,
            params.to
        );
        emit ActionEvent("CreamWithdraw", logData);
        return bytes32(withdrawAmount);
    }

    /// @inheritdoc ActionBase
    function executeActionDirect(
        bytes memory _callData
    ) public payable override {
        Params memory params = parseInputs(_callData);
        (, bytes memory logData) = _withdraw(
            params.cTokenAddr,
            params.amount,
            params.to
        );
        logger.logActionDirectEvent("VenusWithdraw", logData);
    }

    /// @inheritdoc ActionBase
    function actionType() public pure virtual override returns (uint8) {
        return uint8(ActionType.STANDARD_ACTION);
    }

    //////////////////////////// ACTION LOGIC ////////////////////////////

    /// @notice Withdraws a underlying token amount from cream
    /// @dev Send type(uint).max to withdraw whole balance
    /// @param _cTokenAddr vToken address
    /// @param _amount Amount of underlying tokens to withdraw
    /// @param _to Address where to send the tokens to (can be left on proxy)
    function _withdraw(
        address _cTokenAddr,
        uint256 _amount,
        address _to
    ) internal returns (uint256, bytes memory) {
        address tokenAddr = getUnderlyingAddr(_cTokenAddr);

        uint256 tokenBalanceBefore = tokenAddr.getBalance(address(this));

        // if _amount type(uint).max that means take out proxy whole balance
        if (_amount == type(uint256).max) {
            _amount = _cTokenAddr.getBalance(address(this));
        }
            if (ICToken(_cTokenAddr).redeem(_amount) != NO_ERROR) {
                revert CreamRedeemError();
            }
        else {
            // Sender redeems vTokens in exchange for a specified amount of underlying asset
            if (ICToken(_cTokenAddr).redeemUnderlying(_amount) != NO_ERROR) {
                revert CreampUnderlyingRedeemError();
            }
        }

        uint256 tokenBalanceAfter = tokenAddr.getBalance(address(this));

        // used to return the precise amount of tokens returned
        _amount = tokenBalanceAfter - tokenBalanceBefore;

        // always return WETH, never native Eth
        // if (tokenAddr == TokenUtilsVenus.WBNB_ADDR) {
        //     TokenUtilsVenus.depositWbnb(_amount);
        //     tokenAddr = TokenUtilsVenus.BNB_ADDR; // switch back to weth
        // }

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
