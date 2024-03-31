// SPDX-License-Identifier: MIT

pragma solidity =0.8.4;

import "../../../DS/DSMath.sol";
import "../../../utils/TokenUtils.sol";
import "../../../utils/FeeRecipient.sol";
import "../../../utils/TokenPriceHelper.sol";
// import "./MainnetGasFeeAddresses.sol";

contract GasFeeHelper is DSMath, TokenPriceHelper {
    using TokenUtils for address;

    FeeRecipient public constant feeRecipient = FeeRecipient(FEE_RECIPIENT);

    uint256 public constant SANITY_GAS_PRICE = 1000 gwei;

    /// @dev Divider for input amount, 5 bps (50 bps  = 0.5%)
    uint256 public constant MAX_DFS_FEE = 200;

    function calcGasCost(uint256 _gasUsed, address _feeToken, address[] memory path, uint256 _l1GasCostInEth) public view returns (uint256 txCost) {
        uint256 gasPrice = tx.gasprice; 

        // gas price must be in a reasonable range
        if ( tx.gasprice > SANITY_GAS_PRICE) {
            gasPrice = SANITY_GAS_PRICE;
        }

        // can't use more gas than the block gas limit
        if ( _gasUsed > block.gaslimit) {
            _gasUsed = block.gaslimit;
        }


        // calc gas used
        txCost = (_gasUsed * gasPrice) + _l1GasCostInEth;

        // convert to token amount
        if (_feeToken != TokenUtils.BNB_ADDR) {
            uint256 price = getPriceInUSDByDEX(path);
            uint256 tokenDecimals = _feeToken.getTokenDecimals();

            require(tokenDecimals <= 18, "Token decimal too big");

            if (price > 0) {
                txCost = wdiv(txCost, uint256(price)) / (10**(18 - tokenDecimals));
            } else {
                txCost = 0;
            }
        }
    }
}