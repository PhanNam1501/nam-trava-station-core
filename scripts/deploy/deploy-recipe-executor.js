const { writeToEnvFile } = require("../utils/helper");
const { redeploy } = require("../../test/utils");
require("dotenv").config();

async function main() {
    const recipeExecutor = await redeploy('RecipeExecutor', process.env.DFS_REGISTRY_ADDRESS);

    await changeConstantInFiles(
        './contracts',
        ['MainnetCoreAddresses'],
        'RECIPE_EXECUTOR_ADDR',
        recipeExecutor.address,
    );
    await run('compile');
    console.log(recipeExecutor.address);
    writeToEnvFile("RECIPE_EXECUTOR_ADDRESS", recipeExecutor.address)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

