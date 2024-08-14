const hre = require("hardhat");

async function main() {
  const contractAddress = "YOUR_DEPLOYED_CONTRACT_ADDRESS";
  const EIP712Storage = await hre.ethers.getContractFactory("EIP712Storage");
  const contract = EIP712Storage.attach(contractAddress);

  const number = 100; // 与签名中使用的数字相同
  const signature = "YOUR_GENERATED_SIGNATURE";

  const tx = await contract.permitStore(number, signature);
  await tx.wait();

  console.log("Number stored successfully");

  const storedNumber = await contract.retrieve();
  console.log("Stored number:", storedNumber.toString());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});