// SPDX-License-Identifier: agpl-3.0
pragma solidity ^0.8.0;

interface IExchange {
    function addLiquidity() external payable;
    function removeLiquidity(uint amountETH) external payable;
    function swapTokensForETH(uint amountTokens, uint max_exchange_rate)external payable;
    function swapETHForTokens(uint max_exchange_rate)external payable;
	function createPool(uint amountTokens) external payable;
    function getlps(address user) external view returns(uint);
    function getTotalShares() external view returns(uint);
    function getlps() external view returns(uint);
	function token() external view returns (address);
    function getLiquidity() external view returns (uint, uint);


}