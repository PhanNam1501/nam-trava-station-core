// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import "../../../utils/TokenUtils.sol";
import "../../ActionBase.sol";
import "./helpers/TravaStakingHelper.sol";

/// @title Supply a token to an Trava market
contract TravaStakingStake is ActionBase, TravaStakingHelper {
    using TokenUtils for address;

    struct Params {
        address stakingPool;
        address onBehalfOf;
        uint256 amount;
        address from;
    }

    /// @inheritdoc ActionBase
    function executeAction(
        bytes memory _callData,
        bytes32[] memory _subData,
        uint8[] memory _paramMapping,
        bytes32[] memory _returnValues
    ) public payable virtual override returns (bytes32) {
        Params memory params = parseInputs(_callData);

        params.stakingPool = _parseParamAddr(
            params.stakingPool,
            _paramMapping[0],
            _subData,
            _returnValues
        );

        params.onBehalfOf = _parseParamAddr(
            params.onBehalfOf,
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

        (uint256 stakeAmount, bytes memory logData) = _stake(
            params.stakingPool,
            params.onBehalfOf,
            params.amount,
            params.from
        );
        emit ActionEvent("TravaStakingStake", logData);
        return bytes32(stakeAmount);
    }

    /// @inheritdoc ActionBase
    function executeActionDirect(
        bytes memory _callData
    ) public payable override {
        Params memory params = parseInputs(_callData);
        (, bytes memory logData) = _stake(
            params.stakingPool,
            params.onBehalfOf,
            params.amount,
            params.from
        );
        logger.logActionDirectEvent("TravaStakingStake", logData);
    }

    /// @inheritdoc ActionBase
    function actionType() public pure virtual override returns (uint8) {
        return uint8(ActionType.STANDARD_ACTION);
    }

    //////////////////////////// ACTION LOGIC ////////////////////////////

    function _stake(
        address _stakingPool,
        address _onBehalfOf,
        uint256 _amount,
        address _from
    ) internal returns (uint256, bytes memory) {
        address _stakedToken = IStakedToken(_stakingPool).STAKED_TOKEN();
        // if amount is set to max, take the whole _from balance
        if (_amount == type(uint256).max) {
            _amount = IBEP20(_stakedToken).balanceOf(_from);
        }

        // default to from of proxy
        if (_from == address(0)) {
            _from = address(this);
        }

        // default to onBehalf of proxy
        if (_onBehalfOf == address(0)) {
            _onBehalfOf = address(this);
        }

        // pull stakedTokens to proxy so we can stake
        _stakedToken.pullTokensIfNeeded(_from, _amount);

        // approve trava pool to pull stakedTokens
        IBEP20(_stakedToken).approve(_stakingPool, _amount);

        // deposit in behalf of the proxy
        // if (_amount != 0)
        IStakedToken(_stakingPool).stake(_onBehalfOf, _amount);

        bytes memory logData = abi.encode(_stakedToken, _onBehalfOf, _amount);
        return (_amount, logData);
    }

    function parseInputs(
        bytes memory _callData
    ) public pure returns (Params memory params) {
        params = abi.decode(_callData, (Params));
    }
}
