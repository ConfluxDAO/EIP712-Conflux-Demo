const hre = require("hardhat");
require("dotenv").config();

async function main() {
  const [signer] = await hre.ethers.getSigners();
  
  const contractAddress = "YOUR_DEPLOYED_CONTRACT_ADDRESS";

  const domain = {
    name: "EIP712Storage",
    version: "1",
    chainId: 71, // Conflux eSpace testnet
    verifyingContract: contractAddress,
  };

  const types = {
    Storage: [
      { name: "spender", type: "address" },
      { name: "number", type: "uint256" },
    ],
  };

  const value = {
    spender: await signer.getAddress(),
    number: 100,
  };

  const signature = await signer._signTypedData(domain, types, value);
  
  console.log("Signer:", await signer.getAddress());
  console.log("Number:", value.number);
  console.log("Signature:", signature);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});