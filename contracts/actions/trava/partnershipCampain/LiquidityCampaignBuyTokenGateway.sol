// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import "../../ActionBase.sol";
import "./helpers/LiquidityCampaignHelper.sol";

/// @title Supply a token to an Trava market
contract LiquidityCampaignBuyTokenGateway is ActionBase, LiquidityCampaignHelper {
    using TokenUtils for address;

    struct Params {
        address campaignAction;
        uint256 amountIn;
        uint256 amountOutMin;
        address[] path;
        address to;
        uint256 deadline;
        address referred;
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

        params.campaignAction = _parseParamAddr(
            params.campaignAction,
            _paramMapping[0],
            _subData,
            _returnValues
        );

        params.amountIn = _parseParamUint(
            params.amountIn,
            _paramMapping[1],
            _subData,
            _returnValues
        );

        params.amountOutMin = _parseParamUint(
            params.amountOutMin,
            _paramMapping[2],
            _subData,
            _returnValues
        );

        uint256 nPaths = params.path.length;
        for (uint256 i = 0; i < nPaths; i++) {
            params.path[i] = _parseParamAddr(
                params.path[i],
                _paramMapping[i + 3],
                _subData,
                _returnValues
            );
        }

        params.to = _parseParamAddr(
            params.to,
            _paramMapping[3 + nPaths],
            _subData,
            _returnValues
        );

        params.deadline = _parseParamUint(
            params.deadline,
            _paramMapping[4 + nPaths],
            _subData,
            _returnValues
        );

        params.referred = _parseParamAddr(
            params.referred,
            _paramMapping[5 + nPaths],
            _subData,
            _returnValues
        );

        params.from = _parseParamAddr(
            params.from,
            _paramMapping[6 + nPaths],
            _subData,
            _returnValues
        );

        (uint256 amountsBuy, bytes memory logData) = _buyTokenGateway(
            params.campaignAction,
            params.amountIn,
            params.amountOutMin,
            params.path,
            params.to,
            params.deadline,
            params.referred,
            params.from
        );
        emit ActionEvent("LiquidityCampaignBuyTokenGateway", logData);
        return bytes32(amountsBuy);
    }

    /// @inheritdoc ActionBase
    function executeActionDirect(
        bytes memory _callData
    ) public payable override {
        Params memory params = parseInputs(_callData);
        (, bytes memory logData) = _buyTokenGateway(
            params.campaignAction,
            params.amountIn,
            params.amountOutMin,
            params.path,
            params.to,
            params.deadline,
            params.referred,
            params.from
        );
        logger.logActionDirectEvent("LiquidityCampaignBuyTokenGateway", logData);
    }

    /// @inheritdoc ActionBase
    function actionType() public pure virtual override returns (uint8) {
        return uint8(ActionType.STANDARD_ACTION);
    }

    //////////////////////////// ACTION LOGIC ////////////////////////////

    function _buyTokenGateway(
        address _campaignAction,
        uint256 _amountIn,
        uint256 _amountOutMin,
        address[] memory _path,
        address _to,
        uint256 _deadline,
        address _referred,
        address _from
    ) internal returns (uint256 amountsBuy, bytes memory) {
        if (_from == address(0)) {
            _from = address(this);
        }

        if (_to == address(0)) {
            _to = address(this);
        }

        if (_amountIn == type(uint256).max) {
            _amountIn = _path[0].getBalance(_from);
        }

        // require(_path[0] == TokenUtils.WBNB_ADDR, "Invalid action");
        if(_path[0] == TokenUtils.BNB_ADDR) {
            TokenUtils.depositWbnb(_amountIn);
            _path[0] = TokenUtils.WBNB_ADDR;
        } else {
            _path[0].pullTokensIfNeeded(_from, _amountIn);
        }

        _path[0].approveToken(_campaignAction, _amountIn);

        uint256 _pathLength = _path.length;
        if(_path[_pathLength - 1] == TokenUtils.BNB_ADDR) {
            _path[_pathLength - 1] = TokenUtils.WBNB_ADDR;
        }

        uint256[] memory amountsBuyArr = IBuyTokenWithReference(_campaignAction).buyToken(
            _amountIn,
            _amountOutMin,
            _path,
            address(this),
            _deadline,
            _referred
        );

        bytes memory logData = abi.encode(
            _campaignAction,
            _amountIn,
            _amountOutMin,
            _path,
            _to,
            _deadline,
            _referred,
            _from
        );

        amountsBuy = amountsBuyArr[amountsBuyArr.length-1];

        

        return (amountsBuy, logData);
    }

    function parseInputs(
        bytes memory _callData
    ) public pure returns (Params memory params) {
        params = abi.decode(_callData, (Params));
    }
}
