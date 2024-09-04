const hre = require("hardhat");
const { redeploy } = require("../../test/utils");
require("dotenv").config();

async function main() {
const recipeExecutor = await redeploy('RecipeExecutor', process.env.DS_PROXY_REGISTRY_ADDRESS);
    console.log(recipeExecutor.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

