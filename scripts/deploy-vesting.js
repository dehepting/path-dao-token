const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying PATH Vesting Contracts...");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  // IMPORTANT: Update these addresses before running
  const pathTokenAddress = "YOUR_MAINNET_PATH_TOKEN_ADDRESS"; // From deployment
  const gnosisSafeAddress = "YOUR_GNOSIS_SAFE_ADDRESS"; // Your Safe
  const benjaminAddress = "BENJAMIN_ADDRESS";
  const davidAddress = "DAVID_ADDRESS";

  // Get PATH token contract
  const PATH = await ethers.getContractAt("PATH", pathTokenAddress);

  // Deploy vesting contract factory
  const PATHVesting = await ethers.getContractFactory("PATHVesting");

  console.log("\n=== DEPLOYING VESTING CONTRACTS ===");

  // Deploy Benjamin's vesting contract
  console.log("\n1. Deploying vesting contract for Benjamin...");
  const benjaminVesting = await PATHVesting.deploy(pathTokenAddress);
  await benjaminVesting.waitForDeployment();
  const benjaminVestingAddress = await benjaminVesting.getAddress();
  console.log("✅ Benjamin's vesting contract:", benjaminVestingAddress);

  // Deploy David's vesting contract
  console.log("\n2. Deploying vesting contract for David...");
  const davidVesting = await PATHVesting.deploy(pathTokenAddress);
  await davidVesting.waitForDeployment();
  const davidVestingAddress = await davidVesting.getAddress();
  console.log("✅ David's vesting contract:", davidVestingAddress);

  console.log("\n=== DEPLOYMENT COMPLETE ===");
  console.log("\n📋 NEXT STEPS (from Gnosis Safe):");
  console.log("\n1. Transfer tokens to vesting contracts:");
  console.log(`   PATH.transfer("${benjaminVestingAddress}", "11000000000000000000000000") // 11M`);
  console.log(`   PATH.transfer("${davidVestingAddress}", "11000000000000000000000000") // 11M`);

  console.log("\n2. Create vesting schedules:");

  const now = Math.floor(Date.now() / 1000);

  console.log(`\n   Benjamin's vesting contract (${benjaminVestingAddress}):`);
  console.log(`   createVestingSchedule(`);
  console.log(`     "${benjaminAddress}",          // beneficiary`);
  console.log(`     "11000000000000000000000000",   // 11M tokens`);
  console.log(`     ${now},                         // start now`);
  console.log(`     6,                              // 6 month cliff`);
  console.log(`     48                              // 48 month (4 year) vesting`);
  console.log(`   )`);

  console.log(`\n   David's vesting contract (${davidVestingAddress}):`);
  console.log(`   createVestingSchedule(`);
  console.log(`     "${davidAddress}",              // beneficiary`);
  console.log(`     "11000000000000000000000000",   // 11M tokens`);
  console.log(`     ${now},                         // start now`);
  console.log(`     6,                              // 6 month cliff`);
  console.log(`     48                              // 48 month (4 year) vesting`);
  console.log(`   )`);

  console.log("\n3. After 6 months, beneficiaries can claim:");
  console.log("   Go to vesting contract on PolygonScan");
  console.log("   Call: claim()");
  console.log("   Tokens transfer automatically based on vesting schedule");

  console.log("\n=== VESTING CONTRACT ADDRESSES ===");
  console.log("Benjamin:", benjaminVestingAddress);
  console.log("David:", davidVestingAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
