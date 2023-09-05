// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "../../../../utils/TokenUtils.sol";
import "../../../ActionBase.sol";
import "./helpers/TravaNFTAuctionHelper.sol";

contract TravaNFTAuctionFinalizeAuction is ActionBase, TravaNFTAuctionHelper {
    using TokenUtils for address;

    struct Params {
        uint256 tokenId;
        address to;
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

        params.to = _parseParamAddr(
            params.to,
            _paramMapping[1],
            _subData,
            _returnValues
        );

        (uint256 tokenId, bytes memory logData) = _finalizeAuction(
            params.tokenId,
            params.to
        );
        emit ActionEvent("TravaNFTAuctionFinalizeAuction", logData);
        return bytes32(tokenId);
    }

    /// @inheritdoc ActionBase
    function executeActionDirect(
        bytes memory _callData
    ) public payable override {
        Params memory params = parseInputs(_callData);
        (, bytes memory logData) = _finalizeAuction(
            params.tokenId,
            params.to
        );
        logger.logActionDirectEvent("TravaNFTAuctionFinalizeAuction", logData);
    }

    /// @inheritdoc ActionBase
    function actionType() public pure virtual override returns (uint8) {
        return uint8(ActionType.STANDARD_ACTION);
    }

    //////////////////////////// ACTION LOGIC ////////////////////////////

    function _finalizeAuction(
        uint256 _tokenId,
        address _to
    ) internal returns (uint256, bytes memory) {
      
        // this part is not working . then need approve for sell contract
        INFTAuctionWithProposal(NFT_AUCTION).finalizeAuction(_tokenId);

        if(_to != address(this)) {
            INFTCore(NFT_COLLECTION).transferFrom(address(this), _to, _tokenId);
        }
        bytes memory logData = abi.encode(_tokenId, _to);

        return (_tokenId, logData);
    }

    function parseInputs(
        bytes memory _callData
    ) public pure returns (Params memory params) {
        params = abi.decode(_callData, (Params));
    }
}
