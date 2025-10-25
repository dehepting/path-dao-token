const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("PATHTimelock", function () {
  let pathToken;
  let timelock;
  let owner, recipient, otherUser;

  const LOCK_AMOUNT = ethers.parseEther("10000000"); // 10M tokens
  const LOCK_DURATION = 730 * 24 * 60 * 60; // 2 years in seconds

  beforeEach(async function () {
    [owner, recipient, otherUser] = await ethers.getSigners();

    // Deploy PATH token
    const PATH = await ethers.getContractFactory("PATH");
    pathToken = await upgrades.deployProxy(
      PATH,
      [owner.address, owner.address, owner.address, owner.address, owner.address],
      { initializer: "initialize", kind: "uups" }
    );
    await pathToken.waitForDeployment();

    // Deploy timelock
    const PATHTimelock = await ethers.getContractFactory("PATHTimelock");
    timelock = await PATHTimelock.deploy(await pathToken.getAddress());
    await timelock.waitForDeployment();

    // Transfer tokens to timelock
    await pathToken.transfer(await timelock.getAddress(), LOCK_AMOUNT);
  });

  describe("Deployment", function () {
    it("Should set the correct PATH token address", async function () {
      expect(await timelock.pathToken()).to.equal(await pathToken.getAddress());
    });

    it("Should set the correct owner", async function () {
      expect(await timelock.owner()).to.equal(owner.address);
    });

    it("Should set unlock time to 2 years from deployment", async function () {
      const unlockTime = await timelock.unlockTime();
      const deployTime = await time.latest();
      // Allow for 1 second difference due to block timing
      expect(unlockTime).to.be.closeTo(deployTime + LOCK_DURATION, 1);
    });

    it("Should start as not unlocked", async function () {
      expect(await timelock.isUnlocked()).to.be.false;
    });

    it("Should reject zero address for token", async function () {
      const PATHTimelock = await ethers.getContractFactory("PATHTimelock");
      await expect(
        PATHTimelock.deploy(ethers.ZeroAddress)
      ).to.be.revertedWith("Invalid token address");
    });
  });

  describe("Lock Status", function () {
    it("Should return correct locked balance", async function () {
      expect(await timelock.getLockedBalance()).to.equal(LOCK_AMOUNT);
    });

    it("Should show time until unlock", async function () {
      const timeUntil = await timelock.timeUntilUnlock();
      expect(timeUntil).to.be.closeTo(LOCK_DURATION, 10);
    });

    it("Should remain locked before unlock time", async function () {
      // Fast forward 1 year (half the lock duration)
      await time.increase(365 * 24 * 60 * 60);
      expect(await timelock.isUnlocked()).to.be.false;
    });

    it("Should be unlocked after lock duration", async function () {
      // Fast forward 2 years + 1 day
      await time.increase(LOCK_DURATION + 24 * 60 * 60);
      expect(await timelock.isUnlocked()).to.be.true;
    });

    it("Should show zero time until unlock when unlocked", async function () {
      await time.increase(LOCK_DURATION + 1);
      expect(await timelock.timeUntilUnlock()).to.equal(0);
    });
  });

  describe("Withdrawal", function () {
    it("Should prevent withdrawal before unlock time", async function () {
      await expect(
        timelock.withdraw(recipient.address)
      ).to.be.revertedWith("Tokens still locked");
    });

    it("Should allow withdrawal after unlock time", async function () {
      // Fast forward past unlock time
      await time.increase(LOCK_DURATION + 1);

      await timelock.withdraw(recipient.address);

      expect(await pathToken.balanceOf(recipient.address)).to.equal(LOCK_AMOUNT);
      expect(await timelock.getLockedBalance()).to.equal(0);
    });

    it("Should prevent double withdrawal", async function () {
      await time.increase(LOCK_DURATION + 1);

      await timelock.withdraw(recipient.address);

      await expect(
        timelock.withdraw(recipient.address)
      ).to.be.revertedWith("Already withdrawn");
    });

    it("Should only allow owner to withdraw", async function () {
      await time.increase(LOCK_DURATION + 1);

      await expect(
        timelock.connect(otherUser).withdraw(recipient.address)
      ).to.be.reverted; // Ownable: caller is not the owner
    });

    it("Should reject withdrawal to zero address", async function () {
      await time.increase(LOCK_DURATION + 1);

      await expect(
        timelock.withdraw(ethers.ZeroAddress)
      ).to.be.revertedWith("Invalid recipient");
    });

    it("Should emit TokensWithdrawn event", async function () {
      await time.increase(LOCK_DURATION + 1);

      await expect(timelock.withdraw(recipient.address))
        .to.emit(timelock, "TokensWithdrawn")
        .withArgs(recipient.address, LOCK_AMOUNT);
    });
  });

  describe("Emergency Cancel", function () {
    it("Should only work when balance is zero", async function () {
      // Should fail with tokens deposited
      await expect(
        timelock.emergencyCancel()
      ).to.be.revertedWith("Tokens already deposited");
    });

    it("Should work before tokens are deposited", async function () {
      // Deploy fresh timelock without tokens
      const PATHTimelock = await ethers.getContractFactory("PATHTimelock");
      const freshTimelock = await PATHTimelock.deploy(await pathToken.getAddress());
      await freshTimelock.waitForDeployment();

      // Emergency cancel should work
      await expect(freshTimelock.emergencyCancel()).to.not.be.reverted;
    });
  });

  describe("Ownership Transfer", function () {
    it("Should allow owner to transfer ownership", async function () {
      await timelock.transferOwnership(otherUser.address);
      expect(await timelock.owner()).to.equal(otherUser.address);
    });

    it("Should allow new owner to withdraw after unlock", async function () {
      await timelock.transferOwnership(otherUser.address);
      await time.increase(LOCK_DURATION + 1);

      await timelock.connect(otherUser).withdraw(recipient.address);

      expect(await pathToken.balanceOf(recipient.address)).to.equal(LOCK_AMOUNT);
    });
  });

  describe("Edge Cases", function () {
    it("Should handle withdrawal at exact unlock time", async function () {
      const unlockTime = await timelock.unlockTime();
      await time.increaseTo(unlockTime);

      await timelock.withdraw(recipient.address);

      expect(await pathToken.balanceOf(recipient.address)).to.equal(LOCK_AMOUNT);
    });

    it("Should handle multiple balance checks", async function () {
      expect(await timelock.getLockedBalance()).to.equal(LOCK_AMOUNT);
      expect(await timelock.getLockedBalance()).to.equal(LOCK_AMOUNT);
      expect(await timelock.getLockedBalance()).to.equal(LOCK_AMOUNT);
    });

    it("Should correctly calculate time remaining at different points", async function () {
      // At start
      let remaining = await timelock.timeUntilUnlock();
      expect(remaining).to.be.closeTo(LOCK_DURATION, 10);

      // After 6 months
      await time.increase(180 * 24 * 60 * 60);
      remaining = await timelock.timeUntilUnlock();
      expect(remaining).to.be.closeTo(LOCK_DURATION - (180 * 24 * 60 * 60), 100);

      // After 1 year
      await time.increase(185 * 24 * 60 * 60);
      remaining = await timelock.timeUntilUnlock();
      expect(remaining).to.be.closeTo(LOCK_DURATION - (365 * 24 * 60 * 60), 100);
    });
  });
});
