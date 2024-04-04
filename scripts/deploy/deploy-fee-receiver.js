const { ethers } = require("hardhat");
const { writeToEnvFile } = require("../utils/helper");


async function main() {

    const feeReceiverFactory  = await ethers.getContractFactory("FeeReceiver");
    const feeReceiverContract = await feeReceiverFactory.deploy();
    writeToEnvFile("FEE_RECEIVER", feeReceiverContract.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
