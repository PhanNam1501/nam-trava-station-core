// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "../../../../../interfaces/trava/nft/IFarming.sol";
import "../../helpers/TravaNFTHelper.sol";
import "./MainnetTravaNFTHeuristicFarmingAddresses.sol";
import "../../../../../interfaces/trava/nft/INFTCollection.sol";

/// @title Utility functions and data used in travaNFT actions
contract TravaNFTHeuristicFarmingHelper is
    TravaNFTHelper,
    MainnetTravaNFTHeuristicFarmingAddresses
{

}
