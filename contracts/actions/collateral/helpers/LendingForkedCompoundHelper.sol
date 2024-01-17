// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import "../../../interfaces/compound/ComptrollerInterface.sol";
import "./MainnetLendingForkedCompoundAddresses.sol";

contract LendingForkedCompoundHelper is MainnetLendingForkedCompoundAddresses{
    uint256 constant NO_ERROR = 0;
    
    error CompEnterMarketError();
    error CompExitMarketError();

    /// @notice Enters the Compound market so it can be deposited/borrowed
    /// @dev Markets can be entered multiple times, without the code reverting
    /// @param _cTokenAddr CToken address of the token
    function enterMarket(address _comptroller, address _cTokenAddr) public {
        address[] memory markets = new address[](1);
        markets[0] = _cTokenAddr;

        uint256[] memory errCodes = ComptrollerInterface(_comptroller).enterMarkets(markets);

        if (errCodes[0] != NO_ERROR){
            revert CompEnterMarketError();
        }
    }

    /// @notice Exits the Compound market
    /// @param _cTokenAddr CToken address of the token
    function exitMarket(address _comptroller, address _cTokenAddr) public {
        if (ComptrollerInterface(_comptroller).exitMarket(_cTokenAddr) != NO_ERROR){
            revert CompExitMarketError();
        }
    }

}