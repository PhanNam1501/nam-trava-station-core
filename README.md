# Trava-station-core
# Table of contents
- [How to create a smart wallet](#how-to-create-a-smart-wallet)
   - [Build Smart Wallet](#build-smart-wallet)
   - [ABI Proxy Registry](#abi-proxy-registry)
   - [Address proxy registry](#address-proxy-registry)
- [How to get smart wallet address](#how-to-get-smart-wallet-address)
- [How to execute Recipe](#how-to-execute-recipe)
- [How to simulate State](#how-to-simulate-state)

# How to create a smart wallet
Gọi hàm build() của contract DSProxyRegistry. Sử dụng ABI và address contract ProxyRegistry ở dưới đây
## Build Smart Wallet
```
let txBuildProxy = await proxyRegistryContract.build();
await txBuildProxy.wait();
```
## ABI Proxy Registry
```
[
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "factory_",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "build",
      "outputs": [
        {
          "internalType": "address payable",
          "name": "proxy",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "buildProxy",
      "outputs": [
        {
          "internalType": "address payable",
          "name": "proxy",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "proxies",
      "outputs": [
        {
          "internalType": "contract DSProxy",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ]
```
## Address Proxy Registry
xem tại dòng 58 và 59 tại tab [contract ở đây](https://docs.google.com/spreadsheets/d/1cfiQriXFPfswuYSCeZ_KTe5uSv7ZVbqn/edit?usp=sharing&ouid=108123495703487530147&rtpof=true&sd=true)

# How to get smart wallet address
let smartWalletAddress = await proxyRegistryContract.proxies();

# How to execute Recipe
Xem hướng dẫn chi tiết tại readme [trava-station-sdk](https://www.npmjs.com/package/trava-station-sdk)
# How to simulate state
Xem hướng dẫn chi tiết tại readme [trava-simulation-route](https://www.npmjs.com/package/trava-simulation-route)
