// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "../../../ActionBase.sol";
import "../../../../utils/TokenUtils.sol";
import "./helpers/TravaNFTExpeditionHelper.sol";
import {INFTCollection} from "../../../../interfaces/trava/nft/INFTCollection.sol";
import {INFTExpedition} from "../../../../interfaces/trava/nft/INFTExpedition.sol";
import {INFTTicket} from "../../../../interfaces/trava/nft/INFTTicket.sol";

contract TravaNFTExpeditionDeploy is ActionBase, TravaNFTExpeditionHelper {
    using TokenUtils for address;

    struct Params {
        address vault;
        uint256 id;
        uint256[] buffWinRateTickets;
        uint256[] buffExpTickets;
        address from;
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

        params.from = _parseParamAddr(
            params.from,
            _paramMapping[2 + nWinTickets + nExpTickets],
            _subData,
            _returnValues
        );

        (uint256 id, bytes memory logData) = _deploy(
            params.vault,
            params.id,
            params.buffWinRateTickets,
            params.buffExpTickets,
            params.from
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
            params.from
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
        address _from
    ) internal returns (uint256, bytes memory) {
        if (_from == address(0)) {
            _from = address(this);
        }

        uint256 entryPrice = INFTExpedition(_vault).getExpeditionPrice();
        // uint256[] memory ticketIds = [100001, 100002, 100003];

        uint24[3] memory sourceArray = [100001, 100002, 100003];
        uint256[] memory ticketIds = new uint256[](sourceArray.length);

        for (uint i = 0; i < sourceArray.length; i++) {
            ticketIds[i] = uint256(sourceArray[i]);
        }

        // approve vault to use entry price of governor_token
        address payment_governor = address(PAYMENT_GOVERNOR);
        payment_governor.approveToken(_vault, entryPrice );

        INFTCollection(NFT_COLLECTION).transferFrom(_from, address(this), _id);

        require(
            INFTCollection(NFT_COLLECTION).ownerOf(_id) == address(this),
            "Owner does not possess token"
        );

        INFTCollection(NFT_COLLECTION).approve(_vault, _id);

        // transfer tickets from to
        INFTTicket(NFT_TICKET).safeBatchTransferFrom(
            _from,
            address(this),
            ticketIds,
            _buffWinRateTickets,
            ""
        );
        INFTTicket(NFT_TICKET).safeBatchTransferFrom(
            _from,
            address(this),
            ticketIds,
            _buffExpTickets,
            ""
        );

        INFTTicket(NFT_TICKET).setApprovalForAll(_vault, true);

        INFTExpedition(_vault).deploy(
            _id,
            _buffWinRateTickets,
            _buffExpTickets
        );

        bytes memory logData = abi.encode(
            _vault,
            _id,
            _buffWinRateTickets,
            _buffExpTickets,
            _from
        );
        return (_id, logData);
    }

    function parseInputs(
        bytes memory _callData
    ) public pure returns (Params memory params) {
        params = abi.decode(_callData, (Params));
    }
}
