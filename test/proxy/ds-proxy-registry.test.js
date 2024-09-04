const { ethers } = require("hardhat");

let user1, user2, user3;

let dsProxyFactory, DSProxyFactory;
let dsProxyRegistry, DSProxyRegistry;
let dsProxy, DSProxy;
let token, Token;
let test, Test;

beforeEach(async () => {
  [user] = await ethers.getSigners();

  DSProxyFactory = await ethers.getContractFactory("DSProxyFactory");
  dsProxyFactory = await DSProxyFactory.deploy();
  await dsProxyFactory.deployed();

  DSProxyRegistry = await ethers.getContractFactory("DSProxyRegistry");
  dsProxyRegistry = await DSProxyRegistry.deploy(dsProxyFactory.address);
  await dsProxyRegistry.deployed();

  
  
});

describe("DSProxyFactory", () => {
  it("Should deploy DSProxy", async () => {
  console.log("DSProxyFactory deployed to:", dsProxyFactory.address);
  console.log("DSProxyRegistry deployed to:", dsProxyRegistry.address);
  let tx = await dsProxyRegistry.build(user.address); // real project must be listen event
  await tx.wait();
  let dsProxyAddress = await dsProxyRegistry.proxies(user.address);
  console.log("dsProxyAddress", dsProxyAddress);

  });
});

//   it("build proxy", async () => {
//     await dsProxyRegistry.build(user.address); // real project must be listen event
//     let dsProxyAddress = await dsProxyRegistry.proxies(user1.address);
//     console.log("dsProxyAddress", dsProxyAddress);

//     // await dsProxyFactory.build(); // real project must be listen event

//     // const user1Proxy = await dsProxyFactory.listProxy(user1.address, 1);
//     // console.log("user1Proxy", user1Proxy);

//     dsProxy = await ethers.getContractAt("DSProxy", dsProxyAddress);
//     console.log("dsProxy", dsProxy.address);

//     // approve proxy to spend token
//     await token.approve(dsProxy.address, ethers.utils.parseEther("100"));
//     // await test.transfer(user2.address, ethers.utils.parseEther("1"));
//     let calldata = await test.interface.encodeFunctionData("setToken", [
//       token.address,
//     ]);
//     await dsProxy.executeTarget(test.address, calldata);

//     calldata = await test.interface.encodeFunctionData("transferToken", [
//       user2.address,
//       ethers.utils.parseEther("1"),
//     ]);

//     await dsProxy.executeTarget(test.address, calldata);

//     // test excute but don't work :)
//     // calldata = await test.interface.encodeFunctionData("transferToken", [
//     //   user2.address,
//     //   ethers.utils.parseEther("2"),
//     // ]);

//     // // get test contract bytecode
//     // const TestBytecode = await ethers.provider.getCode(test.address);
//     // console.log("TestBytecode", TestBytecode);
//     // await dsProxy.execute(TestBytecode, calldata);
//   });

//   }
// );

