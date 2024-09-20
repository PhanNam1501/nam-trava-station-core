// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import "../ActionBase.sol";
import "../../utils/TokenUtils.sol";
import "../../interfaces/IERC20.sol";
import "../../interfaces/camelot/router/interfaces/ICamelotRouter.sol";

contract addLiquidityC is ActionBase {
    using TokenUtils for address;
    struct Params {
        address router;
		address tokenA;
		address tokenB;
        uint256 amountA;
		uint256 amountB;
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

        params.tokenA = _parseParamAddr(
			params.tokenA,
			_paramMapping[1],
			_subData,
			_returnValues
		);

        params.tokenB = _parseParamAddr(
			params.tokenB,
			_paramMapping[2],
			_subData,
			_returnValues
		);

        params.amountA = _parseParamUint(
			params.amountA,
			_paramMapping[3],
			_subData,
			_returnValues
		);
		params.amountB = _parseParamUint(
			params.amountB,
			_paramMapping[4],
			_subData,
			_returnValues
		);
        params.amountAmin = _parseParamUint(
			params.amountAmin,
			_paramMapping[5],
			_subData,
			_returnValues
		);
        params.amountBmin = _parseParamUint(
			params.amountBmin,
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
        params.from = _parseParamAddr(
			params.from,
			_paramMapping[8],
			_subData,
			_returnValues
		);

        uint256 result = _addLiquidity(
            params.router,
            params.tokenA,
            params.tokenB,
            params.amountA,
            params.amountB,
            params.amountAmin,
            params.amountBmin,
            params.deadline,
            params.from
        );
        emit ActionEvent("addLiquidity", abi.encode(result));
        return bytes32(result);
    }

    /// @inheritdoc ActionBase
    function executeActionDirect(
		bytes memory _callData
	) public payable override {
		Params memory params = parseInputs(_callData);
		uint256 ethAmount = _addLiquidity(
			params.router,
            params.tokenA,
            params.tokenB,
            params.amountA,
            params.amountB,
            params.amountAmin,
            params.amountBmin,
            params.deadline,
            params.from
		);
		logger.logActionDirectEvent(
			"addLiquidity",
			abi.encode(ethAmount)
		);
	}

    function actionType() public pure virtual override returns (uint8) {
		return uint8(ActionType.STANDARD_ACTION);
	}

    function _addLiquidity(
        address _router,
		address _tokenA,
		address _tokenB,
        uint256 _amountA,
		uint256 _amountB,
        uint256 _amountAmin,
        uint256 _amountBmin,
        uint256 _deadline,
        address _from
    ) internal returns (uint256) {
        ICamelotRouter router = ICamelotRouter(_router);
        _tokenA.pullTokensIfNeeded(_from, _amountA);
        _tokenB.pullTokensIfNeeded(_from, _amountB);
        IERC20(_tokenA).approve(_router, _amountA);
        IERC20(_tokenB).approve(_router, _amountB);
		uint256 amountA;
		uint256 amountB;
		uint256 liquidity;
        (amountA,amountB,liquidity) = router.addLiquidity(_tokenA,_tokenB,_amountA,_amountB,_amountAmin,_amountBmin,_from,_deadline);
		_tokenA.withdrawTokens(_from, _amountA - amountA);
		_tokenB.withdrawTokens(_from, _amountB - amountB);
        return liquidity;
    }

    function parseInputs(
		bytes memory _callData
	) public pure returns (Params memory params) {
		params = abi.decode(_callData, (Params));
    }
}
