// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "../../../../ActionBase.sol";
import "./helpers/TravaNFTAuctionHelper.sol";

contract TravaNFTAuctionEditAuctionPrice is ActionBase, TravaNFTAuctionHelper {
    struct Params {
        uint256 tokenId;
        uint256 newPrice;
    }

    /// @inheritdoc ActionBase
    function executeAction(
        bytes memory _callData,
        bytes32[] memory _subData,
        uint8[] memory _paramMapping,
        bytes32[] memory _returnValues
    ) public payable virtual override returns (bytes32) {
        Params memory params = parseInputs(_callData);

        params.tokenId = _parseParamUint(
            params.tokenId,
            _paramMapping[0],
            _subData,
            _returnValues
        );
        params.newPrice = _parseParamUint(
            params.newPrice,
            _paramMapping[1],
            _subData,
            _returnValues
        );

        (uint256 tokenId, bytes memory logData) = _editAuctionPrice(
            params.tokenId,
            params.newPrice
        );
        emit ActionEvent("TravaNFTAuctionEditAuctionPrice", logData);
        return bytes32(tokenId);
    }

    /// @inheritdoc ActionBase
    function executeActionDirect(
        bytes memory _callData
    ) public payable override {
        Params memory params = parseInputs(_callData);
        (, bytes memory logData) = _editAuctionPrice(
            params.tokenId,
            params.newPrice
        );
        logger.logActionDirectEvent("TravaNFTAuctionEditAuctionPrice", logData);
    }

    /// @inheritdoc ActionBase
    function actionType() public pure virtual override returns (uint8) {
        return uint8(ActionType.STANDARD_ACTION);
    }

    //////////////////////////// ACTION LOGIC ////////////////////////////

    function _editAuctionPrice(
        uint256 _tokenId,
        uint256 _newPrice
    ) internal returns (uint256, bytes memory) {
        // this part is not working . then need approve for sell contract
        INFTAuctionWithProposal(NFT_AUCTION).editAuctionPrice(
            _tokenId,
            _newPrice
        );

        bytes memory logData = abi.encode(
            _tokenId,
            _newPrice
        );

        return (_tokenId, logData);
    }

    function parseInputs(
        bytes memory _callData
    ) public pure returns (Params memory params) {
        params = abi.decode(_callData, (Params));
    }
}
