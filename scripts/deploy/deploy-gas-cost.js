const { deployContractAndReturnGasUsed } = require('../utils/deployer');
const { start } = require('../utils/starter');

const gasPriceInGwei = 4.672;
const ethPrice = 211.94;

const calcGasToUSD = (gasUsed) => {
    const ethSpent = (gasUsed * gasPriceInGwei * 1000000000) / 10e18;

    console.log('Eth spent: ', ethSpent);

    console.log(`Dollar cost $${(ethSpent * ethPrice).toFixed(0)}`);
};

async function main() {
    let totalGasUsed = 0;
    let lastSnapShot = totalGasUsed;

    totalGasUsed += await deployContractAndReturnGasUsed('DefisaverLogger');
    totalGasUsed += await deployContractAndReturnGasUsed('DSGuardFactory');
    totalGasUsed += await deployContractAndReturnGasUsed('DSProxyFactory');
    totalGasUsed += await deployContractAndReturnGasUsed('DSProxyRegistry', [process.env.DS_PROXY_FACTORY_ADDRESS]);
    totalGasUsed += await deployContractAndReturnGasUsed('AdminVault');
    totalGasUsed += await deployContractAndReturnGasUsed('StrategyStorage');
    totalGasUsed += await deployContractAndReturnGasUsed('BundleStorage');
    totalGasUsed += await deployContractAndReturnGasUsed('ProxyAuth');
    totalGasUsed += await deployContractAndReturnGasUsed('SubStorage');
    totalGasUsed += await deployContractAndReturnGasUsed('SubProxy');
    totalGasUsed += await deployContractAndReturnGasUsed('StrategyProxy');
    totalGasUsed += await deployContractAndReturnGasUsed('RecipeExecutor');
    totalGasUsed += await deployContractAndReturnGasUsed('BotAuth');
    totalGasUsed += await deployContractAndReturnGasUsed('StrategyExecutor');

    console.log(`Core system gas cost: ${(totalGasUsed - lastSnapShot).toString()}`);
    calcGasToUSD(totalGasUsed);
    lastSnapShot = totalGasUsed;
    // mcd actions
    totalGasUsed += await deployContractAndReturnGasUsed('WrapBnb');
    totalGasUsed += await deployContractAndReturnGasUsed('UnwrapBnb');
    totalGasUsed += await deployContractAndReturnGasUsed('SendToken');
    totalGasUsed += await deployContractAndReturnGasUsed('PullToken');
    totalGasUsed += await deployContractAndReturnGasUsed('TravaBorrow');
    totalGasUsed += await deployContractAndReturnGasUsed('TravaRepay');
    totalGasUsed += await deployContractAndReturnGasUsed('TravaSupply');
    totalGasUsed += await deployContractAndReturnGasUsed('TravaWithdraw');
    totalGasUsed += await deployContractAndReturnGasUsed('TravaNFTTransfer');
    totalGasUsed += await deployContractAndReturnGasUsed('TravaNFTBuy');
    totalGasUsed += await deployContractAndReturnGasUsed('TravaNFTCreateSale');
    totalGasUsed += await deployContractAndReturnGasUsed('TravaNFTCancelSale');

    console.log(`Trava Actions gas cost: ${(totalGasUsed - lastSnapShot).toString()}`);
    calcGasToUSD(totalGasUsed - lastSnapShot);
    lastSnapShot = totalGasUsed;

    console.log(`Total cost: ${(totalGasUsed).toString()}`);
    calcGasToUSD(totalGasUsed);
}

start(main);
