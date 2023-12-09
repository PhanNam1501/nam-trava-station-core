// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import "../../interfaces/IWBNB.sol";
import "../../utils/TokenUtilsVenus.sol";
import "../ActionBase.sol";
import "./helpers/WePiggyHelper.sol";

/// @title Supply a token to WePiggy
contract WePiggySupply is ActionBase, WePiggyHelper {
    using TokenUtilsVenus for address;
    struct Params {
        address pTokenAddr;
        uint256 amount;
        address from;
        bool enableAsColl;
    }

    error WePiggySupplyError();

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

        (uint256 supplyAmount, bytes memory logData) = _supply(
            params.pTokenAddr,
            params.amount,
            params.from,
            params.enableAsColl
        );
        emit ActionEvent("WePiggySupply", logData);
        return bytes32(supplyAmount);
    }

    /// @inheritdoc ActionBase
    function executeActionDirect(
        bytes memory _callData
    ) public payable override {
        Params memory params = parseInputs(_callData);
        (, bytes memory logData) = _supply(
            params.pTokenAddr,
            params.amount,
            params.from,
            params.enableAsColl
        );
        logger.logActionDirectEvent("WePiggySupply", logData);
    }

    /// @inheritdoc ActionBase
    function actionType() public pure virtual override returns (uint8) {
        return uint8(ActionType.STANDARD_ACTION);
    }

    //////////////////////////// ACTION LOGIC ////////////////////////////

    /// @notice Supplies a token to the WePiggy protocol
    /// @dev If amount == type(uint256).max we are getting the whole balance of the proxy
    /// @param _pTokenAddr Address of the pToken we'll get when supplying
    /// @param _amount Amount of the underlying token we are supplying
    /// @param _from Address where we are pulling the underlying tokens from
    /// @param _enableAsColl If the supply asset should be collateral
    function _supply(
        address _pTokenAddr,
        uint256 _amount,
        address _from,
        bool _enableAsColl
    ) internal returns (uint256, bytes memory) {
        address tokenAddr = getUnderlyingAddr(_pTokenAddr);

        // if amount type(uint256).max, pull current _from balance
        if (_amount == type(uint256).max) {
            _amount = tokenAddr.getBalance(_from);
        }
        // pull the tokens _from to the proxy
        tokenAddr.pullTokensIfNeeded(_from, _amount);

        // enter the market if needed
        if (_enableAsColl) {
            enterMarket(_pTokenAddr);
        }

        // we always expect actions to deal with WETH never Eth
        // supply WBNB in proxy and change to active BNB to supply in protocol
        if (tokenAddr != TokenUtilsVenus.WBNB_ADDR) {
            tokenAddr.approveToken(_pTokenAddr, _amount);

            if (IPToken(_pTokenAddr).mint(_amount) != NO_ERROR) {
                revert WePiggySupplyError();
            }
        } else {
            TokenUtilsVenus.withdrawWbnb(_amount); // change from Wbnb to BNB
            IPToken(_pTokenAddr).mint{value: _amount}(); // reverts on fail
        }

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
