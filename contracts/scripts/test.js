const hre = require("hardhat");

// Returns the Ether balance of a given address.
async function getBalance(address) {
    const balanceBigInt = await hre.ethers.provider.getBalance(address);
    return hre.ethers.utils.formatEther(balanceBigInt);
}

// Logs the Ether balances for a list of addresses.
async function printBalances(addresses) {
    console.log("======================================================");
    for (const { name, address } of addresses) {
        console.log(`${name} balance>> `, await getBalance(address));
    }
    console.log("======================================================");
}

// Logs the memos stored on-chain from toffee purchases.
async function printMemos(memos) {
    for (const memo of memos) {
        const timestamp = memo.timestamp;
        const tipper = memo.name;
        const tipperAddress = memo.from;
        const message = memo.message;
        console.log(
            `At ${timestamp}, ${tipper} (${tipperAddress}) said: "${message}"`
        );
    }
}

async function main() {
    // Get the example accounts we'll be working with.
    const [user1, user2, tipper1, tipper2, tipper3] =
        await hre.ethers.getSigners();

    // We get the contract to deploy.
    const BuyMeAToffee = await hre.ethers.getContractFactory("BuyMeAToffee");
    const buyMeAToffee = await BuyMeAToffee.deploy();

    // Deploy the contract.
    await buyMeAToffee.deployed();
    console.log("BuyMeAToffee deployed to:", buyMeAToffee.address);

    const addresses = [
        { name: "User1", address: user1.address },
        { name: "User2", address: user2.address },
        { name: "Tipper1", address: tipper1.address },
        { name: "Tipper2", address: tipper2.address },
        { name: "Tipper3", address: tipper3.address },
        { name: "Buy me a toffee", address: buyMeAToffee.address },
    ];

    await printBalances(addresses);

    //create user1
    await buyMeAToffee
        .connect(user1)
        .addUser("User One", "Hello this is user 1");
    console.log("User created");

    //create user2
    await buyMeAToffee.connect(user2).addUser("User Two", "Sup this is user 2");
    console.log("User created");

    await printBalances(addresses);
    await buyMeAToffee
        .getUser(user1.address)
        .then(data => console.log("User1 data >> ", data));
    await buyMeAToffee
        .getMemos(user1.address)
        .then(data => console.log("User1 memos >> ", data));
    await buyMeAToffee
        .getUser(user2.address)
        .then(data => console.log("User2 data >> ", data));
    await buyMeAToffee
        .getMemos(user2.address)
        .then(data => console.log("User2 memos >> ", data));

    const tip = { value: hre.ethers.utils.parseEther("1") };
    //tip user1
    await buyMeAToffee
        .connect(tipper1)
        .buyToffee(
            user1.address,
            "Tipper 1",
            "Comment from Tipper 1 to User 1",
            true,
            tip
        );
    await buyMeAToffee
        .connect(tipper2)
        .buyToffee(
            user1.address,
            "Tipper 2",
            "Comment from Tipper 2 to User 1",
            false,
            tip
        );
    await buyMeAToffee
        .connect(tipper3)
        .buyToffee(
            user1.address,
            "Tipper 3",
            "Comment from Tipper 3 to User 1",
            false,
            tip
        );

    //tip user2
    await buyMeAToffee
        .connect(tipper1)
        .buyToffee(
            user2.address,
            "Tipper 1",
            "Comment from Tipper 1 to User 2",
            true,
            tip
        );
    await buyMeAToffee
        .connect(tipper2)
        .buyToffee(
            user2.address,
            "Tipper 2",
            "Comment from Tipper 2 to User 2",
            false,
            tip
        );

    await printBalances(addresses);
    await buyMeAToffee
        .getUser(user1.address)
        .then(data => console.log("User1 data >> ", data));
    await buyMeAToffee
        .getMemos(user1.address)
        .then(data => console.log("User1 memos >> ", data));
    await buyMeAToffee
        .getUser(user2.address)
        .then(data => console.log("User2 data >> ", data));
    await buyMeAToffee
        .getMemos(user2.address)
        .then(data => console.log("User2 memos >> ", data));

    // withdraw from user1
    await buyMeAToffee.connect(user1).withdraw(user1.address);

    await printBalances(addresses);
    await buyMeAToffee
        .getUser(user1.address)
        .then(data => console.log("User1 data >> ", data));

    // console.log("user created");
    // await buyMeAToffee.addUser("asd", "Owner", "description");
    // console.log("user created");
    // const user = await buyMeAToffee.isValidUser("asd1");
    // console.log("isValidUser >> ", user);

    // // Check balances before the toffee purchase.
    // const addresses = [owner.address, tipper.address, buyMeAToffee.address];
    // console.log("== start ==");
    // await printBalances(addresses);

    // // Buy the owner a few toffees.
    // const tip = { value: hre.ethers.utils.parseEther("1") };
    // await buyMeAToffee
    //     .connect(tipper)
    //     .buyToffee("Carolina", "You're the best!", tip);
    // await buyMeAToffee
    //     .connect(tipper2)
    //     .buyToffee("Vitto", "Amazing teacher", tip);
    // await buyMeAToffee
    //     .connect(tipper3)
    //     .buyToffee("Kay", "I love my Proof of Knowledge", tip);

    // // Check balances after the toffee purchase.
    // console.log("== bought toffee ==");
    // await printBalances(addresses);

    // // Withdraw.
    // await buyMeAToffee.connect(owner).withdrawTips();

    // // Check balances after withdrawal.
    // console.log("== withdrawTips ==");
    // await printBalances(addresses);

    // // Check out the memos.
    // console.log("== memos ==");
    // const memos = await buyMeAToffee.getMemos();
    // printMemos(memos);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
