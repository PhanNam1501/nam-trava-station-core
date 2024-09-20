// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import "../ActionBase.sol";
import "../../utils/TokenUtils.sol";
import "../../interfaces/IERC20.sol";
import "../../interfaces/cs251/IExchange.sol";

contract addLiquidity is ActionBase {
    using TokenUtils for address;
    struct Params {
		address exchange;
		address tokenAddr;
		address from;
		uint256 amountETH;
        
	}

    /// @inheritdoc ActionBase
    function executeAction(
        bytes memory _callData,
		bytes32[] memory _subData,
		uint8[] memory _paramMapping,
		bytes32[] memory _returnValues
    ) public payable virtual override returns (bytes32) {
        Params memory params = parseInputs(_callData);

        params.exchange = _parseParamAddr(
			params.exchange,
			_paramMapping[0],
			_subData,
			_returnValues
		);

        params.tokenAddr = _parseParamAddr(
			params.tokenAddr,
			_paramMapping[1],
			_subData,
			_returnValues
		);

        params.from = _parseParamAddr(
			params.from,
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

        uint256 result = _addLiquidity(
            params.exchange,
            params.tokenAddr,
            params.from,
            params.amountETH
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
			params.exchange,
			params.tokenAddr,
			params.from,
			params.amountETH
		);
		logger.logActionDirectEvent(
			"addLiquidity",
			abi.encode(ethAmount)
		);
	}


    /// @inheritdoc ActionBase
	function actionType() public pure virtual override returns (uint8) {
		return uint8(ActionType.STANDARD_ACTION);
	}

    function _addLiquidity(
        address _exchange,
		address _tokenAddr,
		address _from,
		uint256 _amountETH
    ) internal returns (uint256) {
        IExchange exchange = IExchange(_exchange);
        (uint256 token_reverse, uint256 eth_reverse) = exchange.getLiquidity();
        uint256 tokenAmount = _amountETH * token_reverse / eth_reverse;
        _tokenAddr.pullTokensIfNeeded(_from, tokenAmount);
        IERC20(_tokenAddr).approve(_exchange, tokenAmount);
        exchange.addLiquidity{value:_amountETH}();
		return tokenAmount;
    }

    function parseInputs(
		bytes memory _callData
	) public pure returns (Params memory params) {
		params = abi.decode(_callData, (Params));
    }
}

