const hre = require("hardhat");

async function main() {
  const EIP712Storage = await hre.ethers.getContractFactory("EIP712Storage");
  const eip712Storage = await EIP712Storage.deploy();

  await eip712Storage.deployed();

  console.log("EIP712Storage deployed to:", eip712Storage.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});