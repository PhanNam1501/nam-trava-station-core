// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "../../ActionBase.sol";

interface IEthStaking {
    function withdrawUnstaked() external;
}

/// @title Withdraw Unstaked ORAI from EthStaking contract
contract OraiWithdrawUnstaked is ActionBase {

    struct Params {
        address oraiStakingContract;
        address onBehalf;
    }

    /// @inheritdoc ActionBase
    function executeAction(
        bytes memory _callData,
        bytes32[] memory _subData,
        uint8[] memory _paramMapping,
        bytes32[] memory _returnValues
    ) public payable virtual override returns (bytes32) {
        Params memory params = parseInputs(_callData);
        params.oraiStakingContract = _parseParamAddr(
            params.oraiStakingContract,
            _paramMapping[0],
            _subData,
            _returnValues
        );
         params.onBehalf = _parseParamAddr(
            params.onBehalf,
            _paramMapping[1],
            _subData,
            _returnValues
        );

        _withdrawUnstaked(
            params.oraiStakingContract,
            params.onBehalf
        );
        return bytes32(0); // Return value can be ignored in this case
    }

    /// @inheritdoc ActionBase
    function executeActionDirect(
        bytes memory _callData
    ) public payable override {
        Params memory params = parseInputs(_callData);
        _withdrawUnstaked(
            params.oraiStakingContract,
            params.onBehalf
        );
    }

    /// @inheritdoc ActionBase
    function actionType() public pure virtual override returns (uint8) {
        return uint8(ActionType.STANDARD_ACTION);
    }

    //////////////////////////// ACTION LOGIC ////////////////////////////

    /// @notice Withdraw Unstaked ORAI tokens from EthStaking contract
    /// @param _oraiStakingContract Address of the EthStaking contract
    function _withdrawUnstaked(address _oraiStakingContract, address _onBehalf) internal {
        IEthStaking EthStaking = IEthStaking(_oraiStakingContract);

        // default to onBehalf of proxy
        if (_onBehalf == address(0)) {
            _onBehalf = address(this);
        }

        // Withdraw Unstaked ORAI
        EthStaking.withdrawUnstaked();
    }

    function parseInputs(
        bytes memory _callData
    ) public pure returns (Params memory params) {
        params = abi.decode(_callData, (Params));
    }
}
