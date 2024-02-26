// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "../../ActionBase.sol";
import "../../../utils/TokenUtils.sol";

interface IEthStaking {
    function unstake(
        uint256 amount,
        uint256 timeStamp,
        uint256 exchangeRate,
        bytes memory signature
    ) external returns (uint256);

    function verify(
        uint256 timeStamp,
        uint256 exchangeRate,
        bytes memory signature
    ) external view returns (bool);
}

/// @title Unstake ORAI from EthStaking contract
contract OraiUnstake is ActionBase {
    using TokenUtils for address;

    struct Params {
        address oraiStakingContract;
        address tokenAddr;
        uint256 amount;
        uint256 timeStamp;
        uint256 exchangeRate;
        bytes signature;
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
        params.amount = _parseParamUint(
            params.amount,
            _paramMapping[1],
            _subData,
            _returnValues
        );
        params.timeStamp = _parseParamUint(
            params.timeStamp,
            _paramMapping[2],
            _subData,
            _returnValues
        );
        params.exchangeRate = _parseParamUint(
            params.exchangeRate,
            _paramMapping[3],
            _subData,
            _returnValues
        );

        uint256 returnAmount = _unstake(
            params.oraiStakingContract,
            params.tokenAddr,
            params.amount,
            params.timeStamp,
            params.exchangeRate,
            params.signature,
            params.onBehalf
        );
        return bytes32(returnAmount);
    }

    /// @inheritdoc ActionBase
    function executeActionDirect(
        bytes memory _callData
    ) public payable override {
        Params memory params = parseInputs(_callData);
        _unstake(
            params.oraiStakingContract,
            params.tokenAddr,
            params.amount,
            params.timeStamp,
            params.exchangeRate,
            params.signature,
            params.onBehalf
        );
    }

    /// @inheritdoc ActionBase
    function actionType() public pure virtual override returns (uint8) {
        return uint8(ActionType.STANDARD_ACTION);
    }

    //////////////////////////// ACTION LOGIC ////////////////////////////

    /// @notice Unstake ORAI tokens from EthStaking contract
    /// @param _oraiStakingContract Address of the EthStaking contract
    /// @param _amount Amount of ORAI tokens to unstake
    /// @param _timeStamp Timestamp for signature verification
    /// @param _exchangeRate Exchange rate for signature verification
    /// @param _signature Signature for signature verification
    function _unstake(
        address _oraiStakingContract,
        address _tokenAddr,
        uint256 _amount,
        uint256 _timeStamp,
        uint256 _exchangeRate,
        bytes memory _signature,
        address _onBehalf
    ) internal returns (uint256) {
        IEthStaking EthStaking = IEthStaking(_oraiStakingContract);

        // default to onBehalf of proxy
        if (_onBehalf == address(0)) {
            _onBehalf = address(this);
        }
        
        _tokenAddr.approveToken(address(EthStaking), _amount);

        // Unstake ORAI
        return EthStaking.unstake(
            _amount,
            _timeStamp,
            _exchangeRate,
            _signature
        );
    }

    function parseInputs(
        bytes memory _callData
    ) public pure returns (Params memory params) {
        params = abi.decode(_callData, (Params));
    }
}
