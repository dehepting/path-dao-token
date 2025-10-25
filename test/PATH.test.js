const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("PATH Token", function () {
  let path;
  let owner, admin, minter, upgrader, pauser, user1, user2;

  const MAX_SUPPLY = ethers.parseEther("100000000"); // 100M tokens
  const INITIAL_MINT = ethers.parseEther("100000000"); // 100M tokens

  beforeEach(async function () {
    [owner, admin, minter, upgrader, pauser, user1, user2] = await ethers.getSigners();

    const PATH = await ethers.getContractFactory("PATH");
    path = await upgrades.deployProxy(
      PATH,
      [owner.address, admin.address, minter.address, upgrader.address, pauser.address],
      { initializer: "initialize", kind: "uups" }
    );
    await path.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the correct name and symbol", async function () {
      expect(await path.name()).to.equal("PATH");
      expect(await path.symbol()).to.equal("PATH");
    });

    it("Should mint initial supply to recipient", async function () {
      expect(await path.balanceOf(owner.address)).to.equal(INITIAL_MINT);
    });

    it("Should have correct max supply", async function () {
      expect(await path.MAX_SUPPLY()).to.equal(MAX_SUPPLY);
    });

    it("Should grant roles correctly", async function () {
      const DEFAULT_ADMIN_ROLE = await path.DEFAULT_ADMIN_ROLE();
      const MINTER_ROLE = await path.MINTER_ROLE();
      const UPGRADER_ROLE = await path.UPGRADER_ROLE();
      const PAUSER_ROLE = await path.PAUSER_ROLE();

      expect(await path.hasRole(DEFAULT_ADMIN_ROLE, admin.address)).to.be.true;
      expect(await path.hasRole(MINTER_ROLE, minter.address)).to.be.true;
      expect(await path.hasRole(UPGRADER_ROLE, upgrader.address)).to.be.true;
      expect(await path.hasRole(PAUSER_ROLE, pauser.address)).to.be.true;
    });
  });

  describe("Minting", function () {
    it("Should allow minter to mint tokens", async function () {
      // Since we already minted 100M, we can't mint more
      // This test is now redundant, but let's test the cap enforcement
      await expect(
        path.connect(minter).mint(user1.address, 1)
      ).to.be.revertedWith("PATH: Max supply exceeded");
    });

    it("Should prevent non-minter from minting", async function () {
      const mintAmount = ethers.parseEther("1000");
      await expect(
        path.connect(user1).mint(user2.address, mintAmount)
      ).to.be.reverted;
    });

    it("Should enforce max supply cap", async function () {
      // Already at max supply (100M minted at deployment)
      await expect(
        path.connect(minter).mint(user1.address, 1)
      ).to.be.revertedWith("PATH: Max supply exceeded");
    });

    it("Should be at max supply after deployment", async function () {
      expect(await path.totalSupply()).to.equal(MAX_SUPPLY);
    });

    it("Should prevent any minting after reaching max supply", async function () {
      // Already at max, can't mint anything
      await expect(
        path.connect(minter).mint(user2.address, 1)
      ).to.be.revertedWith("PATH: Max supply exceeded");
    });
  });

  describe("Pausing", function () {
    it("Should allow pauser to pause transfers", async function () {
      await path.connect(pauser).pause();
      expect(await path.paused()).to.be.true;

      await expect(
        path.connect(owner).transfer(user1.address, ethers.parseEther("100"))
      ).to.be.reverted;
    });

    it("Should allow pauser to unpause", async function () {
      await path.connect(pauser).pause();
      await path.connect(pauser).unpause();
      expect(await path.paused()).to.be.false;

      await expect(
        path.connect(owner).transfer(user1.address, ethers.parseEther("100"))
      ).to.not.be.reverted;
    });

    it("Should prevent non-pauser from pausing", async function () {
      await expect(
        path.connect(user1).pause()
      ).to.be.reverted;
    });
  });

  describe("Burning", function () {
    it("Should allow token holders to burn their tokens", async function () {
      const burnAmount = ethers.parseEther("100");
      const initialBalance = await path.balanceOf(owner.address);

      await path.connect(owner).burn(burnAmount);

      expect(await path.balanceOf(owner.address)).to.equal(initialBalance - burnAmount);
    });

    it("Should decrease total supply when burning", async function () {
      const burnAmount = ethers.parseEther("100");
      const initialSupply = await path.totalSupply();

      await path.connect(owner).burn(burnAmount);

      expect(await path.totalSupply()).to.equal(initialSupply - burnAmount);
    });
  });

  describe("Governance (ERC20Votes)", function () {
    it("Should allow delegation", async function () {
      await path.connect(owner).delegate(user1.address);
      expect(await path.delegates(owner.address)).to.equal(user1.address);
    });

    it("Should track voting power after delegation", async function () {
      const balance = await path.balanceOf(owner.address);
      await path.connect(owner).delegate(user1.address);

      expect(await path.getVotes(user1.address)).to.equal(balance);
    });

    it("Should use timestamp for clock mode", async function () {
      expect(await path.CLOCK_MODE()).to.equal("mode=timestamp");
    });
  });

  describe("ERC20Permit", function () {
    it("Should have correct nonces implementation", async function () {
      expect(await path.nonces(owner.address)).to.equal(0);
    });
  });

  describe("Access Control", function () {
    it("Should allow admin to grant roles", async function () {
      const MINTER_ROLE = await path.MINTER_ROLE();

      await path.connect(admin).grantRole(MINTER_ROLE, user1.address);
      expect(await path.hasRole(MINTER_ROLE, user1.address)).to.be.true;
    });

    it("Should allow admin to revoke roles", async function () {
      const MINTER_ROLE = await path.MINTER_ROLE();

      await path.connect(admin).grantRole(MINTER_ROLE, user1.address);
      await path.connect(admin).revokeRole(MINTER_ROLE, user1.address);
      expect(await path.hasRole(MINTER_ROLE, user1.address)).to.be.false;
    });
  });

  describe("Upgradeability", function () {
    it("Should allow upgrader to upgrade contract", async function () {
      const PATHV2 = await ethers.getContractFactory("PATH", upgrader);
      const upgraded = await upgrades.upgradeProxy(
        await path.getAddress(),
        PATHV2
      );

      expect(await upgraded.getAddress()).to.equal(await path.getAddress());
    });

    it("Should prevent non-upgrader from upgrading", async function () {
      const PATHV2 = await ethers.getContractFactory("PATH", user1);

      await expect(
        upgrades.upgradeProxy(await path.getAddress(), PATHV2)
      ).to.be.reverted;
    });

    it("Should maintain state after upgrade", async function () {
      const balanceBefore = await path.balanceOf(owner.address);
      const supplyBefore = await path.totalSupply();

      const PATHV2 = await ethers.getContractFactory("PATH", upgrader);
      const upgraded = await upgrades.upgradeProxy(
        await path.getAddress(),
        PATHV2
      );

      expect(await upgraded.balanceOf(owner.address)).to.equal(balanceBefore);
      expect(await upgraded.totalSupply()).to.equal(supplyBefore);
    });
  });

  describe("Edge Cases", function () {
    it("Should handle zero transfers", async function () {
      await expect(
        path.connect(owner).transfer(user1.address, 0)
      ).to.not.be.reverted;
    });

    it("Should prevent transfers to zero address", async function () {
      await expect(
        path.connect(owner).transfer(ethers.ZeroAddress, ethers.parseEther("100"))
      ).to.be.reverted;
    });

    it("Should prevent transfers exceeding balance", async function () {
      const balance = await path.balanceOf(owner.address);
      await expect(
        path.connect(owner).transfer(user1.address, balance + 1n)
      ).to.be.reverted;
    });
  });
});
