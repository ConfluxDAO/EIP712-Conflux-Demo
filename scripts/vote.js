const hre = require("hardhat");

async function main() {
  const contractAddress = "0xDD1184EeC78eD419d948887B8793E64a62f13895";
  const EIP712Voting = await hre.ethers.getContractFactory("EIP712Voting");
  const contract = EIP712Voting.attach(contractAddress);

  const proposal = 1; // 与签名中使用的提案编号相同
  const signature = "0xa1c7e5dfcc91cad8b819471db6cd4ac002812c1f9c8775da16ec42270e745ce564ec315d7418d19ea9df72b521cd70421e557c9dd0db0529667ab203b41823b21c";

  const tx = await contract.castVote(proposal, signature);
  await tx.wait();

  console.log("Vote cast successfully");

  const voteCount = await contract.getVoteCount(proposal);
  console.log("Vote count for proposal", proposal, ":", voteCount.toString());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});