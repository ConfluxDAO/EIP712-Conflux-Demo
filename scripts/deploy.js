const hre = require("hardhat");

async function main() {
  const EIP712Storage = await hre.ethers.getContractFactory("EIP712Voting");
  const eip712Storage = await EIP712Storage.deploy();

  // 等待合约部署完成
  await eip712Storage.waitForDeployment();

  // 获取部署后的合约地址
  const address = await eip712Storage.getAddress();

  console.log("EIP712Storage deployed to:", address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});