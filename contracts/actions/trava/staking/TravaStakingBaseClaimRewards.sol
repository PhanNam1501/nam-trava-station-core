// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import "../../../utils/TokenUtils.sol";
import "../../ActionBase.sol";
import "./helpers/TravaStakingHelper.sol";

/// @title Supply a token to an Trava market
contract TravaStakingBaseClaimRewards is ActionBase, TravaStakingHelper {
    using TokenUtils for address;

    struct Params {
        address stakingPool;
        address underlyingToken;
        address from;
        address to;
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

        params.underlyingToken = _parseParamAddr(
            params.underlyingToken,
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


        params.to = _parseParamAddr(
            params.to,
            _paramMapping[3],
            _subData,
            _returnValues
        );

        (uint256 stakeAmount, bytes memory logData) = _claimReward(
            params.stakingPool,
            params.underlyingToken,
            params.from,
            params.to
        );
        emit ActionEvent("TravaStakingBaseClaimRewards", logData);
        return bytes32(stakeAmount);
    }

    /// @inheritdoc ActionBase
    function executeActionDirect(
        bytes memory _callData
    ) public payable override {
        Params memory params = parseInputs(_callData);
        (, bytes memory logData) = _claimReward(
            params.stakingPool,
            params.underlyingToken,
            params.from,
            params.to
        );
        logger.logActionDirectEvent("TravaStakingBaseClaimRewards", logData);
    }

    /// @inheritdoc ActionBase
    function actionType() public pure virtual override returns (uint8) {
        return uint8(ActionType.STANDARD_ACTION);
    }

    //////////////////////////// ACTION LOGIC ////////////////////////////

    function _claimReward(
        address _stakingPool,
        address _underlyingToken,
        address _from,
        address _to
    ) internal returns (uint256, bytes memory) {

        // // default to onBehalf of proxy
        if (_from == address(0)) {
            _from = address(this);
        }

        address _tokenAddr = IVesting(_stakingPool).REWARD_TOKEN();

        uint256 tokenBefore = _tokenAddr.getBalance(address(this));

        // deposit in behalf of the proxy
        IVesting(_stakingPool).claimRewards(
            _underlyingToken,
            _from
        );

        uint256 _amount = _tokenAddr.getBalance(address(this)) - tokenBefore;

        _tokenAddr.withdrawTokens(_to, _amount);

        bytes memory logData = abi.encode(
            _underlyingToken,
            _from,
            _to
        );
        return (_amount, logData);
    }

    function parseInputs(
        bytes memory _callData
    ) public pure returns (Params memory params) {
        params = abi.decode(_callData, (Params));
    }

}
