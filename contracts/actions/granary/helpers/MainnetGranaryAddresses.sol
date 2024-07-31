// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

contract MainnetGranaryAddresses {
    //     Go to: Radiant: Deployer
    // https://bscscan.com/txs?a=0x225c6084086f83ece4bc747403f292a7d324fd2e
    // The last Transactions of this and find "Radiant: Pool Address Provider"
    // Final: 0x63764769dA006395515c3f8afF9c91A809eF6607
    // Check: getLendingPool in Read Contract
    address internal constant GRANARY_POOL_ADDRESS_PROVIDER = 0x12c26138b666360AB2B7A1B149dF9Cf6642CDfBf;
}