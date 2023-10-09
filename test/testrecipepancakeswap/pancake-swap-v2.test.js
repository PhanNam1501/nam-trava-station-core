const hre = require("hardhat");
const abiCoder = new hre.ethers.utils.AbiCoder();
require("dotenv").config();

const { Action } = require("../../teststrategy/Action");
const { expect } = require("chai");
const { getProxy } = require("../../utils");
const { ApplicationState, updateTravaLPInfo, getListTDTokenRewardsAddress, MAX_UINT256 } = require("trava-simulation-route")
const { actions, Recipe } = require("trava-station-sdk");
const { Contract } = require("ethers");
const { getContractFactory } = require("@nomiclabs/hardhat-ethers/types");
const { toChecksumAddress } = require('ethereumjs-util');

describe("Pancake-Swap-V2", function () {
    this.timeout(150000);

    const convertHexStringToAddress = (hexString) => {
        String(hexString).toLowerCase();
        const strippedHex = hexString.replace(/^0x/, '');
        return toChecksumAddress(`0x${strippedHex}`);
    };

    it("Test trava PancakeSwapV2", async () => {
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

        let oldState = await updateTravaLPInfo(
            appState
        )

        // let listToken = getListTDTokenRewardsAddress(oldState);
        let listToken = [
            convertHexStringToAddress("0x456f85BA534311867678128c1278Be2484Adfb3d"),
            convertHexStringToAddress("0x77035788b48fa508548d7985263c9ad094defa8f")
        ]

        let PancakeSwapV2Action = new actions.trava.TravaPancakeSwapV2(
            listToken,
            MAX_UINT256,
            proxy.address,
            process.env.TRAVA_CLAIMS_REWARDS_ADDRESS
        )
        console.log("e", PancakeSwapV2Action.encodeForRecipe())
        let recipe = new Recipe("PancakeSwapV2", chainId, [
            PancakeSwapV2Action
        ]);

        let encodeData = recipe.encodeForDsProxyCall();
        
        // call receive function in proxy contract to send BNB to proxy
        // const ownerAcc = (await hre.ethers.getSigners())[0];
        // await ownerAcc.sendTransaction({
        //   to: proxy.address,
        //   value: amount + amount,
        // });

        console.log("prepare execute data completed!")

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
