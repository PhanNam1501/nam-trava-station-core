// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import "../ActionBase.sol";
import "../../utils/TokenUtils.sol";
import "../../interfaces/IERC20.sol";
import "../../interfaces/camelot/router/interfaces/ICamelotRouter.sol";

contract swapTokenforToken is ActionBase {
    using TokenUtils for address;
    struct Params {
        address router;
        address[] path;
        uint256 amountIn;
        uint256 amountOutMin;
        address to;
        address referrer;
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

        params.path = _parseParamAddrArray(
			params.path,
			_paramMapping[1],
			_subData,
			_returnValues
		);
    
        params.amountIn = _parseParamUint(
			params.amountIn,
			_paramMapping[2],
			_subData,
			_returnValues
		);
		params.amountOutMin = _parseParamUint(
			params.amountOutMin,
			_paramMapping[3],
			_subData,
			_returnValues
		);
        params.to = _parseParamAddr(
			params.to,
			_paramMapping[4],
			_subData,
			_returnValues
		);
        params.referrer = _parseParamAddr(
			params.referrer,
			_paramMapping[5],
			_subData,
			_returnValues
		);
        params.deadline = _parseParamUint(
			params.deadline,
			_paramMapping[6],
			_subData,
			_returnValues
		);
        

        uint256 result = _swapLiquidity(
            params.router,
            params.path,
            params.amountIn,
            params.amountOutMin,
            params.to,
            params.referrer,
            params.deadline
        );
        emit ActionEvent("swapLiquidity", abi.encode(result));
        return bytes32(result);
    }

    /// @inheritdoc ActionBase
    function executeActionDirect(
		bytes memory _callData
	) public payable override {
		Params memory params = parseInputs(_callData);
		uint256 ethAmount = _swapLiquidity(
			params.router,
            params.path,
            params.amountIn,
            params.amountOutMin,
            params.to,
            params.referrer,
            params.deadline
		);
		logger.logActionDirectEvent(
			"swapLiquidity",
			abi.encode(ethAmount)
		);
	}

    function actionType() public pure virtual override returns (uint8) {
		return uint8(ActionType.STANDARD_ACTION);
	}

    function _swapLiquidity(
        address _router,
        address[] memory _path,
        uint256 _amountIn,
        uint256 _amountOutMin,
        address _to,
        address _referrer,
        uint256 _deadline
    ) internal returns (uint256) {
        ICamelotRouter router = ICamelotRouter(_router);
        if (_amountIn == type(uint256).max) {
            _amountIn = IERC20(_path[0]).balanceOf(msg.sender);
        }
        _path[0].pullTokensIfNeeded(msg.sender, _amountIn);
        IERC20(_path[0]).approve(_router, _amountIn);
        router.swapExactTokensForTokensSupportingFeeOnTransferTokens(_amountIn,_amountOutMin,_path,_to,_referrer,_deadline);
        return _amountIn;
    }

    function parseInputs(
		bytes memory _callData
	) public pure returns (Params memory params) {
		params = abi.decode(_callData, (Params));
    }

    function _parseParamAddrArray(
    address[] memory _param,
    uint8 _paramMapping,
    bytes32[] memory _subData,
    bytes32[] memory _returnValues
) internal view returns (address[] memory) {
    if (_paramMapping == 0) {
        return _param;
    }

    // Otherwise, parse the array based on _paramMapping
    address[] memory parsedArray = new address[](_param.length);
    for (uint256 i = 0; i < _param.length; i++) {
        parsedArray[i] = _parseParamAddr(_param[i], _paramMapping, _subData, _returnValues);
    }
    return parsedArray;
}
}
