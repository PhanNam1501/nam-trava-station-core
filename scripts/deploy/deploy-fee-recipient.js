const { ethers } = require("hardhat");
const { writeToEnvFile } = require("../utils/helper");


async function main() {

    const feeRecipientFactory  = await ethers.getContractFactory("FeeRecipient");
    const feeRecipientContract = await feeRecipientFactory.deploy(process.env.PUBLIC_KEY);
    writeToEnvFile("FEE_RECIPIENT", feeRecipientContract.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
