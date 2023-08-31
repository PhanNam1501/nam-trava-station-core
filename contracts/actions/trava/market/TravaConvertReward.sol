// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import "../../../utils/TokenUtils.sol";
import "../../ActionBase.sol";
import "./helpers/TravaHelper.sol";

/// @title Claim Rewards a token from an Trava market based on market
contract TravaConvertRewards is ActionBase, TravaHelper {
    using TokenUtils for address;

    /**
   * @dev Claims reward for an user, on all the assets of the lending pool, accumulating the pending rewards
   * @param amount Amount of rewards to claim
   * @param to Address that will be receiving the rewards
   * @param from DSProxy's user
   * @return Rewards claimed
   **/
    struct Params {
        address from;
        address to;
        uint256 amount;
    }

    /// @inheritdoc ActionBase
    function executeAction(
        bytes memory _callData,
        bytes32[] memory _subData,
        uint8[] memory _paramMapping,
        bytes32[] memory _returnValues
    ) public payable virtual override returns (bytes32) {
        Params memory params = parseInputs(_callData);

        params.from = _parseParamAddr(
            params.from,
            _paramMapping[0],
            _subData,
            _returnValues
        );
        params.to = _parseParamAddr(
            params.to,
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


        (uint256 amount, bytes memory logData) = _convertRewards(
            params.from,
            params.to,
            params.amount
        );
        emit ActionEvent("TravaConvertRewards", logData);
        return bytes32(amount);
    }

    /// @inheritdoc ActionBase
    function executeActionDirect(
        bytes memory _callData
    ) public payable override {
        Params memory params = parseInputs(_callData);
        (, bytes memory logData) = _convertRewards(
            params.from,
            params.to,
            params.amount
        );
        logger.logActionDirectEvent("TravaConvertRewards", logData);
    }

    /// @inheritdoc ActionBase
    function actionType() public pure virtual override returns (uint8) {
        return uint8(ActionType.STANDARD_ACTION);
    }

    //////////////////////////// ACTION LOGIC ////////////////////////////
    function _convertRewards(
        address _from,
        address _to,
        uint256 _amount
    ) internal returns (uint256, bytes memory) {
        IStakedToken stakedToken = IStakedToken(STAKED_TRAVA_TOKEN_ADDRESS);
        if(_from == address(0)) {
            _from == address(this);
        }



        address _rToken = stakedToken.REWARD_TOKEN();
        _rToken.pullTokensIfNeeded(_from, _amount);

        // withdraw underlying tokens from Trava and send _to address
        stakedToken.redeem(_to, _amount);

        if (_to != address(this)) {
            // if amount is set to max, take the whole _from balance
            address stakedTokenAddress = stakedToken.STAKED_TOKEN();
            if (_amount == type(uint256).max) {
                _amount = stakedTokenAddress.getBalance(address(this));
            }
            IBEP20(stakedTokenAddress).transfer(_to, _amount);
        }

        bytes memory logData = abi.encode(
            _from,
            _to,
            _amount
        );
        return (_amount, logData);
    }

    function parseInputs(
        bytes memory _callData
    ) public pure returns (Params memory params) {
        params = abi.decode(_callData, (Params));
    }
}
