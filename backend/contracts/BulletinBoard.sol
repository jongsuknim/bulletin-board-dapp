pragma solidity ^0.5.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract BulletinBoard {
    mapping (uint => string) public board;

    IERC721 public token;

    constructor (IERC721 _token) public {
        token = _token;
    }

    function registerText(uint _nftIdx, string memory newText) public {
        require(token.ownerOf(_nftIdx) == msg.sender, "BulletinBoard: only token owner is allowed");

        board[_nftIdx] = newText;
    }
}
