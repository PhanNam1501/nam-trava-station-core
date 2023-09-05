// Tạo 2 token -> tạo 1 pool vói 2 token -> Test action 1 là addLiquidity cả 2 token đó -> Test action 2 là increaseLiquidity 1 đồng -> Test action 3 là swap -> Test action 4 là collect lãi do 1 thằng khác đã swap ở bước trước > Test aciton 5 là removeLiquidity
const hre = require('hardhat');

const { getProxy, addLiquidity, increaseLiquidity, createPool, collectLiquidity, removeLiquidity, swapExactTokenForToken, swapExactInputSingle, combinatorPancakeswap, combinator } = require("./utils");

// Account Owner support 2 token
// Account A swap

const listToken = [
    {
      name: "WBNB",
      address: "0x910CB19698Eac48a6AB7Ccc9542B756f2Bdd67C6"
    },
    {
      name: "USDC",
      address: "0x345dCB7B8F17D342A3639d1D9bD649189f2D0162"
    },
    {
      name: "USDT",
      address: "0x780397E17dBF97259F3b697Ca3a394fa483A1419"
    },
    // {
    //   name: "DAI",
    //   address: "0xFCcB260C9074faBB69702C1972aa747aAC6e654F"
    // },
    // {
    //   name: "ETH",
    //   address: "0xBE2a3B225aDA4142C42A36CfbD5b04F28D261CA8"
    // },
    // {
    //   name: "BUSD",
    //   address: "0x2CEC38C779d6b962bc877777b6f70937d21c9c38"
    // },
    // {
    //   name: "XVS",
    //   address: "0x45A80229E1FeAb61E360EfA9005B5AB46821Cee7"
    // },
    // {
    //   name: "DOT",
    //   address: "0x0642E40c9a12fc3C7a3BFfA47e9E41391cC49Dbe"
    // },
    {
      name: "AAVE",
      address: "0x3cb48b8e2Ef30a8aD5130ad49b8A6044eA80d1f2"
    },
    // {
    //   name: "ADA",
    //   address: "0x5303A4c5c5D79d086C77E05338fDf6548A1EE09C"
    // },
    // {
    //   name: "CAKE",
    //   address: "0x97f04BF5FcFF000e2bF72884E6C33a261F8E8ba9"
    // },
    // {
    //   name: "XRP",
    //   address: "0xb868DC5a295489088d3373Ee8d365CeF45c38684"
    // },
    // {
    //   name: "DOGE",
    //   address: "0xe4C7E2f0D19335f9B85e4732eb05eFced2f8f2fb"
    // },
    {
      name: "TRAVA",
      address: "0xE1F005623934D3D8C724EC68Cc9bFD95498D4435"
    },
    // {
    //   name: "TOD",
    //   address: "0xFca3Cf5E82F595D4f20C24D007ae5E2e94fab2f0"
    // }
  ]

const pancakeRouter = "0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3";
const pancakeFactory = "0xB7926C0430Afb07AA7DEfDE6DA862aE0Bde767bc";
describe("Test Pancakeswap", async function() {
  let ownerAcc;
  let accA;
  let proxy;

  before(async() => {
    ownerAcc = (await hre.ethers.getSigners())[0];
    console.log(`Owner address:: ${ownerAcc.address}`);

    proxy = await getProxy(ownerAcc.address);
    console.log(`Proxy address:: ${proxy.address}`);

  });

//   it("Test approve token", async() => {
//     let factoryContract;
//     factoryContract = await hre.ethers.getContractAt("IPancakeFactory", pancakeFactory);

//     let tokenContract_j;
//     let balance_j;
//     let tokenContract_i;
//     let balance_i;
//     let tx;
//     for(let j = 0; j < 1; j++) {
//         tokenContract_j = await hre.ethers.getContractAt("IBEP20", listToken[j].address);
//         balance_j = await tokenContract_j.balanceOf(ownerAcc.address);
//         for(let i = 1; i < listToken.length; i++) {
//             tokenContract_i = await hre.ethers.getContractAt("IBEP20", listToken[i].address);
//             balance_i = await tokenContract_i.balanceOf(ownerAcc.address);
//             // console.log("crete pair " + listToken[j].name + "-" + listToken[i].name + ":")
//             // console.log("Token " + listToken[i].name + ": " + listToken[i].address)
//             pair = await factoryContract.getPair(listToken[j].address, listToken[i].address);
//             if(pair.toString() != "0x0000000000000000000000000000000000000000") {
//                 console.log("pair: ", listToken[j].name + "-" + listToken[i].name)
//                 tx = await tokenContract_j.approve(pair, Math.floor(balance_j/1000))
//                 await tx.wait();
//                 console.log("approve " + Math.floor(balance_j/1000) + " " + listToken[j].name + " successed!" )
//                 tx = await tokenContract_i.approve(pair, BigInt(balance_i/100000))
//                 await tx.wait();
//                 console.log("approve " + BigInt(balance_i/100000) + " " + listToken[i].name + " successed!" )
//             } 
//         }
//     }
//   });

// it("Test create pair token", async() => {
//     let factoryContract;
//     factoryContract = await hre.ethers.getContractAt("IPancakeFactory", pancakeFactory);

//     let pair;
//     let tx;
//     for(let j = 0; j < 1; j++) {
//         for(let i = 3; i < listToken.length; i++) {
//             console.log("crete pair " + listToken[j].name + "-" + listToken[i].name + ":")
//             // console.log("Token " + listToken[i].name + ": " + listToken[i].address)
//             pair = await factoryContract.getPair(listToken[j].address, listToken[i].address);
//             if(pair.toString() == "0x0000000000000000000000000000000000000000") {
//                 console.log("Pair is creating......")
//                 tx = await factoryContract.createPair(listToken[j].address, listToken[i].address)
//                 await tx.wait();

                
//             } 
//             console.log("pair: ", await factoryContract.getPair(listToken[j].address, listToken[i].address))
//         }
//     }

//   });

  it("Test inscrease liquidity", async() => {
    let pancakeRouterContract;
    pancakeRouterContract = await hre.ethers.getContractAt("IPancakeRouter02", pancakeRouter);

    let tokenContract_j;
    let balance_j;
    let tokenContract_i;
    let balance_i;
    let tx;
    for(let j = 0; j < 1; j++) {
        tokenContract_j = await hre.ethers.getContractAt("IBEP20", listToken[j].address);
        balance_j = await tokenContract_j.balanceOf(ownerAcc.address);
        // console.log(balance_j, (balance_j/1000).toString())
        for(let i = 4; i < listToken.length; i++) {

            tokenContract_i = await hre.ethers.getContractAt("IBEP20", listToken[i].address);
            balance_i = await tokenContract_i.balanceOf(ownerAcc.address);
            tx = await pancakeRouterContract.addLiquidity(
                listToken[j].address,
                listToken[i].address,
                BigInt(balance_j / 1000),
                BigInt(balance_i / 100000),
                0,
                0,
                ownerAcc.address,
                100 * 365 * 24 * 60 * 60 * 1000

            )
            await tx.wait();
            console.log("tx", tx)
        }
    }

  }).timeout(1000000);


});
