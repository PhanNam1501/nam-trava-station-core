const hre = require("hardhat");

async function main() {
  // Lấy các tài khoản từ Hardhat
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  // const addLiquidityC = await hre.ethers.getContractFactory("addLiquidityC");
  // const addliquidityC = await addLiquidityC.deploy();
  // await addliquidityC.deployed();
  // console.log("Contract deployed to:", addliquidityC.address);

  // const addLiquidityETH = await hre.ethers.getContractFactory("addLiquidityETH");
  // const addliquidityeth = await addLiquidityETH.deploy();
  // await addliquidityeth.deployed();
  // console.log("Contract deployed to:", addliquidityeth.address);



  // const removeLiquidityC = await hre.ethers.getContractFactory("removeLiquidityC");
  // const removeliquidityC = await removeLiquidityC.deploy();
  // await removeliquidityC.deployed();
  // console.log("Contract deployed to:", removeliquidityC.address);
  // console.log("Deployed by:", deployer.address);


  // const removeLiquidityETH = await hre.ethers.getContractFactory("removeLiquidityETH");
  // const removeliquidityeth = await removeLiquidityETH.deploy();
  // await removeliquidityeth.deployed();
  // console.log("Contract deployed to:", removeliquidityeth.address);
  // console.log("Deployed by:", deployer.address);

  // const removeLiquidityWithPermit = await hre.ethers.getContractFactory("removeLiquidityWithPermit");
  // const removeliquiditypermit = await removeLiquidityWithPermit.deploy();
  // await removeliquiditypermit.deployed();
  // console.log("Contract deployed to:", removeliquiditypermit.address);
  // console.log("Deployed by:", deployer.address);

  // const removeLiquidityETHWithPermit = await hre.ethers.getContractFactory("removeLiquidityETHWithPermit");
  // const removeliquidityethpermit = await removeLiquidityETHWithPermit.deploy();
  // await removeliquidityethpermit.deployed();
  // console.log("Contract deployed to:", removeliquidityethpermit.address);
  // console.log("Deployed by:", deployer.address);

  // const swapTokenforToken = await hre.ethers.getContractFactory("swapTokenforToken");
  // const swapTokenforTokenContract = await swapTokenforToken.deploy();
  // await swapTokenforTokenContract.deployed();
  // console.log("Contract deployed to:", swapTokenforTokenContract.address);
  // console.log("Deployed by:", deployer.address);

  // const swapETHforToken = await hre.ethers.getContractFactory("swapETHforToken");
  // const swapETHforTokenContract = await swapETHforToken.deploy();
  // await swapETHforTokenContract.deployed();
  // console.log("Contract deployed to:", swapETHforTokenContract.address);
  // console.log("Deployed by:", deployer.address);

  const swapTokenforETH = await hre.ethers.getContractFactory("swapTokenforETH");
  const swapTokenforETHContract = await swapTokenforETH.deploy();
  await swapTokenforETHContract.deployed();
  console.log("Contract deployed to:", swapTokenforETHContract.address);
  console.log("Deployed by:", deployer.address);


}




// Xử lý lỗi và chạy main
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
