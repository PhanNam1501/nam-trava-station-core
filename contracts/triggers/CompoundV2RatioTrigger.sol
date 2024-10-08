// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import "../auth/AdminAuth.sol";
import "../actions/compound/helpers/CompRatioHelper.sol";
import "../interfaces/ITrigger.sol";
import "../utils/TransientStorage.sol";
import "./helpers/TriggerHelper.sol";

/// @title Trigger contract that verifies if the Compound position went over/under the subbed ratio
contract CompoundV2RatioTrigger is ITrigger, AdminAuth, CompRatioHelper, TriggerHelper {

    enum RatioState { OVER, UNDER }

    TransientStorage public constant tempStorage = TransientStorage(TRANSIENT_STORAGE);
    
    /// @param user address of the user whose position we check
    /// @param ratio ratio that represents the triggerable point
    /// @param state represents if we want the current state to be higher or lower than ratio param
    struct SubParams {
        address user;
        uint256 ratio;
        uint8 state;
    }
    
    /// @dev checks current safety ratio of a Compound position and triggers if it's in a correct state
    function isTriggered(bytes memory, bytes memory _subData)
        public
        override
        returns (bool)
    {   
        SubParams memory triggerSubData = parseInputs(_subData);

        uint256 currRatio = getSafetyRatio(triggerSubData.user);

        if (currRatio == 0) return false;

        tempStorage.setBytes32("COMP_V2_RATIO", bytes32(currRatio));

        if (RatioState(triggerSubData.state) == RatioState.OVER) {
            if (currRatio > triggerSubData.ratio) return true;
        }

        if (RatioState(triggerSubData.state) == RatioState.UNDER) {
            if (currRatio < triggerSubData.ratio) return true;
        }

        return false;
    }

    function parseInputs(bytes memory _subData) internal pure returns (SubParams memory params) {
        params = abi.decode(_subData, (SubParams));
    }
    function changedSubData(bytes memory _subData) public pure override  returns (bytes memory) {
    }
    
    function isChangeable() public pure override returns (bool){
        return false;
    }

}
