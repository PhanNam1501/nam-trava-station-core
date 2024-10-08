// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;
pragma experimental ABIEncoderV2;
import "../ActionBase.sol";
import "../../utils/TokenUtils.sol";

contract TokenBalance is ActionBase {
    using TokenUtils for address;

    struct Params {
        address tokenAddr;
        address holderAddr;
    }

    /// @inheritdoc ActionBase
    function executeAction(
        bytes memory _callData,
        bytes32[] memory,
        uint8[] memory,
        bytes32[] memory
    ) public payable virtual override returns (bytes32) {
        Params memory inputData = parseInputs(_callData);

        return bytes32(inputData.tokenAddr.getBalance(inputData.holderAddr));
    }

    // solhint-disable-next-line no-empty-blocks
    function executeActionDirect(
        bytes memory _callData
    ) public payable override {}

    /// @inheritdoc ActionBase
    function actionType() public pure virtual override returns (uint8) {
        return uint8(ActionType.STANDARD_ACTION);
    }

    //////////////////////////// ACTION LOGIC ////////////////////////////

    function parseInputs(
        bytes memory _callData
    ) public pure returns (Params memory params) {
        params = abi.decode(_callData, (Params));
    }
}
