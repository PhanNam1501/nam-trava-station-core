// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import "../ActionBase.sol";
import "../../utils/TokenUtils.sol";
import "../../interfaces/IERC20.sol";
import "../../interfaces/camelot/router/interfaces/ICamelotRouter.sol";

contract addLiquidityETH is ActionBase {
    using TokenUtils for address; 
    struct Params {
        address router;
		address token;
        uint256 amountToken;
        uint256 amountETH;
        uint256 amountTokenmin;
        uint256 amountETHmin;
        address from;
        uint256 deadline;
	}

    /// @inheritdoc ActionBase
    function executeAction(
        bytes memory _callData,
		bytes32[] memory _subData,
		uint8[] memory _paramMapping,
		bytes32[] memory _returnValues
    ) public payable virtual override returns (bytes32) {
        Params memory params = parseInputs(_callData);

        params.router = _parseParamAddr(
			params.router,
			_paramMapping[0],
			_subData,
			_returnValues
		);

        params.token = _parseParamAddr(
			params.token,
			_paramMapping[1],
			_subData,
			_returnValues
		);



        params.amountToken = _parseParamUint(
			params.amountToken,
			_paramMapping[2],
			_subData,
			_returnValues
		);

        params.amountETH = _parseParamUint(
			params.amountETH,
			_paramMapping[3],
			_subData,
			_returnValues
		);

        params.amountTokenmin = _parseParamUint(
			params.amountTokenmin,
			_paramMapping[4],
			_subData,
			_returnValues
		);
        params.amountETHmin = _parseParamUint(
			params.amountETHmin,
			_paramMapping[5],
			_subData,
			_returnValues
		);
    
        params.from = _parseParamAddr(
			params.from,
			_paramMapping[6],
			_subData,
			_returnValues
		);

        params.deadline = _parseParamUint(
			params.deadline,
			_paramMapping[7],
			_subData,
			_returnValues
		);

        uint256 result = _addLiquidity(
            params.router,
            params.token,
            params.amountToken,
            params.amountETH,
            params.amountTokenmin,
            params.amountETHmin,
            params.from,
            params.deadline
        );
        emit ActionEvent("addLiquidityETH", abi.encode(result));
        return bytes32(result);
    }

    /// @inheritdoc ActionBase
    function executeActionDirect(
		bytes memory _callData
	) public payable override {
		Params memory params = parseInputs(_callData);
		uint256 ethAmount = _addLiquidity(
			params.router,
            params.token,
            params.amountToken,
            params.amountETH,
            params.amountTokenmin,
            params.amountETHmin,
            params.from,
            params.deadline
		);
		logger.logActionDirectEvent(
			"addLiquidityETH",
			abi.encode(ethAmount)
		);
	}

    function actionType() public pure virtual override returns (uint8) {
		return uint8(ActionType.STANDARD_ACTION);
	}

    function _addLiquidity(
        address _router,
		address _token,
        uint256 _amountToken,
        uint256 _amountETH,
        uint256 _amountTokenmin,
        uint256 _amountETHmin,
        address _from,
        uint256 _deadline
    ) internal returns (uint256) {
        ICamelotRouter router = ICamelotRouter(_router);
        _token.pullTokensIfNeeded(_from, _amountToken);
        uint256 amounttoken;
        uint256 amounteth;
        uint256 liquidity;
        IERC20(_token).approve(_router, _amountToken);
        (amounttoken, amounteth, liquidity)= router.addLiquidityETH{value: _amountETH}(_token, _amountToken, _amountTokenmin, _amountETHmin, _from, _deadline);
        _token.withdrawTokens(_from, _amountToken - amounttoken);
        if(_amountETH > amounteth) {
            TokenUtils.BNB_ADDR.withdrawTokens(_from, _amountETH - amounteth);
        }
        
        return liquidity;

        
    }

    function parseInputs(
		bytes memory _callData
	) public pure returns (Params memory params) {
		params = abi.decode(_callData, (Params));
    }
}
