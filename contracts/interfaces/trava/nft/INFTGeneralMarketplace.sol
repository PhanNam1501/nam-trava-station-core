// SPDX-License-Identifier: agpl-3.0
pragma solidity 0.8.4;
import "../../IERC20.sol";

interface INFTGeneralMarketplace {
    struct Sale {
        address nftSeller;
        uint256 price;
        uint256 paymentOption;
    }

    function paymentGovernors(uint256 option) external returns (IERC20);

    function createSale(
        uint256 _tokenId,
        uint256 _price,
        uint256 _option
    ) external;

    function makeOrder(uint256 _tokenId) external ;

    function cancelSale(uint256 _tokenId) external;

    function getTokenOrder(
        uint256 _tokenId
    ) external view returns (Sale memory);
}
