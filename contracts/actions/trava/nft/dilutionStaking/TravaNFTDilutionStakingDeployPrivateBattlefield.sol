// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "../../../ActionBase.sol";
import "../../../../utils/TokenUtils.sol";
import "./helpers/TravaNFTDilutionStakingHelper.sol";

contract TravaNFTDilutionStakingDeployPrivateBattlefield is
    ActionBase,
    TravaNFTDilutionStakingHelper
{
    using TokenUtils for address;

    struct Params {
        address vault;
        uint256 tokenId;
        uint256 stakeAmount;
        address fromKnight;
        address fromToken;
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

        params.tokenId = _parseParamUint(
            params.tokenId,
            _paramMapping[1],
            _subData,
            _returnValues
        );

        params.stakeAmount = _parseParamUint(
            params.stakeAmount,
            _paramMapping[2],
            _subData,
            _returnValues
        );

        params.fromKnight = _parseParamAddr(
            params.fromKnight,
            _paramMapping[3],
            _subData,
            _returnValues
        );

        params.fromToken = _parseParamAddr(
            params.fromToken,
            _paramMapping[4],
            _subData,
            _returnValues
        );

        (uint256 tokenId, bytes memory logData) = _deploy(
            params.vault,
            params.tokenId,
            params.stakeAmount,
            params.fromKnight,
            params.fromToken
        );

        emit ActionEvent(
            "TravaNFTDilutionStakingDeployPrivateBattlefield",
            logData
        );
        return bytes32(tokenId);
    }

    /// @inheritdoc ActionBase
    function executeActionDirect(
        bytes memory _callData
    ) public payable override {
        Params memory params = parseInputs(_callData);
        (, bytes memory logData) = _deploy(
            params.vault,
            params.tokenId,
            params.stakeAmount,
            params.fromKnight,
            params.fromToken
        );
        logger.logActionDirectEvent(
            "TravaNFTDilutionStakingDeployPrivateBattlefield",
            logData
        );
    }

    /// @inheritdoc ActionBase
    function actionType() public pure virtual override returns (uint8) {
        return uint8(ActionType.STANDARD_ACTION);
    }

    //////////////////////////// ACTION LOGIC ////////////////////////////

    function _deploy(
        address _vault,
        uint256 _tokenId,
        uint256 _stakeAmount,
        address _fromKnight,
        address _fromToken
    ) internal returns (uint256, bytes memory) {
        if (_fromKnight == address(0)) {
            _fromKnight = address(this);
        }

        if (_fromToken == address(0)) {
            _fromToken = address(this);
        }

        require(
            INFTCollection(NFT_COLLECTION).ownerOf(_tokenId) == _fromKnight,
            "Owner NFT Knight does not possess token"
        );

        INFTCollection(NFT_COLLECTION).transferFrom(
            _fromKnight,
            address(this),
            _tokenId
        );

        require(
            INFTCollection(NFT_COLLECTION).ownerOf(_tokenId) == address(this),
            "Owner does not possess token"
        );
        
        INFTCollection(NFT_COLLECTION).approve(_vault, _tokenId);

        address lock_token_address = address(TRAVA_TOKEN_LOCK);

        // pull tokens to proxy so we can use to pay stake amount
        lock_token_address.pullTokensIfNeeded(_fromToken, _stakeAmount);

        // approve NFT dilution to pull token
        lock_token_address.approveToken(_vault, _stakeAmount);

        INFTDilutionStaking(_vault).deployPrivateBattlefield(
            _tokenId,
            _stakeAmount
        );

        bytes memory logData = abi.encode(
            _vault,
            _tokenId,
            _stakeAmount,
            _fromKnight,
            _fromToken
        );
        return (_tokenId, logData);
    }

    function parseInputs(
        bytes memory _callData
    ) public pure returns (Params memory params) {
        params = abi.decode(_callData, (Params));
    }
}
