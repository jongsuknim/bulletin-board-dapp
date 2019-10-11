pragma solidity ^0.5.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

contract NFTMarket {
    using SafeMath for uint256;

    mapping (uint => address payable) public bidders;
    mapping (uint => uint) public bidPrices;

    mapping (address => uint) public pendingWithdrawals;

    address payable owner;

    IERC721 public token;
    uint public feePercent;

    constructor (IERC721 _token) public {
        owner = msg.sender;
        token = _token;
        feePercent = 5; // 5%
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "NFTMarket: only owner is allowed");
        _;
    }

    function changeFeePercent (uint _feePercent) public onlyOwner {
        feePercent = _feePercent;
    }

    function bid(uint _nftIdx) public payable {
        require(token.ownerOf(_nftIdx) != msg.sender, "NFTMarket: token owner is not allowed to bid his own");
        require(msg.value > bidPrices[_nftIdx], "NFTMarket: bid price should be bigger than current one");

        if (bidPrices[_nftIdx] > 0) {
            pendingWithdrawals[bidders[_nftIdx]] = pendingWithdrawals[bidders[_nftIdx]].add(bidPrices[_nftIdx]);
        }

        bidders[_nftIdx] = msg.sender;
        bidPrices[_nftIdx] = msg.value;
    }

    // sell을 하기전에 반드시 approve를 했어야 한다.
    function sell(uint _nftIdx) public {
        require(token.ownerOf(_nftIdx) == msg.sender, "NFTMarket: only token owner is allowed to sell his token");
        require(bidPrices[_nftIdx] > 0, "NFTMarket: no bid");

        address payable bidder = bidders[_nftIdx];
        uint price = bidPrices[_nftIdx];

        uint fee = (price*feePercent)/100;

        bidPrices[_nftIdx] = 0;

        token.transferFrom(msg.sender, bidder, _nftIdx);
        owner.transfer(fee);
        msg.sender.transfer(price-fee);
    }

    function requestPendingWithdrawals() public {
        require(pendingWithdrawals[msg.sender] > 0, "NFTMarket: no pendingWithdrawals");
        uint pendings = pendingWithdrawals[msg.sender];
        pendingWithdrawals[msg.sender] = 0;
        msg.sender.transfer(pendings);
    }
}




