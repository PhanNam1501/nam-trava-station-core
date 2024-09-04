// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import "../ActionBase.sol";
import "../../utils/TokenUtils.sol";
import "../../interfaces/IERC20.sol";
import "../../interfaces/cs251/IExchange.sol";

contract swapLiquidity is ActionBase {
    using TokenUtils for address;
    struct Params {
		address exchange;
		address tokenAddr;
		address from;
    uint256 maxSlippage;
		uint256 amount;
    bool checkETH;
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

    params.maxSlippage = _parseParamUint(
			params.maxSlippage,
			_paramMapping[3],
			_subData,
			_returnValues
		);

		params.amount = _parseParamUint(
			params.amount,
			_paramMapping[4],
			_subData,
			_returnValues
		);
    

        uint256 result = _swapLiquidity(
            params.exchange,
            params.tokenAddr,
            params.from,
            params.maxSlippage,
            params.amount,
            params.checkETH
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
			params.exchange,
			params.tokenAddr,
			params.from,
      params.maxSlippage,
			params.amount,
      params.checkETH
		);
		logger.logActionDirectEvent(
			"swapLiquidity",
			abi.encode(ethAmount)
		);
	}


    /// @inheritdoc ActionBase
	function actionType() public pure virtual override returns (uint8) {
		return uint8(ActionType.STANDARD_ACTION);
	}

    function _swapLiquidity(
        address _exchange,
		address _tokenAddr,
		address _from,
    uint256 _maxSlippage,
		uint256 _amount,
    bool _checkETH
    ) internal returns (uint256) {
        

        IExchange exchange = IExchange(_exchange);

        if(_checkETH) {
          uint256 tokenBefore = _tokenAddr.getBalance(address(this));
          exchange.swapETHForTokens{value:_amount}(_maxSlippage);
          _tokenAddr.withdrawTokens(_from, _tokenAddr.getBalance(address(this)) - tokenBefore);
        } else {
          uint256 ethBefore = TokenUtils.BNB_ADDR.getBalance(address(this));
          _tokenAddr.pullTokensIfNeeded(_from, _amount);
          _tokenAddr.approveToken(_exchange, _amount);
          exchange.swapTokensForETH(_amount, _maxSlippage);
          TokenUtils.BNB_ADDR.withdrawTokens(_from, TokenUtils.BNB_ADDR.getBalance(address(this)) - ethBefore);
        }

		return _amount;
    }

    function parseInputs(
		bytes memory _callData
	) public pure returns (Params memory params) {
		params = abi.decode(_callData, (Params));
    }
}

