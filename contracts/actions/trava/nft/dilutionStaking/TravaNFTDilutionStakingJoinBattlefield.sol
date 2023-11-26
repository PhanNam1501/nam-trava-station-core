// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "../../../ActionBase.sol";
import "../../../../utils/TokenUtils.sol";
import "./helpers/TravaNFTDilutionStakingHelper.sol";

contract TravaNFTDilutionStakingJoinBattlefield is
    ActionBase,
    TravaNFTDilutionStakingHelper
{
    using TokenUtils for address;

    struct Params {
        address vault;
        uint256[] tokenIds;
        uint8 stakeType;
        uint256 lockAmount;
        uint256 timeLock;
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

        uint256 nKnight = params.tokenIds.length;
        for (uint256 i = 0; i < nKnight; i++) {
            params.tokenIds[i] = _parseParamUint(
                params.tokenIds[i],
                _paramMapping[i + 1],
                _subData,
                _returnValues
            );
        }

        params.stakeType = uint8(
            _parseParamUint(
                params.stakeType,
                _paramMapping[1 + nKnight],
                _subData,
                _returnValues
            )
        );

        params.lockAmount = _parseParamUint(
            params.lockAmount,
            _paramMapping[2 + nKnight],
            _subData,
            _returnValues
        );

        params.timeLock = _parseParamUint(
            params.timeLock,
            _paramMapping[3 + nKnight],
            _subData,
            _returnValues
        );

        params.fromKnight = _parseParamAddr(
            params.fromKnight,
            _paramMapping[4 + nKnight],
            _subData,
            _returnValues
        );

        params.fromToken = _parseParamAddr(
            params.fromToken,
            _paramMapping[5 + nKnight],
            _subData,
            _returnValues
        );

        (uint256 stakeType, bytes memory logData) = _join(
            params.vault,
            params.tokenIds,
            params.stakeType,
            params.lockAmount,
            params.timeLock,
            params.fromKnight,
            params.fromToken
        );

        emit ActionEvent("TravaNFTDilutionStakingJoinBattlefield", logData);
        return bytes32(stakeType);
    }

    /// @inheritdoc ActionBase
    function executeActionDirect(
        bytes memory _callData
    ) public payable override {
        Params memory params = parseInputs(_callData);
        (, bytes memory logData) = _join(
            params.vault,
            params.tokenIds,
            params.stakeType,
            params.lockAmount,
            params.timeLock,
            params.fromKnight,
            params.fromToken
        );
        logger.logActionDirectEvent(
            "TravaNFTDilutionStakingJoinBattlefield",
            logData
        );
    }

    /// @inheritdoc ActionBase
    function actionType() public pure virtual override returns (uint8) {
        return uint8(ActionType.STANDARD_ACTION);
    }

    //////////////////////////// ACTION LOGIC ////////////////////////////

    function _join(
        address _vault,
        uint256[] memory _tokenIds,
        uint8 _stakeType,
        uint256 _lockAmount,
        uint256 _timeLock,
        address _fromKnight,
        address _fromToken
    ) internal returns (uint256, bytes memory) {
        if (_fromKnight == address(0)) {
            _fromKnight = address(this);
        }

        if (_fromToken == address(0)) {
            _fromToken = address(this);
        }

        for (uint256 id = 0; id < _tokenIds.length; id++) {
            require(
                INFTCollection(NFT_COLLECTION).ownerOf(id) == _fromKnight,
                "Owner NFT Knight does not possess token"
            );
        }

        for (uint256 id = 0; id < _tokenIds.length; id++) {
            INFTCollection(NFT_COLLECTION).transferFrom(
                _fromKnight,
                address(this),
                _tokenIds[id]
            );
        }

        for (uint256 id = 0; id < _tokenIds.length; id++) {
            require(
                INFTCollection(NFT_COLLECTION).ownerOf(_tokenIds[id]) ==
                    address(this),
                "Owner does not possess token"
            );
            INFTCollection(NFT_COLLECTION).approve(_vault, _tokenIds[id]);
        }

        address lock_token_address = address(TRAVA_TOKEN_LOCK);

        // pull tokens to proxy so we can use to pay lock amount
        lock_token_address.pullTokensIfNeeded(_fromToken, _lockAmount);

        // approve NFT dilution to pull token
        lock_token_address.approveToken(_vault, _lockAmount);

        INFTDilutionStaking.ArmyRank enumValue = INFTDilutionStaking.ArmyRank(uint8(_stakeType));

        INFTDilutionStaking(_vault).joinBattlefield(
            _tokenIds,
            enumValue,
            _lockAmount,
            _timeLock
        );

        bytes memory logData = abi.encode(
            _vault,
            _tokenIds,
            _stakeType,
            _lockAmount,
            _timeLock,
            _fromKnight,
            _fromToken
        );
        return (_stakeType, logData);
    }

    function parseInputs(
        bytes memory _callData
    ) public pure returns (Params memory params) {
        params = abi.decode(_callData, (Params));
    }
}
