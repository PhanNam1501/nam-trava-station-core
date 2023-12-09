// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import "../../interfaces/liqee/ILiqeeController.sol";
import "../../interfaces/liqee/IIToken.sol";
import "../../interfaces/IWBNB.sol";
import "../../utils/TokenUtilsVenus.sol";
import "../ActionBase.sol";
import "./helpers/LiqeeHelper.sol";

/// @title Borrow a token from Liqee
contract LiqeeBorrow is ActionBase, LiqeeHelper {
    using TokenUtilsVenus for address;

    struct Params {
        address iTokenAddr;
        uint256 amount;
        address to;
    }
    error LiqeeBorrowError();

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
        params.to = _parseParamAddr(
            params.to,
            _paramMapping[2],
            _subData,
            _returnValues
        );

        (uint256 borrowAmount, bytes memory logData) = _borrow(
            params.iTokenAddr,
            params.amount,
            params.to
        );
        emit ActionEvent("LiqeeBorrow", logData);
        return bytes32(borrowAmount);
    }

    /// @inheritdoc ActionBase
    function executeActionDirect(
        bytes memory _callData
    ) public payable override {
        Params memory params = parseInputs(_callData);
        (, bytes memory logData) = _borrow(
            params.iTokenAddr,
            params.amount,
            params.to
        );
        logger.logActionDirectEvent("LiqeeBorrow", logData);
    }

    /// @inheritdoc ActionBase
    function actionType() public pure virtual override returns (uint8) {
        return uint8(ActionType.STANDARD_ACTION);
    }

    //////////////////////////// ACTION LOGIC ////////////////////////////

    /// @notice User borrows tokens from the Liqee finance
    /// @param _iTokenAddr Address of the iToken we are borrowing
    /// @param _amount Amount of tokens to be borrowed
    /// @param _to The address we are sending the borrowed tokens to
    function _borrow(
        address _iTokenAddr,
        uint256 _amount,
        address _to
    ) internal returns (uint256, bytes memory) {
        address tokenAddr = getUnderlyingAddr(_iTokenAddr);
        // if the tokens are borrowed we need to enter the market
        enterMarket(_iTokenAddr);

        // if (ICToken(_cTokenAddr).borrow(_amount) != NO_ERROR) {
        //     revert CreamBorrowError();
        // }

        IIToken(_iTokenAddr).borrow(_amount);

        // always return WETH, never native Eth
        // receive borrow BNB and change it to wBNB
        if (tokenAddr == TokenUtilsVenus.WBNB_ADDR) {
            TokenUtilsVenus.depositWbnb(_amount);
        }
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
