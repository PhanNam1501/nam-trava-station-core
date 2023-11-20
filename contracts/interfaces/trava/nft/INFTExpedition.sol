// SPDX-License-Identifier: agpl-3.0
pragma solidity 0.8.4;

interface INFTExpedition {
    
    struct ExpeditionInfo {
        address sender;
        uint256 deployTimestamp;
    }

    function getExpeditionPrice() external view returns (uint256);

    function deploy(
        uint256 _collectionId,
        uint256[] memory _buffWinRateTickets,
        uint256[] memory _buffExpTickets
    ) external;

    function abandon(uint256 _collectionId) external;

    function withdraw(uint256 _collectionId) external;
}
