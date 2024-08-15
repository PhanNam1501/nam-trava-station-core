// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

abstract contract IApeswapOracle {
    /// @notice Indicator that this is a PriceOracle contract (for inspection)
    bool public constant isPriceOracle = true;

    /**
     * OLA_ADDITIONS : This function
     * @notice Get the price an asset
     * @param asset The asset to get the price of
     * @return The asset price mantissa (scaled by 1e18).
     *  Zero means the price is unavailable.
     */
    function getAssetPrice(address asset) virtual external view returns (uint);

    /**
     * OLA_ADDITIONS : This function
     * @notice Get the price update timestamp for the asset
     * @param asset The asset address for price update timestamp retrieval.
     * @return Last price update timestamp for the asset
     */
    function getAssetPriceUpdateTimestamp(address asset) virtual external view returns (uint);

    /**
      * @notice Get the underlying price of a cToken asset
      * @param cToken The cToken to get the underlying price of
      * @return The underlying asset price mantissa (scaled by 1e18).
      *  Zero means the price is unavailable.
      */
    function getUnderlyingPrice(address cToken) virtual external view returns (uint);

    /**
     * OLA_ADDITIONS : This function
     * @notice Get the price update timestamp for the cToken underlying
     * @param cToken The cToken address for price update timestamp retrieval.
     * @return Last price update timestamp for the cToken underlying asset
     */
    function getUnderlyingPriceUpdateTimestamp(address cToken) virtual external view returns (uint);
}
