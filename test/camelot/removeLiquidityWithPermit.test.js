const hre = require("hardhat");
const abiCoder = new hre.ethers.utils.AbiCoder();
const { keccak256, toUtf8Bytes } = require("ethers/lib/utils");
require("dotenv").config();

const { Action } = require("../teststrategy/Action");
const { getProxy, approve } = require("../utils");
const { ethers } = require("ethers");
const { ecsign, bufferToHex } = require('ethereumjs-util');
//const { keccak256 } = require("web3-utils");
const { MAX_UINT256 } = require("trava-simulation-route");

describe("removeLiquidityWithPermit", function () {
    this.timeout(150000);
    console.log("hello");
    it("Test addLiquidityC", async () => {
      const proxy = await getProxy(process.env.PUBLIC_KEY);
      const router = process.env.ROUTER;
      const tokenAAddr = process.env.TOKENA;
      const tokenBAddr = process.env.TOKENB;
      const tokenPair = process.env.PAIR;
      const from = process.env.PUBLIC_KEY;
      const deadline = Math.floor(Date.now() / 1000) + 3600;
      const approveMax = false;
      const liquidity = 10;
      const amountAmin = hre.ethers.BigNumber.from("0");
      const amountBmin = hre.ethers.BigNumber.from("0");
      const tokenpair = await hre.ethers.getContractAt("ICamelotPair",tokenPair);
      console.log("Tokenpair: ", tokenpair.address);
      const nonce = await tokenpair.nonces(from);
      console.log("nonce", nonce);
      const domain = await tokenpair.DOMAIN_SEPARATOR();
      console.log("domain: ", domain);
    //   const tx1 = await tokenpair.approve(proxy.address, 10**11);
    //   await tx1.wait();
    
      
      const PERMIT_TYPEHASH = ethers.utils.keccak256(
        ethers.utils.toUtf8Bytes("Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)")
    );
      console.log("permit_typehash", PERMIT_TYPEHASH);
      const name = await tokenpair.name();
      console.log("name: ", name);
      const version = "1";
      const chainId = 97;
      const verifyingContract = tokenpair.address; 

      const DOMAIN_SEPARATOR = ethers.utils.keccak256(
        ethers.utils.defaultAbiCoder.encode(
            ["bytes32", "bytes32", "bytes32", "uint256", "address"],
            [
                ethers.utils.keccak256(ethers.utils.toUtf8Bytes('EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)')),
                ethers.utils.keccak256(ethers.utils.toUtf8Bytes(name)),
                ethers.utils.keccak256(ethers.utils.toUtf8Bytes(version)),
                chainId,
                verifyingContract
            ]
        )
    );

    console.log("DOMAIN_SEPARATOR", DOMAIN_SEPARATOR);

    const digest = ethers.utils.keccak256(
        ethers.utils.solidityPack(
            ["bytes1", "bytes1", "bytes32", "bytes32"],
            [
                '0x19',  
                '0x01',
                DOMAIN_SEPARATOR,
                ethers.utils.keccak256(
                    ethers.utils.defaultAbiCoder.encode(
                        ["bytes32", "address", "address", "uint256", "uint256", "uint256"],
                        [PERMIT_TYPEHASH, from, proxy.address, liquidity, nonce, deadline]
                    )
                )
            ]
        )
    );
    console.log("digest:", digest);

    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY);
    console.log("wallet: ", wallet);
    
    const signature = wallet._signingKey().signDigest(ethers.utils.arrayify(digest)); 
    const { v, r, s } = ethers.utils.splitSignature(signature);
    // Phục hồi địa chỉ từ chữ ký
    const recoveredAddress = ethers.utils.recoverAddress(digest, { v, r, s });
    console.log("wallet", wallet.address);
    console.log("Recovered address:", recoveredAddress);


   
      console.log("remove LiquidityC");

      
  
      const removeLiquidityWithPermit = new Action(
        "removeLiquidityWithPermit",
        process.env.REMOVELIQUIDITYWITHPERMIT,
        ["address", "address", "address","address", "uint256","uint256","uint256","uint256","address", "bool", "uint8", "bytes32", "bytes32"],
        [router, tokenAAddr, tokenBAddr, tokenPair, liquidity, amountAmin, amountBmin, deadline, from, approveMax, v, r, s]
      );
  
      // const calldata = traveSupply.encodeForRecipe()[0];
      const callData = removeLiquidityWithPermit.encodeForDsProxyCall()[1];
  
      console.log("callData", callData);
  
      const removeLiquidityWithPermitContract = await hre.ethers.getContractAt(
        "removeLiquidityWithPermit",
        process.env.REMOVELIQUIDITYWITHPERMIT
      );

      console.log("removeliquidityWithPermit_address",removeLiquidityWithPermitContract.address);
  
      // call receive function in proxy contract to send BNB to proxy
      // const ownerAcc = (await hre.ethers.getSigners())[0];
      // await ownerAcc.sendTransaction({
      //   to: proxy.address,
      //   value: amount + amount,
      // });

    
  
      let tx = await proxy["execute(address,bytes)"](
        removeLiquidityWithPermitContract.address,
        callData,
        {
          gasLimit: 20000000,
        }
      );
      console.log("wait");
      tx = await tx.wait();
      
      console.log("tx", tx);
    });
  });