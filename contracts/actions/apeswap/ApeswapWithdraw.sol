// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import "../../interfaces/IWBNB.sol";
import "../../utils/TokenUtils.sol";
import "../ActionBase.sol";
import "./helpers/ApeswapHelper.sol";

/// @title Withdraw a token from Apeswap
contract ApeswapWithdraw is ActionBase, ApeswapHelper {
    using TokenUtils for address;
    struct Params {
        address aTokenAddr;
        uint256 amount;
        address to;
    }

    error ApeswapRedeemError();
    error ApeswapUnderlyingRedeemError();

    /// @inheritdoc ActionBase
    function executeAction(
        bytes memory _callData,
        bytes32[] memory _subData,
        uint8[] memory _paramMapping,
        bytes32[] memory _returnValues
    ) public payable virtual override returns (bytes32) {
        Params memory params = parseInputs(_callData);

        params.aTokenAddr = _parseParamAddr(
            params.aTokenAddr,
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
            params.aTokenAddr,
            params.amount,
            params.to
        );
        emit ActionEvent("ApeswapWithdraw", logData);
        return bytes32(withdrawAmount);
    }

    /// @inheritdoc ActionBase
    function executeActionDirect(
        bytes memory _callData
    ) public payable override {
        Params memory params = parseInputs(_callData);
        (, bytes memory logData) = _withdraw(
            params.aTokenAddr,
            params.amount,
            params.to
        );
        logger.logActionDirectEvent("ApeswapWithdraw", logData);
    }

    /// @inheritdoc ActionBase
    function actionType() public pure virtual override returns (uint8) {
        return uint8(ActionType.STANDARD_ACTION);
    }

    //////////////////////////// ACTION LOGIC ////////////////////////////

    /// @notice Withdraws a underlying token amount from apeswap
    /// @dev Send type(uint).max to withdraw whole balance
    /// @param _aTokenAddr aToken address
    /// @param _amount Amount of underlying tokens to withdraw
    /// @param _to Address where to send the tokens to (can be left on proxy)
    function _withdraw(
        address _aTokenAddr,
        uint256 _amount,
        address _to
    ) internal returns (uint256, bytes memory) {
        address tokenAddr = getUnderlyingAddr(_aTokenAddr);

        // if (tokenAddr == TokenUtils.WBNB_ADDR) {
        //     tokenAddr = TokenUtils.BNB_ADDR;
        // }

        uint256 tokenBalanceBefore = tokenAddr.getBalance(address(this));

        // if _amount type(uint).max that means take out proxy whole balance
        if (_amount == type(uint256).max) {
            _amount = _aTokenAddr.getBalance(address(this));
            if (IAToken(_aTokenAddr).redeem(_amount) != NO_ERROR) {
                revert ApeswapRedeemError();
            }
        } else {
            // Sender redeems aTokens in exchange for a specified amount of underlying asset
            if (IAToken(_aTokenAddr).redeemUnderlying(_amount) != NO_ERROR) {
                revert ApeswapUnderlyingRedeemError();
            }
        }

        uint256 tokenBalanceAfter = tokenAddr.getBalance(address(this));

        // used to return the precise amount of tokens returned
        _amount = tokenBalanceAfter - tokenBalanceBefore;

        // always return WETH, never native Eth
        // if (tokenAddr == TokenUtils.WBNB_ADDR) {
        //     TokenUtils.depositWbnb(_amount);
        //     //tokenAddr = TokenUtils.WBNB_ADDR; // switch back to weth
        //     tokenAddr = TokenUtils.BNB_ADDR;
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
