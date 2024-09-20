const hre = require("hardhat");

async function main() {
  // Lấy các tài khoản từ Hardhat
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  // Lấy hợp đồng từ artifact
  const CamelotFactory = await hre.ethers.getContractFactory("CamelotFactory");

  // Triển khai hợp đồng
  const camelotfactory = await CamelotFactory.deploy(deployer.address);

  console.log("Deploying contract...");
  await camelotfactory.deployed();
  console.log("Contract deployed to:", camelotfactory.address);
  console.log("Deployed by:", deployer.address);

}

// Xử lý lỗi và chạy main
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
