// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import "../ActionBase.sol";
import "../../utils/TokenUtils.sol";
import "../../interfaces/IERC20.sol";
import "../../interfaces/cs251/IExchange.sol";

contract removeLiquidity is ActionBase {
    using TokenUtils for address;
    struct Params {
		address exchange;
		address tokenAddr;
		address to;
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

        params.to = _parseParamAddr(
			params.to,
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

        uint256 result = _removeLiquidity(
            params.exchange,
            params.tokenAddr,
            params.to,
            params.amountETH
        );
        emit ActionEvent("removeLiquidity", abi.encode(result));
        return bytes32(result);
    }

    /// @inheritdoc ActionBase
    function executeActionDirect(
		bytes memory _callData
	) public payable override {
		Params memory params = parseInputs(_callData);
		uint256 ethAmount = _removeLiquidity(
			params.exchange,
			params.tokenAddr,
			params.to,
			params.amountETH
		);
		logger.logActionDirectEvent(
			"removeLiquidity",
			abi.encode(ethAmount)
		);
	}


    /// @inheritdoc ActionBase
	function actionType() public pure virtual override returns (uint8) {
		return uint8(ActionType.STANDARD_ACTION);
	}

    function _removeLiquidity(
        address _exchange,
		address _tokenAddr,
		address _to,
		uint256 _amountETH
    ) internal returns (uint256) {
        uint256 token_before = _tokenAddr.getBalance(address(this));
        

        IExchange exchange = IExchange(_exchange);

        uint256 total_shares = exchange.getTotalShares();
        
        (uint256 token_reverse, uint256 eth_reverse) = exchange.getLiquidity();

        if (_amountETH == type(uint256).max) {
            uint256 lps = exchange.getlps();
            _amountETH = lps * eth_reverse / total_shares;
        }

        exchange.removeLiquidity(_amountETH);
        _tokenAddr.withdrawTokens(_to, _tokenAddr.getBalance(address(this)) - token_before);
        TokenUtils.BNB_ADDR.withdrawTokens(_to, _amountETH);

		return _amountETH;
    }

    function parseInputs(
		bytes memory _callData
	) public pure returns (Params memory params) {
		params = abi.decode(_callData, (Params));
    }
}

