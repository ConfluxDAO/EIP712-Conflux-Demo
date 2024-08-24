const hre = require("hardhat");
require("dotenv").config();

async function main() {
  const [signer] = await hre.ethers.getSigners();
  
  const contractAddress = "YOUR_DEPLOYED_CONTRACT_ADDRESS";

  const domain = {
    name: "EIP712Voting",
    version: "1",
    chainId: 71, // Conflux eSpace testnet
    verifyingContract: contractAddress,
  };

  const types = {
    Vote: [
      { name: "voter", type: "address" },
      { name: "proposal", type: "uint256" },
      { name: "nonce", type: "uint256" },
    ],
  };

  const EIP712Voting = await hre.ethers.getContractFactory("EIP712Voting");
  const contract = EIP712Voting.attach(contractAddress);

  const nonce = await contract.nonces(signer.address);

  const value = {
    voter: await signer.getAddress(),
    proposal: 1, // 假设我们要为提案1投票
    nonce: nonce,
  };

  // 使用新的 signTypedData 方法
  const signature = await signer.signTypedData(domain, types, value);
  
  console.log("Signer:", await signer.getAddress());
  console.log("Proposal:", value.proposal);
  console.log("Nonce:", nonce.toString());
  console.log("Signature:", signature);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});