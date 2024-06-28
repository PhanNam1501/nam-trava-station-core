// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import {IBEP20} from "../interfaces/IBEP20.sol";
import {SafeMath} from "./SafeMath.sol";
import {Address} from "./Address.sol";

/**
 * @title SafeERC20
 * @dev Wrappers around ERC20 operations that throw on failure (when the token
 * contract returns false). Tokens that return no value (and instead revert or
 * throw on failure) are also supported, non-reverting calls are assumed to be
 * successful.
 * To use this library you can add a `using SafeERC20 for IERC20;` statement to your contract,
 * which allows you to call the safe operations as `token.safeTransfer(...)`, etc.
 */
library SafeBEP20 {
    using SafeMath for uint256;
    using Address for address;

     function safeTransfer(IBEP20 token, address to, uint256 value) internal {
        IBEP20(token).transfer(to, value);
    }

    function safeTransferFrom(
        IBEP20 token,
        address from,
        address to,
        uint256 value
    ) internal {
        IBEP20(token).transferFrom(from, to, value);
    }

    /// @dev Edited so it always first approves 0 and then the value, because of non standard tokens
    function safeApprove(
        IBEP20 token,
        address spender,
        uint256 value
    ) internal {
        // _callOptionalReturn(
        //     token,
        //     abi.encodeWithSelector(token.approve.selector, spender, 0)
        // );
        token.approve(spender, 0);
        token.approve(spender, value);
    }

    function safeIncreaseAllowance(
        IBEP20 token,
        address spender,
        uint256 value
    ) internal {
        uint256 newAllowance = token.allowance(address(this), spender).add(
            value
        );
        token.approve(spender, newAllowance);
    }

    function safeDecreaseAllowance(
        IBEP20 token,
        address spender,
        uint256 value
    ) internal {
        uint256 newAllowance = token.allowance(address(this), spender).sub(
            value,
            "SafeBEP20: decreased allowance below zero"
        );
        token.approve(spender, newAllowance);
    }
}
