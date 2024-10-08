// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "./MainnetTravaNFTAuctionAddresses.sol";
import "../../../../../../interfaces/trava/nft/INFTAuctionWithProposal.sol";
import "../../../../../../interfaces/trava/nft/INFTCore.sol";

// import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/// @title Utility functions and data used in travaNFT actions
contract TravaNFTAuctionHelper is MainnetTravaNFTAuctionAddresses {
    uint256 public constant MINIMUM_BID_STEP_PERCENT = 500;
}
