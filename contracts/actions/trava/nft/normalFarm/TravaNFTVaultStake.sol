// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import {INFTCollection} from "../../../../interfaces/trava/nft/INFTCollection.sol";

import "../../../ActionBase.sol";
import "./helpers/TravaNFTVaultHelper.sol";

contract TravaNFTVaultStake is ActionBase, TravaNFTVaultHelper {
    struct Params {
        address vault;
        address from;
        uint256 tokenId;
    }

    /// @inheritdoc ActionBase
    function executeAction(
        bytes memory _callData,
        bytes32[] memory _subData,
        uint8[] memory _paramMapping,
        bytes32[] memory _returnValues
    ) public payable virtual override returns (bytes32) {
        Params memory params = parseInputs(_callData);

        params.vault = _parseParamAddr(
            params.vault,
            _paramMapping[0],
            _subData,
            _returnValues
        );

        params.from = _parseParamAddr(
            params.from,
            _paramMapping[1],
            _subData,
            _returnValues
        );

        params.tokenId = _parseParamUint(
            params.tokenId,
            _paramMapping[1],
            _subData,
            _returnValues
        );

        (uint256 tokenId, bytes memory logData) = _stake(
            params.vault,
            params.from,
            params.tokenId
        );

        emit ActionEvent("TravaNFTVaultStake", logData);
        return bytes32(tokenId);
    }

    /// @inheritdoc ActionBase
    function executeActionDirect(
        bytes memory _callData
    ) public payable override {
        Params memory params = parseInputs(_callData);
        (, bytes memory logData) = _stake(
            params.vault,
            params.from,
            params.tokenId
        );
        logger.logActionDirectEvent("TravaNFTVaultStake", logData);
    }

    /// @inheritdoc ActionBase
    function actionType() public pure virtual override returns (uint8) {
        return uint8(ActionType.STANDARD_ACTION);
    }

    //////////////////////////// ACTION LOGIC ////////////////////////////

    function _stake(
        address _vault,
        address _from,
        uint256 _tokenId
    ) internal returns (uint256, bytes memory) {
        if (_from == address(0)) {
            _from = address(this);
        }

        require(
            INFTCollection(NFT_COLLECTION).ownerOf(_tokenId) == _from,
            "Owner does not possess token"
        );

        INFTCollection(NFT_COLLECTION).safeTransferFrom(
            _from,
            address(this),
            _tokenId
        );

        INFTCollection(NFT_COLLECTION).approve(_vault, _tokenId);

        INFTVault(_vault).stake(_tokenId);

        bytes memory logData = abi.encode(_vault, _from, _tokenId);
        return (_tokenId, logData);
    }

    function parseInputs(
        bytes memory _callData
    ) public pure returns (Params memory params) {
        params = abi.decode(_callData, (Params));
    }
}
