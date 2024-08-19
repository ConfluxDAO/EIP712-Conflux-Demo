// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/EIP712.sol";

contract EIP712Voting is EIP712 {
    using ECDSA for bytes32;

    mapping(uint256 => uint256) public voteCount;

    bytes32 private constant VOTE_TYPEHASH = keccak256("Vote(address voter,uint256 proposal,uint256 nonce)");
    
    mapping(address => uint256) public nonces;

    event VoteCast(address indexed voter, uint256 indexed proposal);

    constructor() EIP712("EIP712Voting", "1") {}

    function castVote(uint256 proposal, bytes memory signature) external {
        bytes32 structHash = keccak256(abi.encode(VOTE_TYPEHASH, msg.sender, proposal, nonces[msg.sender]));
        bytes32 hash = _hashTypedDataV4(structHash);
        address signer = ECDSA.recover(hash, signature);
        
        require(signer == msg.sender, "EIP712Voting: Invalid signature");

        voteCount[proposal]++;
        nonces[signer]++;

        emit VoteCast(signer, proposal);
    }

    function getVoteCount(uint256 proposal) external view returns (uint256) {
        return voteCount[proposal];
    }
}