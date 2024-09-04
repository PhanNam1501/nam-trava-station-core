const hre = require("hardhat");

describe("addLiquidity", function () {

    async function getLiquidity(exchange_contract) {
        try {
          // Gọi hàm getLiquidity từ contract addLiquidity
          const liquidity = await exchange_contract.getReserves();
      
          console.log("Liquidity Information:", liquidity);
           return liquidity;
        } catch (error) {
          console.error("Failed to get liquidity:", error);
          throw error;
        }
      }

      async function getPool(exchange_contract) {
        try {
          // Gọi hàm getLiquidity từ contract addLiquidity
         
          const liquidity = await exchange_contract.createPool(1000,{value:1000});
      
          console.log("Pool Information:", liquidity);
        } catch (error) {
          console.error("Failed to get pool:", error);
        }
      }
      
    this.timeout(150000);
    console.log("hello");
    it("Test", async () => {
      [owner] = await ethers.getSigners();
      const exchange = process.env.TOKEN_EXCHANGE;
      const tokenAddr = process.env.TOKEN;
      const maxSlippage = hre.ethers.utils.parseEther("0.11");
      const from = process.env.PUBLIC_KEY;
      
      
      const token = await hre.ethers.getContractAt(
        "Token",
        tokenAddr
      );
      const exchange_contract = await hre.ethers.getContractAt(
        "TokenExchange",
        exchange
      );
      
      const liquidity = await getLiquidity(exchange_contract);
      console.log(liquidity);
      const tx3 = await token.approve(from, 10*11);
      await tx3.wait();
      const tx2 = await token.approve(exchange, 10*100000000000);
      await tx2.wait();
      const tx = await exchange_contract.addLiquidity({value:1});
      await tx.wait();
      const get = await getLiquidity(exchange_contract);
      console.log(get);

    

    });

});