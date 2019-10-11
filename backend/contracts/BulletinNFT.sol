pragma solidity ^0.5.0;

import "@openzeppelin/contracts/token/ERC721/ERC721Full.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721Mintable.sol";

contract BulletinNFT is ERC721Full, ERC721Mintable {
  constructor() ERC721Full("Bulletin NFT", "BNFT") public {
    for (uint i=0; i < 10; i++) {
        _mint(msg.sender, i);
    }
  }
}


