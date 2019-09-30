pragma solidity 0.5.0;

contract MessagePosting {
	event NewPost(string newMessage);

	string private _message;

	constructor (string memory initMessage) public {
		_message = initMessage;
	}

	function setMessage(string memory newMessage) public {
		_message = newMessage;
	}

	function message() public view returns (string memory) {
		return _message;
	}
}