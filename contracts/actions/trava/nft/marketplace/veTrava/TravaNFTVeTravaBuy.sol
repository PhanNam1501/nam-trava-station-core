// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "../../../../ActionBase.sol";
import "../../../../../utils/TokenUtils.sol";
import "./helpers/TravaNFTVeTravaHelper.sol";

contract TravaNFTVeTravaBuy is ActionBase, TravaNFTVeTravaHelper {
    using TokenUtils for address;

    struct Params {
        uint256 tokenId;
        uint256 price;
        uint256 option;
        address from;
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

        params.price = _parseParamUint(
            params.price,
            _paramMapping[1],
            _subData,
            _returnValues
        );

        params.option = _parseParamUint(
            params.option,
            _paramMapping[2],
            _subData,
            _returnValues
        );

        params.from = _parseParamAddr(
            params.from,
            _paramMapping[3],
            _subData,
            _returnValues
        );
        params.to = _parseParamAddr(
            params.to,
            _paramMapping[4],
            _subData,
            _returnValues
        );

        (uint256 tokenId, bytes memory logData) = _makeOrder(
            params.tokenId,
            params.price,
            params.from,
            params.to
        );
        emit ActionEvent("TravaNFTVeTravaBuy", logData);
        return bytes32(tokenId);
    }

    /// @inheritdoc ActionBase
    function executeActionDirect(
        bytes memory _callData
    ) public payable override {
        Params memory params = parseInputs(_callData);
        (, bytes memory logData) = _makeOrder(
            params.tokenId,
            params.price,
            params.from,
            params.to
        );
        logger.logActionDirectEvent("TravaNFTVeTravaBuy", logData);
    }

    /// @inheritdoc ActionBase
    function actionType() public pure virtual override returns (uint8) {
        return uint8(ActionType.STANDARD_ACTION);
    }

    //////////////////////////// ACTION LOGIC ////////////////////////////

    function _makeOrder(
        uint256 _tokenId,
        uint256 _price,
        address _from,
        address _to
    ) internal returns (uint256, bytes memory) {
        if (_from == address(0)) {
            _from == address(this);
        }

        INFTGeneralMarketplace marketPlace = INFTGeneralMarketplace(
            VE_TRAVA_MARKETPLACE_ADDRESS
        );

        INFTGeneralMarketplace.Sale memory sale = marketPlace.getTokenOrder(_tokenId);
        require(
            // marketPlace.getTokenOrder(_tokenId).nftSeller != _from &&
            sale.nftSeller != address(this),
            "Seller or proxy's seller can't execute action to buy own NFT"
        );

        require(_price == sale.price, "Invalid price");

        address paymentGovernace = address(marketPlace.paymentGovernors(sale.paymentOption));

        paymentGovernace.pullTokensIfNeeded(_from, _price);

        // approve trava to buy nft
        paymentGovernace.approveToken(address(marketPlace), _price);

        marketPlace.makeOrder(_tokenId);

        if(_to != address(this)) {
            IVotingEscrow(VE_TRAVA_ADDRESS).transferFrom(address(this), _to, _tokenId);
        }

        bytes memory logData = abi.encode(_tokenId, _price);
        return (_tokenId, logData);
    }

    function parseInputs(
        bytes memory _callData
    ) public pure returns (Params memory params) {
        params = abi.decode(_callData, (Params));
    }
}
