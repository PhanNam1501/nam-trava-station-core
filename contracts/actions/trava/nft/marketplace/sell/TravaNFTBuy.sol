// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "../../../../ActionBase.sol";
import "../../helpers/TravaNFTHelper.sol";
import "../../../../../utils/TokenUtils.sol";

contract TravaNFTBuy is ActionBase, TravaNFTHelper {
    using TokenUtils for address;

    struct Params {
        uint256 tokenId;
        uint256 price;
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

        params.from = _parseParamAddr(
            params.from,
            _paramMapping[2],
            _subData,
            _returnValues
        );
        params.to = _parseParamAddr(
            params.to,
            _paramMapping[3],
            _subData,
            _returnValues
        );

        (uint256 tokenId, bytes memory logData) = _makeOrder(
            params.tokenId,
            params.price,
            params.from,
            params.to
        );
        emit ActionEvent("TravaNFTBuy", logData);
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
        logger.logActionDirectEvent("TravaNFTBuy", logData);
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

        IMarketplace marketPlace = IMarketplace(NFT_MARKETPLACE);

        require(
            // marketPlace.getTokenOrder(_tokenId).nftSeller != _from &&
                marketPlace.getTokenOrder(_tokenId).nftSeller != address(this),
            "Seller or proxy's seller can't execute action to buy own NFT"
        );

        require(
            _price == marketPlace.getTokenOrder(_tokenId).price,
            "Invalid price"
        );

        address travaToken = TRAVA_TOKEN;

        travaToken.pullTokensIfNeeded(_from, _price);

        // approve trava to buy nft
        travaToken.approveToken(address(marketPlace), _price);

        marketPlace.makeOrder(_tokenId, _price);

        if (_to != address(this)) {
            INFTCore(NFT_CORE).transferFrom(address(this), _to, _tokenId);
        }

        bytes memory logData = abi.encode(_tokenId, _from);
        return (_tokenId, logData);
    }

    function parseInputs(
        bytes memory _callData
    ) public pure returns (Params memory params) {
        params = abi.decode(_callData, (Params));
    }
}
