const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("PATHVesting", function () {
  let pathToken;
  let vesting;
  let owner, beneficiary1, beneficiary2, otherUser;

  const VESTING_AMOUNT = ethers.parseEther("11000000"); // 11M tokens
  const CLIFF_MONTHS = 6;
  const VESTING_MONTHS = 48;

  beforeEach(async function () {
    [owner, beneficiary1, beneficiary2, otherUser] = await ethers.getSigners();

    // Deploy a mock ERC20 token for testing
    const MockERC20 = await ethers.getContractFactory("PATH");
    pathToken = await upgrades.deployProxy(
      MockERC20,
      [owner.address, owner.address, owner.address, owner.address, owner.address],
      { initializer: "initialize", kind: "uups" }
    );
    await pathToken.waitForDeployment();

    // Token already has 100M minted to owner at deployment, no need to mint more

    // Deploy vesting contract
    const PATHVesting = await ethers.getContractFactory("PATHVesting");
    vesting = await PATHVesting.deploy(await pathToken.getAddress());
    await vesting.waitForDeployment();

    // Transfer tokens to vesting contract
    await pathToken.transfer(await vesting.getAddress(), VESTING_AMOUNT * 2n);
  });

  describe("Deployment", function () {
    it("Should set the correct token address", async function () {
      expect(await vesting.pathToken()).to.equal(await pathToken.getAddress());
    });

    it("Should set the correct owner", async function () {
      expect(await vesting.owner()).to.equal(owner.address);
    });

    it("Should reject zero address for token", async function () {
      const PATHVesting = await ethers.getContractFactory("PATHVesting");
      await expect(
        PATHVesting.deploy(ethers.ZeroAddress)
      ).to.be.revertedWith("Invalid token address");
    });
  });

  describe("Creating Vesting Schedules", function () {
    it("Should create vesting schedule successfully", async function () {
      const startTime = await time.latest();

      await expect(
        vesting.createVestingSchedule(
          beneficiary1.address,
          VESTING_AMOUNT,
          startTime,
          CLIFF_MONTHS,
          VESTING_MONTHS
        )
      ).to.emit(vesting, "VestingScheduleCreated")
        .withArgs(
          beneficiary1.address,
          VESTING_AMOUNT,
          startTime,
          CLIFF_MONTHS * 30 * 24 * 60 * 60,
          VESTING_MONTHS * 30 * 24 * 60 * 60
        );
    });

    it("Should store vesting schedule correctly", async function () {
      const startTime = await time.latest();

      await vesting.createVestingSchedule(
        beneficiary1.address,
        VESTING_AMOUNT,
        startTime,
        CLIFF_MONTHS,
        VESTING_MONTHS
      );

      const schedule = await vesting.vestingSchedules(beneficiary1.address);
      expect(schedule.totalAmount).to.equal(VESTING_AMOUNT);
      expect(schedule.amountClaimed).to.equal(0);
      expect(schedule.startTime).to.equal(startTime);
      expect(schedule.cliffDuration).to.equal(CLIFF_MONTHS * 30 * 24 * 60 * 60);
      expect(schedule.vestingDuration).to.equal(VESTING_MONTHS * 30 * 24 * 60 * 60);
    });

    it("Should prevent creating schedule for zero address", async function () {
      const startTime = await time.latest();

      await expect(
        vesting.createVestingSchedule(
          ethers.ZeroAddress,
          VESTING_AMOUNT,
          startTime,
          CLIFF_MONTHS,
          VESTING_MONTHS
        )
      ).to.be.revertedWith("Invalid beneficiary");
    });

    it("Should prevent creating schedule with zero amount", async function () {
      const startTime = await time.latest();

      await expect(
        vesting.createVestingSchedule(
          beneficiary1.address,
          0,
          startTime,
          CLIFF_MONTHS,
          VESTING_MONTHS
        )
      ).to.be.revertedWith("Amount must be > 0");
    });

    it("Should prevent creating duplicate schedule", async function () {
      const startTime = await time.latest();

      await vesting.createVestingSchedule(
        beneficiary1.address,
        VESTING_AMOUNT,
        startTime,
        CLIFF_MONTHS,
        VESTING_MONTHS
      );

      await expect(
        vesting.createVestingSchedule(
          beneficiary1.address,
          VESTING_AMOUNT,
          startTime,
          CLIFF_MONTHS,
          VESTING_MONTHS
        )
      ).to.be.revertedWith("Schedule already exists");
    });

    it("Should prevent creating schedule without sufficient balance", async function () {
      const startTime = await time.latest();
      const tooMuch = VESTING_AMOUNT * 10n;

      await expect(
        vesting.createVestingSchedule(
          beneficiary1.address,
          tooMuch,
          startTime,
          CLIFF_MONTHS,
          VESTING_MONTHS
        )
      ).to.be.revertedWith("Insufficient balance");
    });

    it("Should only allow owner to create schedules", async function () {
      const startTime = await time.latest();

      await expect(
        vesting.connect(otherUser).createVestingSchedule(
          beneficiary1.address,
          VESTING_AMOUNT,
          startTime,
          CLIFF_MONTHS,
          VESTING_MONTHS
        )
      ).to.be.reverted;
    });
  });

  describe("Claimable Amount Calculation", function () {
    let startTime;

    beforeEach(async function () {
      startTime = await time.latest();
      await vesting.createVestingSchedule(
        beneficiary1.address,
        VESTING_AMOUNT,
        startTime,
        CLIFF_MONTHS,
        VESTING_MONTHS
      );
    });

    it("Should return zero before cliff", async function () {
      const cliffDuration = CLIFF_MONTHS * 30 * 24 * 60 * 60;
      await time.increase(cliffDuration - 1);

      expect(await vesting.claimableAmount(beneficiary1.address)).to.equal(0);
    });

    it("Should return zero for non-existent schedule", async function () {
      expect(await vesting.claimableAmount(beneficiary2.address)).to.equal(0);
    });

    it("Should calculate partial vesting correctly", async function () {
      const cliffDuration = CLIFF_MONTHS * 30 * 24 * 60 * 60;
      const vestingDuration = VESTING_MONTHS * 30 * 24 * 60 * 60;

      // Move to 25% through vesting (after cliff)
      await time.increase(cliffDuration + vestingDuration / 4);

      const claimable = await vesting.claimableAmount(beneficiary1.address);
      const expected = VESTING_AMOUNT / 4n;

      // Allow 1% margin for rounding
      expect(claimable).to.be.closeTo(expected, expected / 100n);
    });

    it("Should return full amount after vesting completes", async function () {
      const cliffDuration = CLIFF_MONTHS * 30 * 24 * 60 * 60;
      const vestingDuration = VESTING_MONTHS * 30 * 24 * 60 * 60;

      await time.increase(cliffDuration + vestingDuration);

      expect(await vesting.claimableAmount(beneficiary1.address)).to.equal(VESTING_AMOUNT);
    });

    it("Should account for already claimed tokens", async function () {
      const cliffDuration = CLIFF_MONTHS * 30 * 24 * 60 * 60;
      const vestingDuration = VESTING_MONTHS * 30 * 24 * 60 * 60;

      // Move to 50% through vesting
      await time.increase(cliffDuration + vestingDuration / 2);

      const claimable1 = await vesting.claimableAmount(beneficiary1.address);
      await vesting.connect(beneficiary1).claim();

      // Move to 75% through vesting
      await time.increase(vestingDuration / 4);

      const claimable2 = await vesting.claimableAmount(beneficiary1.address);

      // Second claim should be ~25% of total (75% - 50%)
      const expected = VESTING_AMOUNT / 4n;
      expect(claimable2).to.be.closeTo(expected, expected / 100n);
    });
  });

  describe("Claiming Tokens", function () {
    let startTime;

    beforeEach(async function () {
      startTime = await time.latest();
      await vesting.createVestingSchedule(
        beneficiary1.address,
        VESTING_AMOUNT,
        startTime,
        CLIFF_MONTHS,
        VESTING_MONTHS
      );
    });

    it("Should prevent claiming before cliff", async function () {
      await expect(
        vesting.connect(beneficiary1).claim()
      ).to.be.revertedWith("No tokens to claim");
    });

    it("Should allow claiming after cliff", async function () {
      const cliffDuration = CLIFF_MONTHS * 30 * 24 * 60 * 60;
      const vestingDuration = VESTING_MONTHS * 30 * 24 * 60 * 60;

      // Move past cliff
      await time.increase(cliffDuration + vestingDuration / 4);

      await vesting.connect(beneficiary1).claim();

      const balance = await pathToken.balanceOf(beneficiary1.address);
      expect(balance).to.be.gt(0);
      expect(balance).to.be.closeTo(VESTING_AMOUNT / 4n, VESTING_AMOUNT / 100n);
    });

    it("Should update claimed amount after claiming", async function () {
      const cliffDuration = CLIFF_MONTHS * 30 * 24 * 60 * 60;
      const vestingDuration = VESTING_MONTHS * 30 * 24 * 60 * 60;

      await time.increase(cliffDuration + vestingDuration / 2);

      await vesting.connect(beneficiary1).claim();

      const schedule = await vesting.vestingSchedules(beneficiary1.address);
      const balance = await pathToken.balanceOf(beneficiary1.address);

      expect(schedule.amountClaimed).to.equal(balance);
    });

    it("Should allow multiple claims over time", async function () {
      const cliffDuration = CLIFF_MONTHS * 30 * 24 * 60 * 60;
      const vestingDuration = VESTING_MONTHS * 30 * 24 * 60 * 60;

      // First claim at 25%
      await time.increase(cliffDuration + vestingDuration / 4);
      await vesting.connect(beneficiary1).claim();
      const balance1 = await pathToken.balanceOf(beneficiary1.address);

      // Second claim at 50%
      await time.increase(vestingDuration / 4);
      await vesting.connect(beneficiary1).claim();
      const balance2 = await pathToken.balanceOf(beneficiary1.address);

      expect(balance2).to.be.gt(balance1);
    });

    it("Should allow claiming full amount after vesting ends", async function () {
      const cliffDuration = CLIFF_MONTHS * 30 * 24 * 60 * 60;
      const vestingDuration = VESTING_MONTHS * 30 * 24 * 60 * 60;

      await time.increase(cliffDuration + vestingDuration + 1);

      await vesting.connect(beneficiary1).claim();

      expect(await pathToken.balanceOf(beneficiary1.address)).to.equal(VESTING_AMOUNT);
    });

    it("Should prevent claiming when nothing is available", async function () {
      const cliffDuration = CLIFF_MONTHS * 30 * 24 * 60 * 60;
      const vestingDuration = VESTING_MONTHS * 30 * 24 * 60 * 60;

      await time.increase(cliffDuration + vestingDuration);

      // Claim everything
      await vesting.connect(beneficiary1).claim();

      // Try to claim again
      await expect(
        vesting.connect(beneficiary1).claim()
      ).to.be.revertedWith("No tokens to claim");
    });
  });

  describe("Get Vesting Schedule", function () {
    it("Should return correct schedule details", async function () {
      const startTime = await time.latest();

      await vesting.createVestingSchedule(
        beneficiary1.address,
        VESTING_AMOUNT,
        startTime,
        CLIFF_MONTHS,
        VESTING_MONTHS
      );

      const schedule = await vesting.getVestingSchedule(beneficiary1.address);

      expect(schedule.totalAmount).to.equal(VESTING_AMOUNT);
      expect(schedule.amountClaimed).to.equal(0);
      expect(schedule.claimable).to.equal(0); // Before cliff
      expect(schedule.startTime).to.equal(startTime);
      expect(schedule.cliffEnd).to.equal(startTime + CLIFF_MONTHS * 30 * 24 * 60 * 60);
      expect(schedule.vestingEnd).to.equal(
        startTime + (CLIFF_MONTHS + VESTING_MONTHS) * 30 * 24 * 60 * 60
      );
    });
  });

  // Emergency withdraw removed for security - vesting is truly guaranteed

  describe("Complex Scenarios", function () {
    it("Should handle multiple beneficiaries independently", async function () {
      const startTime = await time.latest();

      // Create schedules for two beneficiaries
      await vesting.createVestingSchedule(
        beneficiary1.address,
        VESTING_AMOUNT,
        startTime,
        CLIFF_MONTHS,
        VESTING_MONTHS
      );

      await vesting.createVestingSchedule(
        beneficiary2.address,
        VESTING_AMOUNT,
        startTime,
        CLIFF_MONTHS,
        VESTING_MONTHS
      );

      const cliffDuration = CLIFF_MONTHS * 30 * 24 * 60 * 60;
      const vestingDuration = VESTING_MONTHS * 30 * 24 * 60 * 60;

      // Move past cliff
      await time.increase(cliffDuration + vestingDuration / 2);

      // Beneficiary 1 claims
      await vesting.connect(beneficiary1).claim();

      // Beneficiary 2 should still have full claimable amount
      expect(await vesting.claimableAmount(beneficiary2.address)).to.be.gt(0);

      await vesting.connect(beneficiary2).claim();
      const balance2 = await pathToken.balanceOf(beneficiary2.address);

      expect(balance2).to.be.gt(0);
      expect(balance2).to.be.closeTo(VESTING_AMOUNT / 2n, VESTING_AMOUNT / 100n);
    });

    it("Should handle partial claims correctly", async function () {
      const startTime = await time.latest();

      await vesting.createVestingSchedule(
        beneficiary1.address,
        VESTING_AMOUNT,
        startTime,
        CLIFF_MONTHS,
        VESTING_MONTHS
      );

      const cliffDuration = CLIFF_MONTHS * 30 * 24 * 60 * 60;
      const vestingDuration = VESTING_MONTHS * 30 * 24 * 60 * 60;

      // Claim at 10%, 20%, 30%, ..., 100%
      for (let i = 1; i <= 10; i++) {
        await time.increase(vestingDuration / 10);
        if (i === 1) {
          await time.increase(cliffDuration);
        }

        const claimable = await vesting.claimableAmount(beneficiary1.address);
        if (claimable > 0) {
          await vesting.connect(beneficiary1).claim();
        }
      }

      // Should have claimed everything
      expect(await pathToken.balanceOf(beneficiary1.address)).to.equal(VESTING_AMOUNT);
    });
  });
});
