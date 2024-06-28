// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import "../auth/AdminAuth.sol";
import "../interfaces/ITrigger.sol";
import "../utils/TransientStorage.sol";

interface IV2Pair {
    function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast);
    function token0() external view returns (address);
    function token1() external view returns (address);
}

contract OnchainPriceTrigger is ITrigger, AdminAuth {
    enum PriceState { ABOVE, BELOW }

    /// @param pair address of the  V2 pair contract
    /// @param tokenIn address of the token you want the price of
    /// @param triggerPrice price that represents the triggerable point
    /// @param state represents if we want the current state to be higher or lower than triggerPrice param
    struct SubParams {
        address pair;
        address tokenIn;
        uint256 triggerPrice;
        uint8 state;
    }

    function isTriggered(bytes memory, bytes memory _subData)
        public
        override
        view
        returns (bool)
    {   
        SubParams memory triggerSubData = parseInputs(_subData);

        uint256 currentPrice = getPrice(triggerSubData.pair, triggerSubData.tokenIn);

        if (currentPrice == 0) return false;


        if (PriceState(triggerSubData.state) == PriceState.ABOVE) {
            if (currentPrice > triggerSubData.triggerPrice) return true;
        }

        if (PriceState(triggerSubData.state) == PriceState.BELOW) {
            if (currentPrice < triggerSubData.triggerPrice) return true;
        }

        return false;
    }

    function getPrice(address pairAddress, address tokenIn) internal view returns (uint256 price) {
        IV2Pair pair = IV2Pair(pairAddress);

        (uint112 reserve0, uint112 reserve1,) = pair.getReserves();
        address token0 = pair.token0();
        address token1 = pair.token1();

        if (tokenIn == token0) {
            if (reserve1 > 0) {
                price = uint256(reserve0) * 1e18 / uint256(reserve1);
            } else {
                price = 0;
            }
        } else if (tokenIn == token1) {
            if (reserve0 > 0) {
                price = uint256(reserve1) * 1e18 / uint256(reserve0);
            } else {
                price = 0;
            }
        } else {
            price = 0; // Token not in pair
        }
    }

    function parseInputs(bytes memory _subData) internal pure returns (SubParams memory params) {
        params = abi.decode(_subData, (SubParams));
    }

    function changedSubData(bytes memory _subData) public pure override returns (bytes memory) {
    }
    
    function isChangeable() public pure override returns (bool) {
        return false;
    }
}