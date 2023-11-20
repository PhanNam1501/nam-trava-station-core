//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.4;

interface INFTTicket {
  function balanceOf(address account, uint256 id)
    external
    view
    returns (uint256);

  function balanceOfBatch(address[] memory accounts, uint256[] memory ids)
    external
    view
    returns (uint256[] memory);

  function burn(uint256 id, uint256 amount) external;

  function getItemName(uint256 _itemId) external view returns (string memory);

  function initialize(
    string memory name_,
    string memory symbol_,
    string memory uri_
  ) external;

  function isApprovedForAll(address account, address operator)
    external
    view
    returns (bool);

  function mint(
    address recipient,
    uint256 id,
    uint256 amount
  ) external;

  function mintBatch(
    address recipient,
    uint256[] memory ids,
    uint256[] memory amounts
  ) external;

  function name() external view returns (string memory);

  function onERC1155BatchReceived(
    address operator,
    address from,
    uint256[] memory ids,
    uint256[] memory values,
    bytes memory data
  ) external returns (bytes4);

  function onERC1155Received(
    address operator,
    address from,
    uint256 id,
    uint256 value,
    bytes memory data
  ) external returns (bytes4);

  function owner() external view returns (address);

  function renounceOwnership() external;
 
  function safeBatchTransferFrom(
    address from,
    address to,
    uint256[] memory ids,
    uint256[] memory amounts,
    bytes memory data
  ) external;

  function safeTransferFrom(
    address from,
    address to,
    uint256 id,
    uint256 amount,
    bytes memory data
  ) external;

  function setApprovalForAll(address operator, bool approved) external;

  function setItemName(uint256 _itemId, string memory _name) external;

  function setWhitelist(address _whitelist) external;

  function supportsInterface(bytes4 interfaceId) external view returns (bool);

  function symbol() external view returns (string memory);

  function tokenURI(uint256 _itemId) external view returns (string memory);

  function transferOwnership(address newOwner) external;

  function uri(uint256) external view returns (string memory);

  function totalSupply(uint256 id) external view returns (uint256);
}
