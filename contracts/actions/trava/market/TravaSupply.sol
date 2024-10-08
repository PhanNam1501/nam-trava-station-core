// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import "../../../utils/TokenUtils.sol";
import "../../ActionBase.sol";
import "./helpers/TravaHelper.sol";

/// @title Supply a token to an Trava market
contract TravaSupply is ActionBase, TravaHelper {
    using TokenUtils for address;

    struct Params {
        address market;
        address tokenAddr;
        uint256 amount;
        address from;
        address onBehalf;
        bool enableAsColl;
    }

    /// @inheritdoc ActionBase
    function executeAction(
        bytes memory _callData,
        bytes32[] memory _subData,
        uint8[] memory _paramMapping,
        bytes32[] memory _returnValues
    ) public payable virtual override returns (bytes32) {
        Params memory params = parseInputs(_callData);

        params.market = _parseParamAddr(
            params.market,
            _paramMapping[0],
            _subData,
            _returnValues
        );
        params.tokenAddr = _parseParamAddr(
            params.tokenAddr,
            _paramMapping[1],
            _subData,
            _returnValues
        );
        params.amount = _parseParamUint(
            params.amount,
            _paramMapping[2],
            _subData,
            _returnValues
        );
        params.from = _parseParamAddr(
            params.from,
            _paramMapping[3],
            _subData,
            _returnValues
        );
        params.onBehalf = _parseParamAddr(
            params.onBehalf,
            _paramMapping[4],
            _subData,
            _returnValues
        );

        (uint256 supplyAmount, bytes memory logData) = _supply(
            params.market,
            params.tokenAddr,
            params.amount,
            params.from,
            params.onBehalf,
            params.enableAsColl
        );
        emit ActionEvent("TravaSupply", logData);
        return bytes32(supplyAmount);
    }

    /// @inheritdoc ActionBase
    function executeActionDirect(
        bytes memory _callData
    ) public payable override {
        Params memory params = parseInputs(_callData);
        (, bytes memory logData) = _supply(
            params.market,
            params.tokenAddr,
            params.amount,
            params.from,
            params.onBehalf,
            params.enableAsColl
        );
        logger.logActionDirectEvent("TravaSupply", logData);
    }

    /// @inheritdoc ActionBase
    function actionType() public pure virtual override returns (uint8) {
        return uint8(ActionType.STANDARD_ACTION);
    }

    //////////////////////////// ACTION LOGIC ////////////////////////////

    /// @notice User deposits tokens to the Trava protocol
    /// @dev User needs to approve the DSProxy to pull the _tokenAddr tokens
    /// @param _market Provider Id for specific market
    /// @param _tokenAddr The address of the token to be deposited
    /// @param _amount Amount of tokens to be deposited
    /// @param _from Where are we pulling the supply tokens amount from
    /// @param _onBehalf For what user we are supplying the tokens, defaults to proxy
    /// @param _enableAsColl If the supply asset should be collateral
    function _supply(
        address _market,
        address _tokenAddr,
        uint256 _amount,
        address _from,
        address _onBehalf,
        bool _enableAsColl
    ) internal returns (uint256, bytes memory) {
        ILendingPool lendingPool = ILendingPool(_market);

        // if amount is set to max, take the whole _from balance
        if (_amount == type(uint256).max) {
            _amount = _tokenAddr.getBalance(_from);
        }

        // default to onBehalf of proxy
        if (_onBehalf == address(0)) {
            _onBehalf = address(this);
        }

        // pull tokens to proxy so we can supply
        _tokenAddr.pullTokensIfNeeded(_from, _amount);

        // approve trava pool to pull tokens
        _tokenAddr.approveToken(address(lendingPool), _amount);

        // deposit in behalf of the proxy
        lendingPool.deposit(
            _tokenAddr,
            _amount,
            _onBehalf,
            TRAVA_REFERRAL_CODE
        );

        if (_enableAsColl) {
            enableAsCollateral(_market, _tokenAddr, true);
        }

        bytes memory logData = abi.encode(
            _market,
            _tokenAddr,
            _amount,
            _from,
            _onBehalf,
            _enableAsColl
        );
        return (_amount, logData);
    }

    /// @notice Enable/Disable a token as collateral for the specified Trava market
    function enableAsCollateral(
        address _lendingPool,
        address _tokenAddr,
        bool _useAsCollateral
    ) public {
        ILendingPool(_lendingPool).setUserUseReserveAsCollateral(
            _tokenAddr,
            _useAsCollateral
        );
    }

    function parseInputs(
        bytes memory _callData
    ) public pure returns (Params memory params) {
        params = abi.decode(_callData, (Params));
    }
}
