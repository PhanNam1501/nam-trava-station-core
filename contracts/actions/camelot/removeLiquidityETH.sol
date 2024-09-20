// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import "../ActionBase.sol";
import "../../utils/TokenUtils.sol";
import "../../utils/SafeBEP20.sol";
import "../../interfaces/camelot/core/interfaces/IUniswapV2ERC20.sol";
import "../../interfaces/camelot/router/interfaces/ICamelotRouter.sol";


contract removeLiquidityETH is ActionBase {
    using TokenUtils for address;
    struct Params {
        address router;
		address token;
        address tokenpair;
		uint256 liquidity;
        uint256 amountAmin;
        uint256 amountBmin;
        uint256 deadline;
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

        params.tokenpair = _parseParamAddr(
			params.tokenpair,
			_paramMapping[2],
			_subData,
			_returnValues
		);



		params.liquidity = _parseParamUint(
			params.liquidity,
			_paramMapping[3],
			_subData,
			_returnValues
		);
        params.amountAmin = _parseParamUint(
			params.amountAmin,
			_paramMapping[4],
			_subData,
			_returnValues
		);
        params.amountBmin = _parseParamUint(
			params.amountBmin,
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
        params.from = _parseParamAddr(
			params.from,
			_paramMapping[7],
			_subData,
			_returnValues
		);

        uint256 result = _removeLiquidity(
            params.router,
            params.token,
            params.tokenpair,
            params.liquidity,
            params.amountAmin,
            params.amountBmin,
            params.deadline,
            params.from
        );
        emit ActionEvent("removeLiquidityETH", abi.encode(result));
        return bytes32(result);
    }

    /// @inheritdoc ActionBase
    function executeActionDirect(
		bytes memory _callData
	) public payable override {
		Params memory params = parseInputs(_callData);
		uint256 ethAmount = _removeLiquidity(
			params.router,
            params.token,
            params.tokenpair,
            params.liquidity,
            params.amountAmin,
            params.amountBmin,
            params.deadline,
            params.from
		);
		logger.logActionDirectEvent(
			"removeLiquidity",
			abi.encode(ethAmount)
		);
	}

    function actionType() public pure virtual override returns (uint8) {
		return uint8(ActionType.STANDARD_ACTION);
	}

    function _removeLiquidity(
        address _router,
		address _token,
        address _tokenpair,
		uint256 _liquidity,
        uint256 _amountAmin,
        uint256 _amountBmin,
        uint256 _deadline,
        address _from
    ) internal returns (uint256) {
        ICamelotRouter router = ICamelotRouter(_router);
		if (_liquidity == type(uint256).max) {
        _liquidity = IUniswapV2ERC20(_tokenpair).balanceOf(_from);
    }
        IUniswapV2ERC20(_tokenpair).approve(_router, _liquidity);
        IUniswapV2ERC20(_tokenpair).transferFrom(_from,address(this), _liquidity);
		uint256 amountA;
		uint256 amountB;
        (amountA,amountB) = router.removeLiquidityETH(_token,_liquidity,_amountAmin,_amountBmin,_from,_deadline);
        return amountA;
    }

    function parseInputs(
		bytes memory _callData
	) public pure returns (Params memory params) {
		params = abi.decode(_callData, (Params));
    }
}
