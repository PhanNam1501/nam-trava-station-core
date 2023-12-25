// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import "../../../interfaces/wepiggy/IWePiggyComptroller.sol";
import "../../../interfaces/wepiggy/IPToken.sol";
import "../../../utils/TokenUtils.sol";
import "./MainnetWePiggyAddresses.sol";

/// @title Utility functions and data used in WePiggy actions
contract WePiggyHelper is MainnetWePiggyAddresses{

    uint256 constant NO_ERROR = 0;
    error WePiggyEnterMarketError();
    error WePiggyExitMarketError();

    // @notice Returns the underlying token address of the given pToken
    function getUnderlyingAddr(address _pTokenAddr) internal returns (address tokenAddr) {
        // cEth has no .underlying() method
        if (_pTokenAddr == P_BNB_ADDR) return TokenUtils.WBNB_ADDR;

        tokenAddr = IPToken(_pTokenAddr).underlying();
    }

    /// @notice Enters the WePiggy market so it can be deposited/borrowed
    /// @dev Markets can be entered multiple times, without the code reverting
    /// @param _pTokenAddr PToken address of the token
    function enterMarket(address _pTokenAddr) public {
        address[] memory markets = new address[](1);
        markets[0] = _pTokenAddr;

        uint256[] memory errCodes = IWePiggyComptroller(COMPTROLLER_ADDR_WEPIGGY).enterMarkets(markets);

        if (errCodes[0] != NO_ERROR){
            revert WePiggyEnterMarketError();
        }
    }

    /// @notice Exits the WePiggy market
    /// @param _pTokenAddr PToken address of the token
    function exitMarket(address _pTokenAddr) public {
        if (IWePiggyComptroller(COMPTROLLER_ADDR_WEPIGGY).exitMarket(_pTokenAddr) != NO_ERROR){
            revert WePiggyExitMarketError();
        }
    }
}
