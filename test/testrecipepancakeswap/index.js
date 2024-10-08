// Tạo 2 token -> tạo 1 pool vói 2 token -> Test action 1 là addLiquidity cả 2 token đó -> Test action 2 là increaseLiquidity 1 đồng -> Test action 3 là swap -> Test action 4 là collect lãi do 1 thằng khác đã swap ở bước trước > Test aciton 5 là removeLiquidity

const { getProxy, addLiquidity, increaseLiquidity, createPool, collectLiquidity, removeLiquidity, swapExactTokenForToken, swapExactInputSingle, combinatorPancakeswap, combinator } = require("./utils");

// Account Owner support 2 token
// Account A swap

describe("Test Pancakeswap", async function() {
  let ownerAcc;
  let accA;
  let proxy;

  before(async() => {
    ownerAcc = (await hre.ethers.getSigners())[0];
    accA = (await hre.ethers.getSigners())[1];
    console.log(`Owner address:: ${ownerAcc.address} with balance ${hre.ethers.utils.formatEther(await ethers.provider.getBalance(ownerAcc.address))} TBNB`);
    console.log(`AccA address:: ${accA.address} with balance ${hre.ethers.utils.formatEther(await ethers.provider.getBalance(accA.address))} TBNB`);

    // Mint cho Owner 1000 token A
    // const tokenAInstance = await ethers.getContractFactory('ERC20Mock');
    // const tokenA = await tokenAInstance.deploy("Token A", "TKA");
    // await tokenA.deployed();
    // console.log("Address ERC20Mock token A::", tokenA.address);
    // console.log("Balance of Owner::", await tokenA.balanceOf(ownerAcc.address));
    
    // const tokenA = (await hre.ethers.getContractFactory("ERC20Mock")).attach(process.env.TOKEN_A_TEST2);
    // console.log("Balance token A of Owner::", await tokenA.balanceOf(ownerAcc.address));
    
    // Mint cho Owner 1000 token B
    // const tokenBInstance = await ethers.getContractFactory('ERC20Mock');
    // const tokenB = await tokenBInstance.deploy("Token B", "TKB");
    // await tokenB.deployed();
    // console.log("Address ERC20Mock token B::", tokenB.address);
    // console.log("Balance token B of Owner::", await tokenB.balanceOf(ownerAcc.address));
    
    // const tokenB = (await hre.ethers.getContractFactory("ERC20Mock")).attach(process.env.TOKEN_B_TEST2);
    // console.log("Balance token B of Owner::", await tokenB.balanceOf(ownerAcc.address));

    proxy = await getProxy(ownerAcc.address);
    console.log(`Proxy address:: ${proxy.address} with balance ${hre.ethers.utils.formatEther(await ethers.provider.getBalance(proxy.address))} TBNB`);

    // // Send token to accA
    // await tokenA.transfer(accA.address, "10000000000000000000");
    // await tokenB.transfer(accA.address, "10000000000000000000");
    // console.log("Balance token A of Proxy::", await tokenA.balanceOf(proxy.address));
    // console.log("Balance token B of Proxy::", await tokenB.balanceOf(proxy.address));
  });

  it("Test addLiquidity", async() => {
    // // Gọi trực tiếp executeActionDirect
    // // Uncomment để test
    // await addLiquidity(
    //   ownerAcc,
    //   proxy, 
    //   "0x8d008b313c1d6c7fe2982f62d32da7507cf43551", 
    //   "0xae13d989dac2f0debff460ac112a837c89baa7cd", 
    //   "2500", 
    //   "-76150", 
    //   "-67300", 
    //   "668675521294160935",
    //   "1000000000000000", 
    //   "0", 
    //   "0", 
    //   "0x595622cbd0fc4727df476a1172ada30a9ddf8f43", 
    //   "2688452425",
    //   "0x595622cbd0fc4727df476a1172ada30a9ddf8f43"
    // );
  });
  it("Test createPool", async() => {
    // // Phải tạo lại 2 token mới và thế vào env nhé
    // // Action này createPool r cung vào pool luôn
    // // Lỗi lạ xuất hiện là do thiếu gasLimit
    await createPool(
      ownerAcc,
      proxy, 
      process.env.TOKEN_B_TEST2, 
      process.env.TOKEN_A_TEST2, 
      "2500", 
      "-28150", 
      "-26050", 
      "145075268333520540069",
      "10000000000000000000",
      "0", 
      "0", 
      "0x595622cbd0fc4727df476a1172ada30a9ddf8f43", 
      "2688452425",
      "0x595622cbd0fc4727df476a1172ada30a9ddf8f43",
      '20456476331960289157024907122'
    );
  });
  it("Test increaseLiquidity", async() => {
    // await increaseLiquidity(
    //   proxy, 
    //   process.env.TOKEN_A_TEST, 
    //   process.env.TOKEN_B_TEST, 
    //   "2992", 
    //   "21148100000000000", 
    //   "1000000000000", 
    //   "0", 
    //   "0", 
    //   "2688452425", 
    //   "0x595622cbd0fc4727df476a1172ada30a9ddf8f43"
    // );
  });
  it("Test Collect", async() => {
    // // Chú ý phải approve cho proxy.address được phép dùng Token bằng INonFungiblePositionManager.approve(proxyaddress, 2993) => ta đã làm nó trong bscscan(https://testnet.bscscan.com/address/0x427bF5b37357632377eCbEC9de3626C71A5396c1#writeContract), phải code ra. Bản thân nó là ERC721
    // await collectLiquidity(
    //   ownerAcc, proxy, "2993", "0x595622cbd0fc4727df476a1172ada30a9ddf8f43", 100000000000000, 100000000000000
    // );
  });
  it("Test Remove", async() => {
    // // Chú ý phải approve cho proxy.address được phép dùng Token bằng INonFungiblePositionManager.approve(proxyaddress, 2993) => ta đã làm nó trong bscscan(https://testnet.bscscan.com/address/0x427bF5b37357632377eCbEC9de3626C71A5396c1#writeContract), phải code ra. Bản thân nó là ERC721
    // await removeLiquidity(
    //   ownerAcc, proxy, "2994", "1000", 0, 0, 2688452425
    // );
  });
  it("Test SwapExactTokensForTokens", async() => {
    // // Test này thao tác với pool token đã có ở v2 nhưng chưa có tiền gì nên sẽ lỗi. Hàm createPool trên là v3 mà, ít nhất để có pool phải gọi vào creataPair ở contract Factory của v2 trước
    // // V2 swap dùng ERC20, V3 dùng ERC721 nên đương nhiên khác nhau. Ở trên ta create pool với C3 và phải dùng V3 để swap
    // // Ta sẽ dùng accountA để swap mà k dùng account owner
    // // Đầu tiên gửi TOKEN_A_TEST2 cho accA cho nó có đủ tiền
    // const tokenA = (await hre.ethers.getContractAt("ERC20Mock", process.env.TOKEN_A_TEST2)).connect(ownerAcc);
    // // await tokenA.transfer(accA.address, "1000000000000000000");
    // console.log("Balance token A of accA::", await tokenA.balanceOf(accA.address));

    // // Lấy proxy của accA để thực hiện thông qua proxy
    // const proxyA = (await getProxy(accA.address)).connect(accA);
    // console.log(`Proxy address:: ${proxyA.address} with balance ${hre.ethers.utils.formatEther(await ethers.provider.getBalance(proxyA.address))} TBNB`);

    // // Phải approve cho router contract => trong contract đã có rồi
    
    // await swapExactTokenForToken(
    //   accA, proxyA, "10000000000", 0, ["0xfFa52085f3a06AD915EDdC70Fe5564F28852A0e0", "0x5FA12BE425b51da9bcd4C835a341E2A3A31dC214"], accA.address, accA.address
    // );
  });
  it("Test SwapExactTokensForTokens", async() => {
    // // Test này là thao tác vói 1 pool token ở v2 đã có sẵn nên thành công.
    // const tokenB = (await hre.ethers.getContractAt("ERC20Mock", process.env.TOKEN_B_TEST));
    // console.log("Before, balance token WBNB of owner::", await tokenB.balanceOf(ownerAcc.address));
    // await swapExactTokenForToken(
    //   ownerAcc, 
    //   proxy, 
    //   "10000000000000000",
    //   "0", 
    //   ["0xae13d989dac2f0debff460ac112a837c89baa7cd","0x8d008b313c1d6c7fe2982f62d32da7507cf43551"], 
    //   ownerAcc.address, 
    //   ownerAcc.address
    // );
  });

  it("Test swapExactInputSingle", async() => {
    // // Ta sẽ dùng accountA để swap mà k dùng account owner
    // // Đầu tiên gửi TOKEN_A_TEST2 cho accA cho nó có đủ tiền
    // const tokenA = (await hre.ethers.getContractAt("ERC20Mock", process.env.TOKEN_A_TEST2)).connect(ownerAcc);
    // // await tokenA.transfer(accA.address, "1000000000000000000");
    // console.log("Balance token A of accA::", await tokenA.balanceOf(accA.address));

    // // Lấy proxy của accA để thực hiện thông qua proxy
    // const proxyA = (await getProxy(accA.address)).connect(accA);
    // console.log(`Proxy address:: ${proxyA.address} with balance ${hre.ethers.utils.formatEther(await ethers.provider.getBalance(proxyA.address))} TBNB`);

    // // Phải approve cho router contract => trong contract đã có rồi
    // await swapExactInputSingle(
    //   accA, 
    //   proxyA, 
    //   process.env.TOKEN_A_TEST2,
    //   process.env.TOKEN_B_TEST2, 
    //   "2500", 
    //   accA.address, 
    //   "1000000000000000",
    //   "0",
    //   "0",
    //   accA.address
    // );
  });

  // it("Test Swap Combinator", async() => {
  //   // Gom thứ tự: Owner create 2 token và cung vào pool -> Owner increase liquidity -> Owner gọi swap luôn trên pool của chính mình -> Owner remove liquidity -> Owner gọi collect pool đó
  //   await combinatorPancakeswap(ownerAcc, proxy);
  // }).timeout(100000000000);

  it("Test pancake trava", async() => {
    // Owner swap tbnb sang trava, sau đó dùng trava để buy nft rồi gửi nft đó cho accA
    await combinator(ownerAcc, accA, proxy);
  }).timeout(100000000000);

});
