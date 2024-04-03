const { writeToEnvFile } = require("./utils/helper");
require("dotenv").config();

async function main() {
    const bothAuth = await (await hre.ethers.getContractFactory("BotAuth")).attach(process.env.BOT_AUTH_ADDRESS);
    const nBot = [
        "0xB8aAf0C56C222fD40d07aCA3182c674c041ded77",
        "0x5BcC94fFD3Afe24418481f713d29EEFf0c5E6296",
        "0x5a40BFDfD93DBF62DAE5873Ee5434E115831aD58",
        "0x68c372E9903B34ea9968d735414cF5eb7edB1c2e",
        "0x65d30f8538eB5320d92faceBb14c1FEC37F4FBf0"
    ]

    for(let i = 0; i < nBot.length; i++) {
        // console.log(process.env[`BOT_ACC_${i}`], `BOT_ACC_${i}`)
        let tx = await bothAuth.addCaller(nBot[i]);
        await tx.wait()
        console.log("setup bot ", i, " successed! ")
    }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
