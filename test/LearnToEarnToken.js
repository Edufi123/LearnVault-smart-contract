// SPDX-License-Identifier: MIT
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("LearnToEarnToken Contract", function () {
    let LearnToEarnToken;
    let token;
    let owner;
    let user1;
    let user2;
    let rewardToken;

    beforeEach(async function () {
        [owner, user1, user2] = await ethers.getSigners();

        // Deploy a mock reward token
        const RewardToken = await ethers.getContractFactory("ERC20");
        rewardToken = await RewardToken.deploy("RewardToken", "RWD");
        await rewardToken.deployed();

        // Deploy the LearnToEarnToken contract
        LearnToEarnToken = await ethers.getContractFactory("LearnToEarnToken");
        token = await LearnToEarnToken.deploy(rewardToken.address);
        await token.deployed();

        // Mint some tokens to user1 for testing
        await token.connect(owner).completeTask(1, 5); // User1 completes a task
        await token.connect(owner).completeTask(2, 3); // User1 completes another task
    });

    it("should allow users to complete tasks and mint tokens", async function () {
        const balance = await token.balanceOf(user1.address);
        expect(balance).to.equal(80); // 5*10 + 3*10 = 80 tokens
    });

    it("should allow users to stake tokens", async function () {
        await token.connect(user1).stakeTokens(50);
        const stakeInfo = await token.getStakingInfo(user1.address);
        expect(stakeInfo[0]).to.equal(50); // Staked amount
        expect(stakeInfo[2]).to.equal(true); // Is staking
    });

    it("should allow users to withdraw stakes and yield", async function () {
        await token.connect(user1).stakeTokens(50);
        // Simulate time passing for yield calculation
        await ethers.provider.send("evm_increaseTime", [3600]); // 1 hour
        await ethers.provider.send("evm_mine"); // Mine a new block

        // Mock the DeFi protocol's yield calculation
        await token.setDeFiProtocol(owner.address); // Set the owner as the DeFi protocol for testing
        await token.connect(owner).setDeFiProtocol(owner.address); // Set the DeFi protocol

        // Withdraw stake
        await token.connect(user1).withdrawStake();
        const balanceAfterWithdraw = await token.balanceOf(user1.address);
        expect(balanceAfterWithdraw).to.be.greaterThan(80); // Expect balance to be greater than 80 due to yield
    });
});
