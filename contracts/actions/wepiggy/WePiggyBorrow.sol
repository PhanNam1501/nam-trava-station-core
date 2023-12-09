// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;


import "../../interfaces/IWBNB.sol";
import "../../utils/TokenUtilsVenus.sol";
import "../ActionBase.sol";
import "./helpers/WePiggyHelper.sol";

/// @title Borrow a token from WePiggy
contract WePiggyBorrow is ActionBase, WePiggyHelper {
    using TokenUtilsVenus for address;

    struct Params {
        address pTokenAddr;
        uint256 amount;
        address to;
    }
    error WePiggyBorrowError();

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

        (uint256 borrowAmount, bytes memory logData) = _borrow(
            params.pTokenAddr,
            params.amount,
            params.to
        );
        emit ActionEvent("WePiggyBorrow", logData);
        return bytes32(borrowAmount);
    }

    /// @inheritdoc ActionBase
    function executeActionDirect(
        bytes memory _callData
    ) public payable override {
        Params memory params = parseInputs(_callData);
        (, bytes memory logData) = _borrow(
            params.pTokenAddr,
            params.amount,
            params.to
        );
        logger.logActionDirectEvent("WePiggyBorrow", logData);
    }

    /// @inheritdoc ActionBase
    function actionType() public pure virtual override returns (uint8) {
        return uint8(ActionType.STANDARD_ACTION);
    }

    //////////////////////////// ACTION LOGIC ////////////////////////////

    /// @notice User borrows tokens from the WePiggy protocol
    /// @param _pTokenAddr Address of the pToken we are borrowing
    /// @param _amount Amount of tokens to be borrowed
    /// @param _to The address we are sending the borrowed tokens to
    function _borrow(
        address _pTokenAddr,
        uint256 _amount,
        address _to
    ) internal returns (uint256, bytes memory) {
        address tokenAddr = getUnderlyingAddr(_pTokenAddr);
        // if the tokens are borrowed we need to enter the market
        enterMarket(_pTokenAddr);

        if (IPToken(_pTokenAddr).borrow(_amount) != NO_ERROR) {
            revert WePiggyBorrowError();
        }

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
