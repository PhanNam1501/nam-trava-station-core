// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "../../../interfaces/granary/IGranaryLendingPool.sol";
import "../../../interfaces/granary/IGranaryProtocolDataProvider.sol";
import "./MainnetGranaryAddresses.sol";

/// @title Utility functions and data used in Granary actions
contract GranaryHelper is MainnetGranaryAddresses {
    uint16 public constant GRANARY_REFERRAL_CODE = 64;

    bytes32 public constant DATA_PROVIDER_ID =
        0x0100000000000000000000000000000000000000000000000000000000000000;

    /// @notice Enable/Disable a token as collateral for the specified Granary market
    function enableAsCollateral(
        address _market,
        address _tokenAddr,
        bool _useAsCollateral
    ) public {
        address lendingPool = IGranaryLendingPoolAddressesProvider(_market).getLendingPool();

        IGranaryLendingPool(lendingPool).setUserUseReserveAsCollateral(_tokenAddr, _useAsCollateral);
    }

    /// @notice Switches the borrowing rate mode (stable/variable) for the user
    // function switchRateMode(
    //     address _market,
    //     address _tokenAddr,
    //     uint256 _rateMode
    // ) public {
    //     address lendingPool = IRadiantLendingPoolAddressesProvider(_market).getLendingPool();

    //     IRadiantLendingPool(lendingPool).swapBorrowRateMode(_tokenAddr, _rateMode);
    // }

    /// @notice Fetch the data provider for the specified market
    function getDataProvider(address _market) internal view returns (IGranaryProtocolDataProvider) {
        return
            IGranaryProtocolDataProvider(
                IGranaryLendingPoolAddressesProvider(_market).getAddress(DATA_PROVIDER_ID)
            );
    }

    /// @notice Returns the lending pool contract of the specified market
    function getLendingPool(address _market) internal view returns (IGranaryLendingPool) {
        return IGranaryLendingPool(IGranaryLendingPoolAddressesProvider(_market).getLendingPool());
    }

    function getWholeDebt(address _market, address _tokenAddr, uint _borrowType, address _debtOwner) internal view returns (uint256 debt) {
        uint256 STABLE_ID = 1;
        uint256 VARIABLE_ID = 2;

        IGranaryProtocolDataProvider dataProvider = getDataProvider(_market);
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
