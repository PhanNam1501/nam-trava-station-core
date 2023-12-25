// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "../../../ActionBase.sol";
import "../../../../utils/TokenUtils.sol";
import "./helpers/TravaNFTExpeditionHelper.sol";

contract TravaNFTExpeditionDeploy is ActionBase, TravaNFTExpeditionHelper {
    using TokenUtils for address;

    struct Params {
        address vault;
        uint256 id;
        uint256[] buffWinRateTickets;
        uint256[] buffExpTickets;
        address fromKnight;
        address fromFee;
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

        params.id = _parseParamUint(
            params.id,
            _paramMapping[1],
            _subData,
            _returnValues
        );

        uint256 nWinTickets = params.buffWinRateTickets.length;
        for (uint256 i = 0; i < nWinTickets; i++) {
            params.buffWinRateTickets[i] = _parseParamUint(
                params.buffWinRateTickets[i],
                _paramMapping[i + 2],
                _subData,
                _returnValues
            );
        }

        uint256 nExpTickets = params.buffWinRateTickets.length;
        for (uint256 i = 0; i < nExpTickets; i++) {
            params.buffExpTickets[i] = _parseParamUint(
                params.buffWinRateTickets[i],
                _paramMapping[i + 2 + nWinTickets],
                _subData,
                _returnValues
            );
        }

        params.fromKnight = _parseParamAddr(
            params.fromKnight,
            _paramMapping[2 + nWinTickets + nExpTickets],
            _subData,
            _returnValues
        );

        params.fromFee = _parseParamAddr(
            params.fromFee,
            _paramMapping[3 + nWinTickets + nExpTickets],
            _subData,
            _returnValues
        );

        (uint256 id, bytes memory logData) = _deploy(
            params.vault,
            params.id,
            params.buffWinRateTickets,
            params.buffExpTickets,
            params.fromKnight,
            params.fromFee
        );

        emit ActionEvent("TravaNFTExpeditionDeploy", logData);
        return bytes32(id);
    }

    /// @inheritdoc ActionBase
    function executeActionDirect(
        bytes memory _callData
    ) public payable override {
        Params memory params = parseInputs(_callData);
        (, bytes memory logData) = _deploy(
            params.vault,
            params.id,
            params.buffWinRateTickets,
            params.buffExpTickets,
            params.fromKnight,
            params.fromFee
        );
        logger.logActionDirectEvent("TravaNFTExpeditionDeploy", logData);
    }

    /// @inheritdoc ActionBase
    function actionType() public pure virtual override returns (uint8) {
        return uint8(ActionType.STANDARD_ACTION);
    }

    //////////////////////////// ACTION LOGIC ////////////////////////////

    function _deploy(
        address _vault,
        uint256 _id,
        uint256[] memory _buffWinRateTickets,
        uint256[] memory _buffExpTickets,
        address _fromKnight,
        address _fromFee
    ) internal returns (uint256, bytes memory) {
        if (_fromKnight == address(0)) {
            _fromKnight = address(this);
        }

        if (_fromFee == address(0)) {
            _fromFee = address(this);
        }

        uint256 entryPrice = INFTExpedition(_vault).getExpeditionPrice();

        // uint24[3] memory sourceArray = [100001, 100002, 100003];
        // uint256[] memory ticketIds = new uint256[](sourceArray.length);

        // for (uint i = 0; i < sourceArray.length; i++) {
        //     ticketIds[i] = uint256(sourceArray[i]);
        // }

        uint8[3] memory sourceArrayTickets = [0, 0, 0];
        uint256[] memory arrayTickets = new uint256[](sourceArrayTickets.length);

        for (uint i = 0; i < sourceArrayTickets.length; i++) {
            arrayTickets[i] = uint256(sourceArrayTickets[i]);
        }

        // approve vault to use entry price of governor_token
        address payment_governor = address(PAYMENT_GOVERNOR);

        // pull tokens to proxy so we can use to pay entry price lock
        payment_governor.pullTokensIfNeeded(_fromFee, entryPrice);

        // approve NFT expedition to pull token
        payment_governor.approveToken(_vault, entryPrice);
    
        require(
            INFTCollection(NFT_COLLECTION).ownerOf(_id) == _fromKnight,
            "Owner NFT Knight does not possess token"
        );

        INFTCollection(NFT_COLLECTION).transferFrom(
            _fromKnight,
            address(this),
            _id
        );

        // approve NFT expedition to pull nft
        INFTCollection(NFT_COLLECTION).approve(_vault, _id);

        // transfer tickets from to
        // INFTTicket(NFT_TICKET).safeBatchTransferFrom(
        //     _fromKnight,
        //     address(this),
        //     ticketIds,
        //     _buffWinRateTickets,
        //     ""
        // );
        // INFTTicket(NFT_TICKET).safeBatchTransferFrom(
        //     _fromKnight,
        //     address(this),
        //     ticketIds,
        //     _buffExpTickets,
        //     ""
        // );

        // INFTTicket(NFT_TICKET).safeTransferFrom(
        //     _fromKnight,
        //     address(this),
        //     100001,
        //     _buffWinRateTickets[0] + _buffExpTickets[0],
        //     "0x"
        // );

        // INFTTicket(NFT_TICKET).safeTransferFrom(
        //     _fromKnight,
        //     address(this),
        //     100002,
        //     _buffWinRateTickets[1] + _buffExpTickets[1],
        //     "0x"
        // );

        // INFTTicket(NFT_TICKET).safeTransferFrom(
        //     _fromKnight,
        //     address(this),
        //     100003,
        //     _buffWinRateTickets[2] + _buffExpTickets[2],
        //     "0x"
        // );

        // if (!INFTTicket(NFT_TICKET).isApprovedForAll(address(this), _vault))
        //     INFTTicket(NFT_TICKET).setApprovalForAll(_vault, true);

        INFTExpedition(_vault).deploy(
            _id,
            arrayTickets,
            arrayTickets
        );

        bytes memory logData = abi.encode(
            _vault,
            _id,
            _buffWinRateTickets,
            _buffExpTickets,
            _fromKnight,
            _fromFee
        );
        return (_id, logData);
    }

    function parseInputs(
        bytes memory _callData
    ) public pure returns (Params memory params) {
        params = abi.decode(_callData, (Params));
    }
}
