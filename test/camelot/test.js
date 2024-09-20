
const hre = require("hardhat");
const { Contract } = require("ethers");
const ICamelotPair = require('../../artifacts/contracts/interfaces/camelot/core/interfaces/ICamelotPair.sol/ICamelotPair.json');


const { MAX_UINT256 } = require("trava-simulation-route");
require("dotenv").config();

describe("addLiquidity", function () {

    
    let pair, liquidity, amounta, amounb, a, b;
    this.timeout(150000);
    console.log("hello");
    it("Test", async () => {
      [owner] = await ethers.getSigners();
      const providerUrl = 'https://nd-741-200-374.p2pify.com/e47c8aefbd713f6684e9ee1a095c1052'; 
      const provider = new ethers.providers.JsonRpcProvider(providerUrl);
      const routeraddr = process.env.ROUTER;
      const tokenAaddr = process.env.TOKENA;
      const tokenBaddr = process.env.TOKENB;
      const tokenCaddr = process.env.TOKENC;
      const weth = process.env.WETH9;
      const facaddr = process.env.CAMELOTFACTORY;
      const from = process.env.PUBLIC_KEY;
      const overrides = {
        gasLimit: 9999999
      }
      
      
      
      
      // const tokenA = await hre.ethers.getContractAt(
      //   "TokenA",
      //   tokenAaddr
      // );

      // const tokenB = await hre.ethers.getContractAt(
      //   "TokenB",
      //   tokenBaddr
      // );

      
      const router = await hre.ethers.getContractAt(
        "CamelotRouter",
        routeraddr
      );

      const factory = await hre.ethers.getContractAt(
        "CamelotFactory",
        facaddr
      );
      // const tx1 = await factory.getPair(tokenA.address,tokenB.address);
      // console.log(tx1);
      // const tx2 = await tokenA.approve(router.address, MAX_UINT256);
      // await tx2.wait();
      // const tx3 = await tokenB.approve(router.address, MAX_UINT256);
      // await tx3.wait();


      console.log("Approve router!");

      


      
  
      // const reserves = await pair.getReserves();
      // const [a, b, c, d] = reserves;
      // console.log(a,b)
      
      // liquidity = await pair.balanceOf(owner.address);
      // console.log("liquidity: ", liquidity);

      
      // const tx4 = await router.removeLiquidity(
      //   tokenA.address,
      //   tokenB.address, 
      //   hre.ethers.BigNumber.from("20"),
      //   hre.ethers.BigNumber.from("0"), // amountAMin
      //   hre.ethers.BigNumber.from("0"), // amountBMin
      //   from,
      //   MAX_UINT256,
      //   overrides // deadline
      // );

      // await tx4.wait();

      const pairAddress = await factory.getPair(tokenAaddr, weth);
      console.log("pairCTH:", pairAddress);
      pair = await hre.ethers.getContractAt("CamelotPair", pairAddress);
      const reserves1 = await pair.getReserves();
      const [a1, b1, ] = reserves1;
      console.log(a1,b1)
      
      liquidity = await pair.balanceOf(owner.address);
      console.log("liquidity: ", liquidity);
      console.log("addliquidity accesful");

  
    

    });

});