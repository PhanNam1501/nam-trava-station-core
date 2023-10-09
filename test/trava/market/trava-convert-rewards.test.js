const hre = require("hardhat");
const abiCoder = new hre.ethers.utils.AbiCoder();
require("dotenv").config();

const { Action } = require("../../teststrategy/Action");
const { expect } = require("chai");
const { getProxy } = require("../../utils");
const { ApplicationState, updateTravaLPInfo, getListTDTokenRewardsAddress, MAX_UINT256, updateUserTokenBalance, updateSmartWalletTokenBalance } = require("trava-simulation-route")
const { actions, Recipe } = require("trava-station-sdk");
const { Contract } = require("ethers");
const { getContractFactory } = require("@nomiclabs/hardhat-ethers/types");
const { toChecksumAddress } = require('ethereumjs-util');

describe("Trava-convertRewards", function () {
    this.timeout(150000);

    const convertHexStringToAddress = (hexString) => {
        String(hexString).toLowerCase();
        const strippedHex = hexString.replace(/^0x/, '');
        return toChecksumAddress(`0x${strippedHex}`);
    };

    it("Test trava convertRewards", async () => {
        const userAddress = process.env.PUBLIC_KEY;
        const proxy = await getProxy(process.env.PUBLIC_KEY);
        const provider = hre.ethers.provider;
        const chainId = Number((await provider.getNetwork()).chainId)
        console.log("Start!", userAddress, proxy.address, chainId)
        const appState = new ApplicationState(
            userAddress,
            proxy.address,
            provider,
            chainId
        );

        let oldState = await updateSmartWalletTokenBalance(
            appState,
            "0x170772a06affc0d375ce90ef59c8ec04c7ebf5d2"
        )

        oldState = await updateSmartWalletTokenBalance(
            appState,
            "0x0391bE54E72F7e001f6BBc331777710b4f2999Ef"
        )

        console.log("trava balance: ", oldState.smartWalletState.tokenBalances)
        let convertRewardsAction = new actions.trava.TravaConvertRewards(
            proxy.address,
            proxy.address,
            MAX_UINT256,
            process.env.TRAVA_CONVERT_REWARDS_ADDRESS
        )
        console.log("e", convertRewardsAction.encodeForRecipe())
        let recipe = new Recipe("convertRewards", chainId, [
            convertRewardsAction
        ]);

        let encodeData = recipe.encodeForDsProxyCall();
        
        // call receive function in proxy contract to send BNB to proxy
        // const ownerAcc = (await hre.ethers.getSigners())[0];
        // await ownerAcc.sendTransaction({
        //   to: proxy.address,
        //   value: amount + amount,
        // });

        console.log("prepare execute data completed!", encodeData)

        // let proxyContract = await hre.ethers.getContractFactory("DSProxy");
        // const rd = proxyContract.attach(proxy.address);
        // const rdOwner = rd.connect(new hre.ethers.Wallet(process.env.PRIVATE_KEY, provider))
        // let estimationGas = await rdOwner.estimateGas.execute(
        //         encodeData[0],
        //         encodeData[1],
        //         {
        //             gasLimit: 2e6
        //         }
        // );
        // console.log("estimateGas", estimationGas)
        let tx = await proxy["execute(address,bytes)"](
          encodeData[0],
          encodeData[1],
          {
            gasLimit: 2e6,
          }
        );

        tx = await tx.wait();
        console.log("tx", tx);
        //        console.log("ok")
    });
});
