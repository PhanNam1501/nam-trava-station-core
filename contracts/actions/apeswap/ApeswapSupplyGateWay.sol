// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import "../../interfaces/IWBNB.sol";
import "../../utils/TokenUtils.sol";
import "../ActionBase.sol";
import "./helpers/ApeswapHelper.sol";

/// @title Supply a token to Apeswap
contract ApeswapSupplyGateWay is ActionBase, ApeswapHelper {
    using TokenUtils for address;
    struct Params {
        address aTokenAddr;
        uint256 amount;
        address from;
        bool enableAsColl;
    }

    error ApeswapSupplyGateWayError();

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
        params.from = _parseParamAddr(
            params.from,
            _paramMapping[2],
            _subData,
            _returnValues
        );

        (uint256 supplyAmount, bytes memory logData) = _supplyGateway(
            params.aTokenAddr,
            params.amount,
            params.from,
            params.enableAsColl
        );
        emit ActionEvent("ApeswapSupplyGateWay", logData);
        return bytes32(supplyAmount);
    }

    /// @inheritdoc ActionBase
    function executeActionDirect(
        bytes memory _callData
    ) public payable override {
        Params memory params = parseInputs(_callData);
        (, bytes memory logData) = _supplyGateway(
            params.aTokenAddr,
            params.amount,
            params.from,
            params.enableAsColl
        );
        logger.logActionDirectEvent("ApeswapSupplyGateWay", logData);
    }

    /// @inheritdoc ActionBase
    function actionType() public pure virtual override returns (uint8) {
        return uint8(ActionType.STANDARD_ACTION);
    }

    //////////////////////////// ACTION LOGIC ////////////////////////////

    /// @notice Supplies a token to the Apeswapound protocol
    /// @dev If amount == type(uint256).max we are getting the whole balance of the proxy
    /// @param _aTokenAddr Address of the aToken we'll get when supplying
    /// @param _amount Amount of the underlying token we are supplying
    /// @param _from Address where we are pulling the underlying tokens from
    /// @param _enableAsColl If the supply asset should be collateral
    function _supplyGateway(
        address _aTokenAddr,
        uint256 _amount,
        address _from,
        bool _enableAsColl
    ) internal returns (uint256, bytes memory) {
        address tokenAddr = getUnderlyingAddr(_aTokenAddr);

        if (_amount == type(uint256).max) {
            _amount = address(this).balance;
        }

        if(_enableAsColl){
            enterMarket(_aTokenAddr);
        }

        IAToken(_aTokenAddr).mint{value: _amount}(); // reverts on fail

        bytes memory logData = abi.encode(
            tokenAddr,
            _amount,
            _from,
            _enableAsColl
        );
        return (_amount, logData);
    }

    function parseInputs(
        bytes memory _callData
    ) public pure returns (Params memory params) {
        params = abi.decode(_callData, (Params));
    }
}
