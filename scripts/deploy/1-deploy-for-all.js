/* eslint-disable import/no-extraneous-dependencies */

const hre = require('hardhat');
const fs = require('fs');
const { deployAsOwner } = require('../utils/deployer');
const { start } = require('../utils/starter');

const { changeConstantInFiles } = require('../utils/utils');

const { redeploy } = require('../../test/utils');
const { owner } = require("../sdk/rdOwner");
const { writeToEnvFile } = require('../utils/helper');

// const { topUp } = require('../utils/fork');

async function main() {
    //await topUp(OWNER_ACC);

    // get signer
    const signer = owner;

//     /*
//         ||--------------------------------------------------------------------------------||
//         ||                                 Logger Contract                                || 
//         ||--------------------------------------------------------------------------------||
//     */

    // await changeConstantInFiles(
    //     './contracts',
    //     ['MainnetAuthAddresses'],
    //     'ADMIN_ADDR',
    //     await owner.getAddress()
    //     );
    // run('compile');

//     const defiSaverLogger = await deployAsOwner('DefisaverLogger', signer);
//     await changeConstantInFiles(
//         './contracts',
//         ['MainnetCoreAddresses', 'MainnetActionsUtilAddresses'],
//         'DEFISAVER_LOGGER',
//         defiSaverLogger.address,
//     );
//     run('compile');
//     writeToEnvFile("DEFISAVER_LOGGER_ADDRESS", defiSaverLogger.address)
    
//     await changeConstantInFiles(
//         './contracts',
//         ['MainnetUtilAddresses'],
//         'FEE_RECEIVER_ADMIN_ADDR',
//         await owner.getAddress(),
//     );
//     run('compile');

// //     /*
// //     ||--------------------------------------------------------------------------------||
// //     ||                                   DS Contract                                  || 
// //     ||--------------------------------------------------------------------------------||
// // */
    // DSGuardFactory
    // const dsGuardFactory = await deployAsOwner('DSGuardFactory', signer);
    // await changeConstantInFiles(
    //     './contracts',
    //     ['MainnetAuthAddresses'],
    //     'FACTORY_ADDRESS',
    //     dsGuardFactory.address,
    // );
    // run('compile');
    // writeToEnvFile("DS_GUARD_FACTORY_ADDRESS", dsGuardFactory.address)

    // DSProxyFactory
    // const dsProxyFactory = await deployAsOwner('DSProxyFactory', signer);
    // await changeConstantInFiles(
    //     './contracts',
    //     ['MainnetUtilAddresses'],
    //     'PROXY_FACTORY_ADDR',
    //     dsProxyFactory.address,
    // );
    // run('compile');
    // writeToEnvFile("DS_PROXY_FACTORY_ADDRESS", dsProxyFactory.address)

    // DSProxyRegistry
    /* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
     * !!!    * NEED DEPLOY CONTRACT DSProxyFactory BEFORE    !!!
     * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
     */
    // const proxyRegistry = await deployAsOwner('DSProxyRegistry', signer, process.env.DS_PROXY_FACTORY_ADDRESS);
    // await changeConstantInFiles(
    //     './contracts',
    //     ['MainnetUtilAddresses'],
    //     'MKR_PROXY_REGISTRY',
    //     proxyRegistry.address,
    // );
    // run('compile');
    // writeToEnvFile("DS_PROXY_REGISTRY_ADDRESS", proxyRegistry.address)

    /*
        ||--------------------------------------------------------------------------------||
        ||                                 Auth Contract                                  || 
        ||--------------------------------------------------------------------------------||
    */
    // AdminVault Contract  
    /* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
     * !!!    * NEED UPDATE ADMIN ADDRESS                     !!!
     * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
     */

        
    // const adminVault = await deployAsOwner('AdminVault', signer);

    // await changeConstantInFiles(
    //     './contracts',
    //     ['MainnetAuthAddresses'],
    //     'ADMIN_VAULT_ADDR',
    //     adminVault.address,
    // );
    // run('compile');
    // writeToEnvFile("ADMIN_VAULT_ADDRESS", adminVault.address)

    /*
        ||--------------------------------------------------------------------------------||
        ||                                 Core Contract                                  || 
        ||--------------------------------------------------------------------------------||
    */
    // DFSRegistry Contract  
    /* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
     * !!!    * NEED DEPLOY AdminVault CONTRACT               !!!
     * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
     */
    // const reg = await deployAsOwner('DFSRegistry', signer);
    // await changeConstantInFiles(
    //     './contracts',
    //     ['MainnetActionsUtilAddresses', 'MainnetCoreAddresses'],
    //     'REGISTRY_ADDR',
    //     reg.address,
    // );
    // run('compile');
    // writeToEnvFile("DFS_REGISTRY_ADDRESS", reg.address);

    // StrategyStorage Contract  
    /* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
     * !!!    * NEED DEPLOY AdminVault CONTRACT               !!!
     * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
     */
    // const strategyStorage = await redeploy('StrategyStorage', reg.address);
    // await changeConstantInFiles(
    //     './contracts',
    //     ['MainnetCoreAddresses'],
    //     'STRATEGY_STORAGE_ADDR',
    //     strategyStorage.address,
    // );
    // run('compile');
    // writeToEnvFile("STRATEGY_STORAGE_ADDRESS", strategyStorage.address);

    // BundleStorage Contract  
    /* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
     * !!!    * NEED DEPLOY AdminVault CONTRACT               !!!
     * !!!    * NEED DEPLOY DFSRegistry CONTRACT              !!!
     * !!!    * NEED DEPLOY StrategyStorage CONTRACT          !!!
     * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
     */
    // const bundleStorage = await redeploy('BundleStorage', process.env.DFS_REGISTRY_ADDRESS);
    // await changeConstantInFiles(
    //     './contracts',
    //     ['MainnetCoreAddresses'],
    //     'BUNDLE_STORAGE_ADDR',
    //     bundleStorage.address,
    // );
    // run('compile');
    // writeToEnvFile("BUNDLE_STORAGE_ADDRESS", bundleStorage.address)

    // ProxyAuth
    /* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
     * !!!    * NEED DEPLOY AdminVault CONTRACT               !!!
     * !!!    * NEED DEPLOY DFSRegistry CONTRACT              !!!
     * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
     */
    // const proxyAuth = await redeploy('ProxyAuth', process.env.DFS_REGISTRY_ADDRESS);
    // await changeConstantInFiles(
    //     './contracts',
    //     ['MainnetCoreAddresses', 'MainnetActionsUtilAddresses'],
    //     'PROXY_AUTH_ADDR',
    //     proxyAuth.address,

    // );
    // writeToEnvFile("PROXY_AUTH_ADDRESS", proxyAuth.address)

    // SubStorage
    /* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
     * !!!    * NEED DEPLOY AdminVault CONTRACT               !!!
     * !!!    * NEED DEPLOY DFSRegistry CONTRACT              !!!
     * !!!    * NEED DEPLOY StrategyStorage CONTRACT          !!!
     * !!!    * NEED DEPLOY BundleStorage CONTRACT            !!!
     * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
     */
    // const subStorage = await redeploy('SubStorage', process.env.DFS_REGISTRY_ADDRESS);
    // await changeConstantInFiles(
    //     './contracts',
    //     ['MainnetCoreAddresses', 'MainnetActionsUtilAddresses'],
    //     'SUB_STORAGE_ADDR',
    //     subStorage.address,
    // );
    // run('compile');
    // writeToEnvFile("SUB_STORAGE_ADDRESS", subStorage.address)

    // SubProxy
    /* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
     * !!!    * NEED DEPLOY AdminVault CONTRACT               !!!
     * !!!    * NEED DEPLOY DFSRegistry CONTRACT              !!!
     * !!!    * NEED DEPLOY StrategyStorage CONTRACT          !!!
     * !!!    * NEED DEPLOY DSGuardFactory CONTRACT           !!!
     * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
     */
    // const subProxy = await redeploy('SubProxy', process.env.DFS_REGISTRY_ADDRESS);
    // writeToEnvFile("SUB_PROXY_ADDRESS", subProxy.address)

    // // StrategyProxy
    // /* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    //  * !!!    * NEED DEPLOY AdminVault CONTRACT               !!!
    //  * !!!    * NEED DEPLOY DFSRegistry CONTRACT              !!!
    //  * !!!    * NEED DEPLOY SubStorage CONTRACT               !!!
    //  * !!!    * NEED DEPLOY DSGuardFactory CONTRACT           !!!
    //  * !!!    * NEED DEPLOY BundleStorage CONTRACT            !!!
    //  * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    //  */
    // const strategyProxy = await redeploy('StrategyProxy', process.env.DFS_REGISTRY_ADDRESS);
    // writeToEnvFile("STRATEGY_PROXY_ADDRESS", strategyProxy.address)

    // // RecipeExecutor
    // /* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    //  * !!!    * NEED DEPLOY AdminVault CONTRACT               !!!
    //  * !!!    * NEED DEPLOY DFSRegistry CONTRACT              !!!
    //  * !!!    * NEED DEPLOY SubStorage CONTRACT               !!!
    //  * !!!    * NEED DEPLOY DSGuardFactory CONTRACT           !!!
    //  * !!!    * NEED DEPLOY BundleStorage CONTRACT            !!!
    //  * !!!    * NEED DEPLOY StrategyStorage CONTRACT          !!!
    //  * !!!    * NEED DEPLOY Logger CONTRACT                   !!!
    //  * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    //  */
    // const recipeExecutor = await redeploy('RecipeExecutor', process.env.DFS_REGISTRY_ADDRESS);
    // await changeConstantInFiles(
    //     './contracts',
    //     ['MainnetCoreAddresses'],
    //     'RECIPE_EXECUTOR_ADDR',
    //     recipeExecutor.address,
    // );
    // run('compile');
    // writeToEnvFile("RECIPE_EXECUTOR_ADDRESS", recipeExecutor.address)

    // // BotAuth
    // /* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    //  * !!!    * NEED DEPLOY AdminVault CONTRACT               !!!
    //  * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    //  */
    const botAuth = await redeploy('BotAuth', process.env.DFS_REGISTRY_ADDRESS);
    writeToEnvFile("BOT_AUTH_ADDRESS", botAuth.address)

    // // StrategyExecutor
    // /* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    //  * !!!    * NEED DEPLOY AdminVault CONTRACT               !!!
    //  * !!!    * NEED DEPLOY DFSRegistry CONTRACT              !!!
    //  * !!!    * NEED DEPLOY SubStorage CONTRACT               !!!
    //  * !!!    * NEED DEPLOY Logger CONTRACT                   !!!
    //  * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    //  */
    // const strategyExecutor = await redeploy('StrategyExecutor', process.env.DFS_REGISTRY_ADDRESS);
    // writeToEnvFile("STRATEGY_EXECUTOR_ADDRESS", strategyExecutor.address)
    /*
        ||--------------------------------------------------------------------------------||
        ||                                 Utils Contract                                 || 
        ||--------------------------------------------------------------------------------||
    */
    
    // DFSProxyRegistryController
    /* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
     * !!!    * NEED DEPLOY AdminVault CONTRACT               !!!
     * !!!    * NEED DEPLOY DFSRegistry CONTRACT              !!!
     * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
     */
    // const dfsProxyRegistryController = await redeploy('DFSProxyRegistryController', process.env.DFS_REGISTRY_ADDRESS);
    // await changeConstantInFiles(
    //     './contracts',
    //     ['MainnetActionsUtilAddresses'],
    //     'DFS_REG_CONTROLLER_ADDR',
    //     "0x2Ffb3A8200B46456DD34a1dF0867F0c757FF70f9",
    // );
    // run('compile');
    // writeToEnvFile("DFS_REG_CONTROLLER_ADDR", dfsProxyRegistryController.address)
  
    // await changeConstantInFiles(
    //     './contracts',
    //     ['MainnetUtilAddresses'],
    //     'FEE_RECEIVER_ADMIN_ADDR',
    //     process.env.PUBLIC_KEY,
    // );
    // run('compile');

    // const feeReceiverFactory  = await ethers.getContractFactory("FeeReceiver");
    // const feeReceiverContract = await feeReceiverFactory.deploy();
    
    // await changeConstantInFiles(
    //     './contracts',
    //     ['MainnetUtilAddresses'],
    //     'feeAddr',
    //     feeReceiverContract.address,
    //     );
    // run('compile');
    // writeToEnvFile("FEE_RECEIVER", feeReceiverContract.address);

    // await changeConstantInFiles(
    //     './contracts',
    //     ['MainnetAuthAddresses'],
    //     'ADMIN_ADDR',
    //     process.env.PUBLIC_KEY,
    // );
    // run('compile');

    // await changeConstantInFiles(
    //     './contracts',
    //     ['MainnetAuthAddresses'],
    //     'ADMIN_VAULT_ADDR',
    //     process.env.ADMIN_VAULT_ADDRESS,
    // );
    // run('compile');

    // await changeConstantInFiles(
    //     './contracts',
    //     ['MainnetAuthAddresses'],
    //     'FACTORY_ADDRESS',
    //     process.env.DS_GUARD_FACTORY_ADDRESS,
    // );
    // run('compile');
    
    // const feeRecipientFactory  = await ethers.getContractFactory("FeeRecipient");
    // const feeRecipientContract = await feeRecipientFactory.deploy(process.env.FEE_RECEIVER);
    
    // await changeConstantInFiles(
    //     './contracts',
    //     ['MainnetUtilAddresses'],
    //     'FEE_RECIPIENT',
    //     feeRecipientContract.address,
    //     );
    // run('compile');  
    // writeToEnvFile("FEE_RECIPIENT", feeRecipientContract.address);

    // // mcd actions
    // const bothAuth = await redeploy('BotAuth', process.env.DFS_REGISTRY_ADDRESS);
    writeToEnvFile("BOTH_AUTH_ADDRESS", bothAuth.address);

    // await redeploy('McdSupply', process.env.DFS_REGISTRY_ADDRESS);
    // await redeploy('McdWithdraw', process.env.DFS_REGISTRY_ADDRESS);
    // await redeploy('McdGenerate', process.env.DFS_REGISTRY_ADDRESS);
    // await redeploy('McdPayback', process.env.DFS_REGISTRY_ADDRESS);
    // await redeploy('McdOpen', process.env.DFS_REGISTRY_ADDRESS);
    // await redeploy('GasFeeTaker', process.env.DFS_REGISTRY_ADDRESS);

    // await addBotCaller('0x61fe1bdcd91E8612a916f86bA50a3EDF3E5654c4', process.env.DFS_REGISTRY_ADDRESS);
    // await addBotCaller('0x660B3515F493200C47Ef3DF195abEAfc57Bd6496', process.env.DFS_REGISTRY_ADDRESS);
    // await addBotCaller('0x4E4cF1Cc07C7A1bA00740434004163ac2821efa7', process.env.DFS_REGISTRY_ADDRESS);

    // // exchange
    // await redeploy('DFSSell', process.env.DFS_REGISTRY_ADDRESS);
}

start(main);
