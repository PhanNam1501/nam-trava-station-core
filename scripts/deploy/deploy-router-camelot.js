const hre = require("hardhat");
require("dotenv").config();
async function main() {
  // Lấy các tài khoản từ Hardhat
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  const CamelotRouter = await hre.ethers.getContractFactory("CamelotRouter");
  const camelotrouter = await CamelotRouter.deploy(process.env.CAMELOTFACTORY,process.env.WETH9);
  await camelotrouter.deployed();
  console.log("Router:", camelotrouter.address);

  

  console.log("Deployed by:", deployer.address);

}

// Xử lý lỗi và chạy main
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
