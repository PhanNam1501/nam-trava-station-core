// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "../../../../ActionBase.sol";
import "./helpers/TravaNFTVeTravaHelper.sol";

contract TravaNFTVeTravaCancelSale is ActionBase, TravaNFTVeTravaHelper {
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

        (uint256 tokenId, bytes memory logData) = _cancelSale(
            params.tokenId,
            params.to
        );
        emit ActionEvent("TravaNFTVeTravaCancelSale", logData);
        return bytes32(tokenId);
    }

    /// @inheritdoc ActionBase
    function executeActionDirect(
        bytes memory _callData
    ) public payable override {
        Params memory params = parseInputs(_callData);
        (, bytes memory logData) = _cancelSale(params.tokenId, params.to);
        logger.logActionDirectEvent("TravaNFTVeTravaCancelSale", logData);
    }

    /// @inheritdoc ActionBase
    function actionType() public pure virtual override returns (uint8) {
        return uint8(ActionType.STANDARD_ACTION);
    }

    //////////////////////////// ACTION LOGIC ////////////////////////////

    function _cancelSale(
        uint256 _tokenId,
        address _to
    ) internal returns (uint256, bytes memory) {
        INFTGeneralMarketplace marketPlace = INFTGeneralMarketplace(
            VE_TRAVA_MARKETPLACE_ADDRESS
        );

        require(
            marketPlace.getTokenOrder(_tokenId).nftSeller == address(this),
            "Smart wallet proxy does not possess token"
        );

        // this part is not working . then need approve for sell contract
        marketPlace.cancelSale(_tokenId);

        if (_to != address(this)) {
            IVotingEscrow(VE_TRAVA_ADDRESS).transferFrom(
                address(this),
                _to,
                _tokenId
            );
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
