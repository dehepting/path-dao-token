const { ethers, upgrades } = require("hardhat");

async function main() {
  console.log("Deploying PATH token...");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());

  // MAINNET ADDRESSES - UPDATE THESE BEFORE DEPLOYING
  const TREASURY_SAFE = "YOUR_TREASURY_SAFE_ADDRESS";
  const COMMUNITY_SAFE = "YOUR_COMMUNITY_SAFE_ADDRESS";

  console.log("\n📋 Deployment Configuration:");
  console.log("Treasury Safe:", TREASURY_SAFE);
  console.log("Community Safe:", COMMUNITY_SAFE);
  console.log("Initial mint: 100,000,000 PATH to Treasury Safe");

  // Get the contract factory
  const PATH = await ethers.getContractFactory("PATH");

  // Deploy as upgradeable proxy
  console.log("\n🚀 Deploying upgradeable PATH token...");
  const path = await upgrades.deployProxy(
    PATH,
    [
      TREASURY_SAFE,  // recipient - gets 100M tokens
      TREASURY_SAFE,  // defaultAdmin - has all role management
      TREASURY_SAFE,  // minter - can mint up to cap
      TREASURY_SAFE,  // upgrader - can upgrade contract
      TREASURY_SAFE,  // pauser - can pause transfers
    ],
    {
      initializer: "initialize",
      kind: "uups"
    }
  );

  await path.waitForDeployment();
  const pathAddress = await path.getAddress();

  console.log("\n✅ PATH Token deployed!");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("Proxy Address:", pathAddress);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  console.log("\n📋 Token Details:");
  console.log("  Name:", await path.name());
  console.log("  Symbol:", await path.symbol());
  console.log("  Total Supply:", ethers.formatEther(await path.totalSupply()), "PATH");
  console.log("  Max Supply:", ethers.formatEther(await path.MAX_SUPPLY()), "PATH");
  console.log("  Treasury Balance:", ethers.formatEther(await path.balanceOf(TREASURY_SAFE)), "PATH");

  console.log("\n🔒 Security Features:");
  console.log("  ✓ Max supply capped at 100M tokens");
  console.log("  ✓ Pausable (emergency stop)");
  console.log("  ✓ Role-based access control");
  console.log("  ✓ Upgradeable (UUPS)");
  console.log("  ✓ All roles controlled by Treasury Safe");

  console.log("\n🗳️  Governance:");
  console.log("  ✓ ERC20Votes (built-in voting power)");
  console.log("  ✓ Delegation support");

  console.log("\n🔗 View on PolygonScan:");
  console.log("  https://polygonscan.com/address/" + pathAddress);

  console.log("\n📋 NEXT STEPS:");
  console.log("1. Verify contract on PolygonScan");
  console.log("2. From Treasury Safe, transfer 26M PATH to Community Safe");
  console.log("3. Deploy vesting contracts for founders");
  console.log("4. Deploy vesting contracts for early members");
  console.log("5. Add initial liquidity to QuickSwap");

  console.log("\n🎉 Deployment complete!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
