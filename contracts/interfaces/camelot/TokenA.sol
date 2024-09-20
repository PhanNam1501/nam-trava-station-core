// SPDX-License-Identifier: WTFPL
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// Your token contract
contract TokenA is Ownable, ERC20 {
	string private  constant _symbol = "A";
	string private  constant _name = "TokenA";

	bool private mint_enabled = true;

	constructor() ERC20(_name, _symbol) {}

	function mint(uint amount) public onlyOwner {
		require(mint_enabled, "Minting disabled");
		_mint(msg.sender, amount);
	}

	function disable_mint() public onlyOwner {
		require(mint_enabled, "Minting already disable");
		mint_enabled = false;
	}

	function enable_mint() public onlyOwner {
		require(!mint_enabled, "Minting already enable");
		mint_enabled = true;
	}
}