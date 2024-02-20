// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "../auth/AdminAuth.sol";
import "../interfaces/ITrigger.sol";

/// @title Trigger contract that verifies if blocktimestamp in timestamp A and timestamp B
contract TimeTrigger is ITrigger, AdminAuth {
    
    /// @param startTime start time of the trigger
    /// @param endTime end time of the trigger
    struct SubParams {
        uint256 startTime;
        uint256 endTime;
    }
    
    /// @dev checks current safety value of a TimeTrigger position and triggers if it's in a correct state
    function isTriggered(bytes memory, bytes memory _subData)
        public
        view
        override
        returns (bool)
    {   
        SubParams memory triggerSubData = parseInputs(_subData);
        if(triggerSubData.startTime <= block.timestamp && block.timestamp <= triggerSubData.endTime) return true;
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
