const hre = require("hardhat");

async function main() {
  // Lấy các tài khoản từ Hardhat
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  const TokenA = await hre.ethers.getContractFactory("ERC20");
  const tokena = await TokenA.deploy();
  await tokena.deployed();
  console.log("TokenA:", tokena.address);
  await tokena.mint(10000);

  console.log("Deploying contracts with the account:", deployer.address);
  const TokenB = await hre.ethers.getContractFactory("ERC20")
  const tokenb = await TokenB.deploy();
  await tokenb.deployed();
  console.log("TokenB:", tokenb.address);
  await tokenb.mint(10000);

  console.log("Deploying contracts with the account:", deployer.address);
  const TokenC = await hre.ethers.getContractFactory("ERC20");
  const tokenc = await TokenC.deploy();
  await tokenc.deployed();
  console.log("TokenC:", tokenc.address);
  await tokenc.mint(10000);

  

  

  // const WETH9 = await hre.ethers.getContractFactory("WETH9");
  // const weth9 = await WETH9.deploy();
  // await weth9.deployed();
  // console.log("WETH9:", weth9.address);

  console.log("Deployed by:", deployer.address);

}

// Xử lý lỗi và chạy main
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
