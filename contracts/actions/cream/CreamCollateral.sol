// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import "./helpers/CreamHelper.sol";
import "../ActionBase.sol";

contract CreamCollateral is ActionBase, CreamHelper {
    struct Params {
        address[] cTokens;
        bool[] enableAsColl;
    }

    /// @inheritdoc ActionBase
    function executeAction(
        bytes memory _callData,
        bytes32[] memory _subData,
        uint8[] memory _paramMapping,
        bytes32[] memory _returnValues
    ) public payable virtual override returns (bytes32) {
        Params memory params = parseInputs(_callData);

        uint256 nCTokens = params.cTokens.length;

        for (uint i = 0; i < nCTokens; i++) {
            params.cTokens[i] = _parseParamAddr(
                params.cTokens[i],
                _paramMapping[i],
                _subData,
                _returnValues
            );
        }

        bytes memory logData = _creamCollateral(
            params.cTokens,
            params.enableAsColl
        );

        emit ActionEvent("CreamCollateral", logData);
        return bytes32(0);
    }

    /// @inheritdoc ActionBase
    function executeActionDirect(
        bytes memory _callData
    ) public payable override {
        Params memory params = parseInputs(_callData);

        bytes memory logData = _creamCollateral(
            params.cTokens,
            params.enableAsColl
        );
        logger.logActionDirectEvent("CreamCollateral", logData);
    }

    /// @inheritdoc ActionBase
    function actionType() public pure virtual override returns (uint8) {
        return uint8(ActionType.STANDARD_ACTION);
    }

    //////////////////////////// ACTION LOGIC ////////////////////////////

    /// @param _cTokens Address of the cToken we'll set collateral or not
    /// @param _enableAsColl If the supply asset should be collateral
    function _creamCollateral(
        address[] memory _cTokens,
        bool[] memory _enableAsColl
    ) internal returns (bytes memory) {

        for (uint256 i = 0; i < _cTokens.length; i++){
            if (_enableAsColl[i]){
                enterMarket(_cTokens[i]);
            }else{
                exitMarket(_cTokens[i]);
            }
        }

        bytes memory logData = abi.encode(
            _cTokens,
            _enableAsColl
        );
        return (logData);
    }

    function parseInputs(
        bytes memory _callData
    ) public pure returns (Params memory params) {
        params = abi.decode(_callData, (Params));
    }
}
