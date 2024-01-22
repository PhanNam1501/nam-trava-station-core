// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import "../../../utils/TokenUtils.sol";
import "./MainnetCreamAddresses.sol";
import "../../../interfaces/cream/ICToken.sol";
import "../../../interfaces/cream/ICreamComptroller.sol";

/// @title Utility functions and data used in Compound actions
contract CreamHelper is MainnetCreamAddresses{
    uint256 constant NO_ERROR = 0;
    error CreamEnterMarketError();
    error CreamExitMarketError();

    // @notice Returns the underlying token address of the given cToken
    function getUnderlyingAddr(address _cTokenAddr) internal returns (address tokenAddr) {
        // cEth has no .underlying() method
        if (_cTokenAddr == crBNB ) return TokenUtils.BNB_ADDR;

        tokenAddr = ICToken(_cTokenAddr).underlying();
    }

    /// @notice Enters the Cream market so it can be deposited/borrowed
    /// @dev Markets can be entered multiple times, without the code reverting
    /// @param _cTokenAddr CToken address of the token
    function enterMarket(address _cTokenAddr) public {
        address[] memory markets = new address[](1);
        markets[0] = _cTokenAddr;

        uint256[] memory errCodes = ICreamComptroller(COMPTROLLER_ADDR_CREAM).enterMarkets(markets);

        if (errCodes[0] != NO_ERROR){
            revert CreamEnterMarketError();
        }
    }

    /// @notice Exits the Cream market
    /// @param _cTokenAddr CToken address of the token
    function exitMarket(address _cTokenAddr) public {
        if (ICreamComptroller(COMPTROLLER_ADDR_CREAM).exitMarket(_cTokenAddr) != NO_ERROR){
            revert CreamExitMarketError();
        }
    }
}
