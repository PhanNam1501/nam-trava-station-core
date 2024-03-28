// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "../../ActionBase.sol";
import "../../../utils/TokenUtils.sol";

interface IEthStaking {
    function stake(
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

/// @title Stake ORAI into EthStaking contract
contract OraiStake is ActionBase {
    using TokenUtils for address;

    struct Params {
        address oraiStakingContract;
        address tokenAddr;
        uint256 amount;
        uint256 timeStamp;
        uint256 exchangeRate;
        bytes signature;
        address from;
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

        (uint256 returnAmount, ) = _stake(
            params.oraiStakingContract,
            params.tokenAddr,
            params.amount,
            params.timeStamp,
            params.exchangeRate,
            params.signature,
            params.from,
            params.onBehalf
        );
        return bytes32(returnAmount);
    }

    /// @inheritdoc ActionBase
    function executeActionDirect(
        bytes memory _callData
    ) public payable override {
        Params memory params = parseInputs(_callData);
        _stake(
            params.oraiStakingContract,
            params.tokenAddr,
            params.amount,
            params.timeStamp,
            params.exchangeRate,
            params.signature,
            params.from,
            params.onBehalf
        );
    }

    /// @inheritdoc ActionBase
    function actionType() public pure virtual override returns (uint8) {
        return uint8(ActionType.STANDARD_ACTION);
    }

    //////////////////////////// ACTION LOGIC ////////////////////////////

    /// @notice Stake ORAI tokens into EthStaking contract
    /// @param _oraiStakingContract Address of the EthStaking contract
    /// @param _amount Amount of ORAI tokens to stake
    /// @param _timeStamp Timestamp for signature verification
    /// @param _exchangeRate Exchange rate for signature verification
    /// @param _signature Signature for signature verification
    function _stake(
        address _oraiStakingContract,
        address _tokenAddr,
        uint256 _amount,
        uint256 _timeStamp,
        uint256 _exchangeRate,
        bytes memory _signature,
        address _from,
        address _onBehalf

    ) internal returns (uint256, bytes memory) {
        IEthStaking EthStaking = IEthStaking(_oraiStakingContract);

        // default to onBehalf of proxy
        if (_onBehalf == address(0)) {
            _onBehalf = address(this);
        }

        // pull tokens to proxy so we can supply
        _tokenAddr.pullTokensIfNeeded(_from, _amount);

        // approve trava pool to pull tokens
        _tokenAddr.approveToken(address(EthStaking), _amount);

        // Stake ORAI
        EthStaking.stake(
            _amount,
            _timeStamp,
            _exchangeRate,
            _signature
        );

        bytes memory logData = abi.encode(
            _oraiStakingContract,
            _tokenAddr,
            _amount,
            _timeStamp,
            _exchangeRate,
            _signature,
            _from,
            _onBehalf
        );
        return (_amount, logData);
    }

    function parseInputs(
        bytes memory _callData
    ) public pure returns (Params memory params) {
        params = abi.decode(_callData, (Params));
    }
}
