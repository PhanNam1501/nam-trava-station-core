// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import "../../interfaces/IWBNB.sol";
import "../../utils/TokenUtils.sol";
import "../ActionBase.sol";
import "./helpers/ApeswapHelper.sol";

/// @title Borrow a token from Apeswap
contract ApeswapBorrow is ActionBase, ApeswapHelper {
    using TokenUtils for address;

    struct Params {
        address aTokenAddr;
        uint256 amount;
        address to;
    }
    error ApeswapBorrowError();

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

        (uint256 borrowAmount, bytes memory logData) = _borrow(
            params.aTokenAddr,
            params.amount,
            params.to
        );
        emit ActionEvent("ApeswapBorrow", logData);
        return bytes32(borrowAmount);
    }

    /// @inheritdoc ActionBase
    function executeActionDirect(
        bytes memory _callData
    ) public payable override {
        Params memory params = parseInputs(_callData);
        (, bytes memory logData) = _borrow(
            params.aTokenAddr,
            params.amount,
            params.to
        );
        logger.logActionDirectEvent("ApeswapBorrow", logData);
    }

    /// @inheritdoc ActionBase
    function actionType() public pure virtual override returns (uint8) {
        return uint8(ActionType.STANDARD_ACTION);
    }

    //////////////////////////// ACTION LOGIC ////////////////////////////

    /// @notice User borrows tokens from the Apeswap protocol
    /// @param _aTokenAddr Address of the aToken we are borrowing
    /// @param _amount Amount of tokens to be borrowed
    /// @param _to The address we are sending the borrowed tokens to
    function _borrow(
        address _aTokenAddr,
        uint256 _amount,
        address _to
    ) internal returns (uint256, bytes memory) {
        address tokenAddr = getUnderlyingAddr(_aTokenAddr);
        // if the tokens are borrowed we need to enter the market
        enterMarket(_aTokenAddr);

        if (IAToken(_aTokenAddr).borrow(_amount) != NO_ERROR) {
            revert ApeswapBorrowError();
        }

        // always return WETH, never native Eth
        // receive borrow BNB and change it to wBNB

        // if (tokenAddr == TokenUtilsApeswap.WBNB_ADDR) {
        //     TokenUtilsApeswap.depositWbnb(_amount);
        // }
        
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
