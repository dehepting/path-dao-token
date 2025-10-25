const { ethers } = require("hardhat");

async function main() {
  console.log("═══════════════════════════════════════════════════");
  console.log("  DEPLOYING FUTURE GROWTH TIMELOCK");
  console.log("═══════════════════════════════════════════════════\n");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  console.log("Account balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "POL\n");

  // ADDRESSES - UPDATE THESE!
  const PATH_TOKEN = "YOUR_PATH_TOKEN_ADDRESS"; // From main deployment
  const TREASURY_SAFE = "YOUR_TREASURY_SAFE_ADDRESS";

  const FUTURE_GROWTH_AMOUNT = ethers.parseEther("10000000"); // 10M PATH

  console.log("📋 Configuration:");
  console.log("PATH Token:", PATH_TOKEN);
  console.log("Treasury Safe (Owner):", TREASURY_SAFE);
  console.log("Lock Amount:", ethers.formatEther(FUTURE_GROWTH_AMOUNT), "PATH");
  console.log("Lock Duration: 2 years (730 days)\n");

  // Deploy timelock
  console.log("🚀 Deploying PATHTimelock...");
  const PATHTimelock = await ethers.getContractFactory("PATHTimelock");
  const timelock = await PATHTimelock.deploy(PATH_TOKEN);
  await timelock.waitForDeployment();
  const timelockAddress = await timelock.getAddress();

  console.log("✅ Timelock deployed:", timelockAddress, "\n");

  // Get unlock time
  const unlockTime = await timelock.unlockTime();
  const unlockDate = new Date(Number(unlockTime) * 1000);

  console.log("⏰ Lock Details:");
  console.log("  Start Time:", new Date().toLocaleString());
  console.log("  Unlock Time:", unlockDate.toLocaleString());
  console.log("  Days Locked:", 730, "days (2 years)\n");

  // Transfer ownership to Treasury Safe
  console.log("🔐 Transferring ownership to Treasury Safe...");
  const transferTx = await timelock.transferOwnership(TREASURY_SAFE);
  await transferTx.wait();
  console.log("✅ Ownership transferred to:", TREASURY_SAFE, "\n");

  console.log("═══════════════════════════════════════════════════");
  console.log("  DEPLOYMENT COMPLETE ✅");
  console.log("═══════════════════════════════════════════════════\n");

  console.log("📋 TIMELOCK CONTRACT:");
  console.log("Address:", timelockAddress);
  console.log("Owner:", TREASURY_SAFE);
  console.log("Unlock Date:", unlockDate.toLocaleDateString());

  console.log("\n═══════════════════════════════════════════════════");
  console.log("  NEXT STEPS - EXECUTE FROM GNOSIS SAFE");
  console.log("═══════════════════════════════════════════════════\n");

  console.log("Go to: https://app.safe.global");
  console.log("Connect to Treasury Safe:", TREASURY_SAFE);

  console.log("\n📤 TRANSFER TOKENS TO TIMELOCK\n");
  console.log("Transaction: Transfer to Future Growth Timelock");
  console.log("  To:", timelockAddress);
  console.log("  Contract:", PATH_TOKEN);
  console.log("  Function: transfer");
  console.log("  Parameters:");
  console.log("    - to:", timelockAddress);
  console.log("    - amount:", FUTURE_GROWTH_AMOUNT.toString(), "(10000000000000000000000000)");

  console.log("\n✅ After transfer, 10M PATH will be locked until:", unlockDate.toLocaleDateString());
  console.log("\n🗳️  To unlock: Community governance vote required on Snapshot\n");

  console.log("═══════════════════════════════════════════════════");
  console.log("  ✅ FUTURE GROWTH TIMELOCK SETUP COMPLETE");
  console.log("═══════════════════════════════════════════════════\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
