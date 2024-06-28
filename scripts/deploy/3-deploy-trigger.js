/* eslint-disable import/no-extraneous-dependencies */

const hre = require('hardhat');
const fs = require('fs');
const { deployAsOwner } = require('../utils/deployer');
const { start } = require('../utils/starter');

const { changeConstantInFiles } = require('../utils/utils');

const { redeploy} = require('../../test/utils');
const {owner} = require("../sdk/rdOwner");
const { writeToEnvFile } = require('../utils/helper');

// const { topUp } = require('../utils/fork');

async function main() {
    //await topUp(OWNER_ACC);
    
    // get signer
    const signer = owner;
    
    /*
        ||--------------------------------------------------------------------------------||
        ||                              TestStrategy Contract                             || 
        ||--------------------------------------------------------------------------------||
    */
    // const testStrategy = await deployAsOwner('TestStrategy', signer);
    // await changeConstantInFiles(
    //     './contracts',
    //     ['MainnetTestStrategyAddresses'],
    //     'TEST_STRATEGY_ADDRESS',
    //     testStrategy.address,
    // );
    // await run('compile');
    // writeToEnvFile("TEST_STRATEGY_ADDRESS", testStrategy.address)
    /*
        ||--------------------------------------------------------------------------------||
        ||                                 Action Contract                                || 
        ||--------------------------------------------------------------------------------||
    */

    /*
        ||++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++||
        ||                           TestStratage Contract                                ||
        ||++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++||
    */
    // const testStrategyIncrease = await redeploy('TestStrategyIncrease', process.env.DFS_REGISTRY_ADDRESS);
    // writeToEnvFile("TEST_STRATEGY_INCREASE_ADDRESS", testStrategyIncrease.address)

    /*
        ||--------------------------------------------------------------------------------||
        ||                                Trigger Contract                                || 
        ||--------------------------------------------------------------------------------||
    */
    // const testStrategyTrigger = await redeploy('TestStrategyTrigger', process.env.DFS_REGISTRY_ADDRESS);
    // writeToEnvFile("TEST_STRATEGY_TRIGGER_ADDRESS", testStrategyTrigger.address)
    
    // TimeTrigger Contract Deployment
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

    // const timeTrigger = await redeploy('TimeTrigger', process.env.DFS_REGISTRY_ADDRESS);
   
    // writeToEnvFile("TIME_TRIGGER", timeTrigger.address)

    // OnchainPriceTrigger Contract Deployment

    const onchainPriceTrigger = await redeploy('OnchainPriceTrigger', process.env.DFS_REGISTRY_ADDRESS);
   
    writeToEnvFile("ONCHAIN_PRICE_TRIGGER", onchainPriceTrigger.address)
}

start(main);
