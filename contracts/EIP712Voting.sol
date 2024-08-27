// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/EIP712.sol";

contract EIP712Voting is EIP712 {
    using ECDSA for bytes32;

    mapping(uint256 => uint256) public voteCount;

    // TypeHash for the Vote struct used in EIP-712 signing
    bytes32 private constant VOTE_TYPEHASH =
        keccak256("Vote(address voter,uint256 proposal,uint256 nonce)");

    mapping(address => uint256) public nonces;

    event VoteCast(address indexed voter, uint256 indexed proposal);

    constructor() EIP712("EIP712Voting", "1") {}

    function castVote(uint256 proposal, bytes memory signature) external {
        // Generate the hash of the structured data
        bytes32 structHash = keccak256(
            abi.encode(
                VOTE_TYPEHASH, // Type hash of the Vote struct, ensures data structure consistency
                msg.sender, // Address of the voter
                proposal, // ID of the proposal being voted on
                nonces[msg.sender] // Current nonce of the voter, prevents replay attacks
            )
        );
        // structHash now contains a unique identifier of the vote data

        // Generate the final hash using the EIP-712 standard's _hashTypedDataV4 function
        bytes32 hash = _hashTypedDataV4(structHash);
        // hash is now the final hash combining the structured data hash and the domain separator
        // This final hash is used to verify the EIP-712 signature
        // The domain separator includes contract name, version, chain ID, and contract address,
        // ensuring the signature is only valid for this specific contract and network
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
