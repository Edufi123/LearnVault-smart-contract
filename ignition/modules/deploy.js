require('dotenv').config();
const { ethers } = require('hardhat');

async function main() {

    // Get the contract factory
    const LearnToEarnToken = await ethers.getContractFactory("LearnToEarnToken");

    // Replace with the address of the reward token you want to use
    const rewardTokenAddress = process.env.REWARD_TOKEN_ADDRESS;

    // Deploy the contract
    const learnToEarnToken = await LearnToEarnToken.deploy(rewardTokenAddress);

    // Wait for the deployment to be mined
    // await learnToEarnToken.deployed();

    console.log("LearnToEarnToken deployed to:", learnToEarnToken.target);
}

// Execute the main function
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
