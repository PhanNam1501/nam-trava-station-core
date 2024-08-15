// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import "../../../interfaces/apeswap/IApeswapController.sol";
import "../../../interfaces/apeswap/IAToken.sol";
import "../../../utils/TokenUtils.sol";
import "./MainnetApeswapAddresses.sol";

/// @title Utility functions and data used in Apeswap actions
contract ApeswapHelper is MainnetApeswapAddresses{

    uint256 constant NO_ERROR = 0;
    error ApeswapEnterMarketError();
    error ApeswapExitMarketError();

    // @notice Returns the underlying token address of the given cToken
    function getUnderlyingAddr(address _cTokenAddr) internal returns (address tokenAddr) {
        // cEth has no .underlying() method
        if (_cTokenAddr == A_BNB_ADDR) return TokenUtils.BNB_ADDR;

        tokenAddr = IAToken(_cTokenAddr).underlying();
    }

    /// @notice Enters the Apeswap market so it can be deposited/borrowed
    /// @dev Markets can be entered multiple times, without the code reverting
    /// @param _cTokenAddr CToken address of the token
    function enterMarket(address _cTokenAddr) public {
        address[] memory markets = new address[](1);
        markets[0] = _cTokenAddr;

        uint256[] memory errCodes = IApeswapController(COMPTROLLER_ADDR).enterMarkets(markets);

        if (errCodes[0] != NO_ERROR){
            revert ApeswapEnterMarketError();
        }
    }

    /// @notice Exits the Apeswap market
    /// @param _cTokenAddr CToken address of the token
    function exitMarket(address _cTokenAddr) public {
        if (IApeswapController(COMPTROLLER_ADDR).exitMarket(_cTokenAddr) != NO_ERROR){
            revert ApeswapExitMarketError();
        }
    }
}
