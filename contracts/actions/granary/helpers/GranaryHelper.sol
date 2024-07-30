// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "../../../interfaces/granary/IGranaryLendingPool.sol";
import "../../../interfaces/granary/IGranaryProtocolDataProvider.sol";
import "./MainnetGranaryAddresses.sol";

/// @title Utility functions and data used in Granary actions
contract GranaryHelper is MainnetGranaryAddresses {
    uint16 public constant GRANARY_REFERRAL_CODE = 0;

    bytes32 public constant DATA_PROVIDER_ID =
        0x0100000000000000000000000000000000000000000000000000000000000000;

    /// @notice Enable/Disable a token as collateral for the specified Granary market
    function enableAsCollateral(
        address _pool_market_provider,
        address _tokenAddr,
        bool _useAsCollateral
    ) public {
        address lendingPool = IGranaryLendingPoolAddressesProvider(_pool_market_provider).getLendingPool();

        IGranaryLendingPool(lendingPool).setUserUseReserveAsCollateral(_tokenAddr, _useAsCollateral);
    }

    /// @notice Fetch the data provider for the specified market
    function getDataProvider(address _pool_market_provider) internal view returns (IGranaryProtocolDataProvider) {
        return
            IGranaryProtocolDataProvider(
                IGranaryLendingPoolAddressesProvider(_pool_market_provider).getAddress(DATA_PROVIDER_ID)
            );
    }

    /// @notice Returns the lending pool contract of the specified market
    function getLendingPool(address _pool_market_provider) internal view returns (IGranaryLendingPool) {
        return IGranaryLendingPool(IGranaryLendingPoolAddressesProvider(_pool_market_provider).getLendingPool());
    }

    function getWholeDebt(address _pool_market_provider, address _tokenAddr, uint _borrowType, address _debtOwner) internal view returns (uint256 debt) {
        uint256 STABLE_ID = 1;
        uint256 VARIABLE_ID = 2;

        IGranaryProtocolDataProvider dataProvider = getDataProvider(_pool_market_provider);
        (, uint256 borrowsStable, uint256 borrowsVariable, , , , , , ) =
            dataProvider.getUserReserveData(_tokenAddr, _debtOwner);

        if (_borrowType == STABLE_ID) {
            debt = borrowsStable;
            return debt;
        } else if (_borrowType == VARIABLE_ID) {
            debt = borrowsVariable;
            return debt;
        }
    }
}
