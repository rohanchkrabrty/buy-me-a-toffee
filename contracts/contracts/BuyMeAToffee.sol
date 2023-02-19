//SPDX-License-Identifier: Unlicense

pragma solidity ^0.8.0;

// BuyMeAToffee deployed to: 0x7c0e14A6548faC5C4eE6DeB14527c375ACEb2ca4

contract BuyMeAToffee {
    struct User {
        address profileAddress;
        string name;
        string description;
        uint256 balance;
        uint256 createdAt;
    }

    struct Memo {
        address from;
        uint256 timestamp;
        string name;
        string message;
        bool isAnon;
    }

    event NewMemo(
        address indexed from,
        uint256 timestamp,
        string name,
        string message,
        bool isAnon
    );
    mapping(address => User) users;
    mapping(address => Memo[]) memos;

    constructor() {
    }

    function isValidUser(address _userAddress) public view returns (bool){
        User memory user= this.getUser(_userAddress);
        return user.createdAt > 0;
    }

    function getUser(address _userAddress) public view returns (User memory){
        return users[_userAddress];
    }

    function addUser(string memory _name, string memory _description) public {
        require(!this.isValidUser(msg.sender),"User is already present");
        users[msg.sender] = User(msg.sender,_name,_description,0,block.timestamp);
    }

    function getMemos(address _userAddress) public view returns (Memo[] memory) {
        return memos[_userAddress];
    }

    function buyToffee(address _to,string memory _name, string memory _message, bool _isAnon) public payable {
        // Must send more than 0 ETH for a toffee.
        require(msg.value > 0, "can't buy toffee for free!");
        require(this.isValidUser(_to),"Receiver is not a user");

        // add value to receiver balance
        users[_to].balance += msg.value;

        // add memo
        memos[_to].push(Memo(
            msg.sender,
            block.timestamp,
            _name,
            _message,
            _isAnon
        ));

        // emit NewMemo event
        emit NewMemo(
            msg.sender,
            block.timestamp,
            _name,
            _message,
            _isAnon
        );
    }

    function withdraw(address payable _withdrawalAddress) public {
        require(this.isValidUser(msg.sender),"User is not present");
        uint256 amountToTransfer = this.getUser(msg.sender).balance;
        require(amountToTransfer > 0, "No amount to withdraw");
        _withdrawalAddress.transfer(amountToTransfer);
        users[msg.sender].balance =0;
    }
}
