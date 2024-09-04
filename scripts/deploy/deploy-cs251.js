const { exchange } = require("@curvefi/api/lib/pools");
const hre = require("hardhat");
const { redeploy } = require("../../test/utils");



const provider = hre.ethers.provider;

async function main() {
    
    
        [user] = await ethers.getSigners();
        

        const removeLiquidity = await redeploy(
            "removeLiquidity",
            process.env.DFS_REGISTRY_ADDRESS
          );
        console.log("remove:", removeLiquidity.address);

        // const swapLiquidity = await redeploy(
        //     "swapLiquidity",
        //     process.env.DFS_REGISTRY_ADDRESS
        // );
        // console.log("swap:", swapLiquidity.address);

        

        console.log("Success!");
        

        
    
    
}

    main()
        .then(() => process.exit(0))
        .catch((error) => {
        console.error(error);
        process.exit(1);
});