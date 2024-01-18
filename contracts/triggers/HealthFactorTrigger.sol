// // SPDX-License-Identifier: MIT
// pragma solidity ^0.8.4;

// import "../auth/AdminAuth.sol";
// import "../interfaces/ITrigger.sol";

// /// @title Trigger contract that verifies if the HealthFactor is > 1 or not 
// contract HealthFactorTrigger is ITrigger, AdminAuth {
    
//     /// @param user address of the user whose position we check
//     struct SubParams {
//         address user;
//     }
    
//     /// @dev checks current safety value of a TestStrategh position and triggers if it's in a correct state
//     function isTriggered(bytes memory, bytes memory _subData)
//         public
//         view
//         override
//         returns (bool)
//     {   
//         SubParams memory triggerSubData = parseInputs(_subData);
//         uint256 currVal = getCurrentVal(triggerSubData.user);

//         // Bịa 1 cái trigger chỉ thực hiện khi val của user < 100
//         if(currVal < triggerSubData.val) return true;

//         return false;
//     }

//     function parseInputs(bytes memory _subData) internal pure returns (SubParams memory params) {
//         params = abi.decode(_subData, (SubParams));
//     }
//     function changedSubData(bytes memory _subData) public pure override  returns (bytes memory) {
//     }
    
//     function isChangeable() public pure override returns (bool){
//         return false;
//     }
// }
