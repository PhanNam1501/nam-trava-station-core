//SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "../IERC20.sol";
import "./ILiqeeController.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";

interface IIToken is IERC20{
    function isSupported() external returns (bool);

    function isiToken() external returns (bool);

    //----------------------------------
    //********* User Interface *********
    //----------------------------------
    function mint(address recipient, uint256 mintAmount) external;

    function mint() external payable;
    
    function mintForSelfAndEnterMarket(uint256 mintAmount) external;

    function redeem(address from, uint256 redeemTokens) external;

    function redeemUnderlying(address from, uint256 redeemAmount) external;

    function borrow(uint256 borrowAmount) external;

    function repayBorrow(uint256 repayAmount) external;

    function repayBorrowBehalf(address borrower, uint256 repayAmount) external;

    function repayBorrowBehalf(address borrwer) external payable;

    function liquidateBorrow(
        address borrower,
        uint256 repayAmount,
        address iTokenCollateral
    ) external;

    function flashloan(
        address recipient,
        uint256 loanAmount,
        bytes memory data
    ) external;

    function seize(
        address _liquidator,
        address _borrower,
        uint256 _seizeTokens
    ) external;

    function updateInterest() external returns (bool);

    function controller() external view returns (address);

    function exchangeRateCurrent() external returns (uint256);

    function exchangeRateStored() external view returns (uint256);

    function totalBorrowsCurrent() external returns (uint256);

    function totalBorrows() external view returns (uint256);

    function borrowBalanceCurrent(address _user) external returns (uint256);

    function borrowBalanceStored(address _user) external view returns (uint256);

    function borrowIndex() external view returns (uint256);

    function getAccountSnapshot(
        address _account
    ) external view returns (uint256, uint256, uint256);

    function borrowRatePerBlock() external view returns (uint256);

    function supplyRatePerBlock() external view returns (uint256);

    function underlying() external returns (IERC20Upgradeable);

    function getCash() external view returns (uint256);
}
