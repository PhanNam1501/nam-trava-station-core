const hre = require("hardhat");

async function main() {
    
    try {
        const [user] = await ethers.getSigners();

        const DSProxyFactory = await ethers.getContractFactory("DSProxyFactory");
        const dsProxyFactory = await DSProxyFactory.deploy();
        await dsProxyFactory.deployed();
      
        const DSProxyRegistry = await ethers.getContractFactory("DSProxyRegistry");
        const dsProxyRegistry = await DSProxyRegistry.deploy(dsProxyFactory.address);
        await dsProxyRegistry.deployed();
        console.log("DSProxyFactory deployed to:", dsProxyFactory.address);
        console.log("DSProxyRegistry deployed to:", dsProxyRegistry.address);
        console.log("User", user.address);
        let tx = await dsProxyRegistry.build(user.address); // real project must be listen event
        await tx.wait();
        let dsProxyAddress = await dsProxyRegistry.proxies(user.address);
        console.log("dsProxyAddress", dsProxyAddress);
      
    } catch (error) {
        console.error(error);
        
    }
    
    }

    main()
        .then(() => process.exit(0))
        .catch((error) => {
        console.error(error);
        process.exit(1);
});