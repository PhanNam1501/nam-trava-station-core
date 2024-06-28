const { ethers } = require("hardhat");
const { writeToEnvFile } = require("../utils/helper");

require("dotenv").config();

async function main() {
  const ERC20Mock = await ethers.getContractFactory("TetherToken");
  const erc20Mock = await ERC20Mock.deploy(
    "1000000000000", 
    "USD Tether",
    "USDT",
    "6"
);
  await erc20Mock.deployed();
  console.log("ERC20Mock deployed at: ", erc20Mock.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
