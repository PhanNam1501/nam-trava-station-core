//SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

interface ILiqeeController {
    function hasEnteredMarket(
        address account,
        address iToken
    ) external view returns (bool);

    function getEnteredMarkets(
        address account
    ) external view returns (address[] memory);

    function enterMarkets(
        address[] calldata iTokens
    ) external returns (bool[] memory);

    function enterMarketFromiToken(address _account) external;

    function exitMarkets(
        address[] calldata iTokens
    ) external returns (bool[] memory);

    function hasBorrowed(
        address account,
        address iToken
    ) external view returns (bool);

    function getBorrowedAssets(
        address account
    ) external view returns (address[] memory);
}
