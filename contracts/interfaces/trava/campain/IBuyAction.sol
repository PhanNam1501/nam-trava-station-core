// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

interface IBuyAction {
    event BuyToken(
        address indexed buyAddr,
        address indexed refAddr,
        uint256 amounts
    );

    function referredToAmounts(
        address referred
    ) external returns (uint256[] memory);

    function buyToken(
        uint256 amountIn,
        uint256 amountOutMin,
        address[] memory path,
        address to,
        uint256 deadline,
        address referred
    ) external returns (uint256[] memory);
}
