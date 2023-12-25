// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import "../../../utils/TokenUtils.sol";
import "./MainnetLiqeeAddresses.sol";
import "../../../interfaces/liqee/IIToken.sol";
import "../../../interfaces/liqee/ILiqeeController.sol";

/// @title Utility functions and data used in Compound actions
contract LiqeeHelper is MainnetLiqeeAddresses {
    uint256 constant NO_ERROR = 0;
    error LiqeeEnterMarketError();
    error LiqeeExitMarketError();

    // @notice Returns the underlying token address of the given cToken
    function getUnderlyingAddr(
        address _iTokenAddr
    ) internal returns (address tokenAddr) {
        // cEth has no .underlying() method
        if (_iTokenAddr == iBNB) return TokenUtils.WBNB_ADDR;

        tokenAddr = address(IIToken(_iTokenAddr).underlying());
    }

    /// @notice Enters the liqee market so it can be deposited/borrowed
    /// @dev Markets can be entered multiple times, without the code reverting
    /// @param _iTokenAddr CToken address of the token
    function enterMarket(address _iTokenAddr) public {
        address[] memory markets = new address[](1);
        markets[0] = _iTokenAddr;

        bool[] memory errCodes = ILiqeeController(COMPTROLLER_ADDR_LIQEE)
            .enterMarkets(markets);

        if (errCodes[0] != true) {
            revert LiqeeEnterMarketError();
        }
    }

    /// @notice Exits the liqee market
    /// @param _iTokenAddr iToken address of the token
    function exitMarket(address _iTokenAddr) public {
        address[] memory markets = new address[](1);
        markets[0] = _iTokenAddr;

        bool[] memory errCodes = ILiqeeController(COMPTROLLER_ADDR_LIQEE)
            .exitMarkets(markets);
        if (errCodes[0] != true) {
            revert LiqeeExitMarketError();
        }
    }
}
