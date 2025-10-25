const { ethers } = require("hardhat");

async function main() {
  console.log("═══════════════════════════════════════════════════");
  console.log("  DEPLOYING FOUNDER VESTING CONTRACTS");
  console.log("═══════════════════════════════════════════════════\n");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  console.log("Account balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "POL\n");

  // ADDRESSES - VERIFY THESE BEFORE DEPLOYING TO MAINNET
  const PATH_TOKEN = "YOUR_PATH_TOKEN_ADDRESS"; // From main deployment
  const TREASURY_SAFE = "YOUR_TREASURY_SAFE_ADDRESS";

  const BENJAMIN_ADDRESS = "FOUNDER_1_ADDRESS";
  const DAVID_ADDRESS = "FOUNDER_2_ADDRESS";

  const FOUNDER_AMOUNT = ethers.parseEther("11000000"); // 11M tokens each
  const CLIFF_MONTHS = 6;
  const VESTING_MONTHS = 48;

  console.log("📋 Configuration:");
  console.log("PATH Token:", PATH_TOKEN);
  console.log("Treasury Safe:", TREASURY_SAFE);
  console.log("Benjamin:", BENJAMIN_ADDRESS);
  console.log("David:", DAVID_ADDRESS);
  console.log("Amount per founder:", ethers.formatEther(FOUNDER_AMOUNT), "PATH");
  console.log("Cliff:", CLIFF_MONTHS, "months");
  console.log("Vesting:", VESTING_MONTHS, "months\n");

  // Get PATH token contract
  const PATH = await ethers.getContractAt("PATH", PATH_TOKEN);

  // Deploy vesting contract factory
  const PATHVesting = await ethers.getContractFactory("PATHVesting");

  console.log("═══════════════════════════════════════════════════");
  console.log("  STEP 1: DEPLOY VESTING CONTRACTS");
  console.log("═══════════════════════════════════════════════════\n");

  // Deploy Benjamin's vesting contract
  console.log("🚀 Deploying vesting contract for Benjamin...");
  const benjaminVesting = await PATHVesting.deploy(PATH_TOKEN);
  await benjaminVesting.waitForDeployment();
  const benjaminVestingAddress = await benjaminVesting.getAddress();
  console.log("✅ Benjamin's vesting contract:", benjaminVestingAddress, "\n");

  // Deploy David's vesting contract
  console.log("🚀 Deploying vesting contract for David...");
  const davidVesting = await PATHVesting.deploy(PATH_TOKEN);
  await davidVesting.waitForDeployment();
  const davidVestingAddress = await davidVesting.getAddress();
  console.log("✅ David's vesting contract:", davidVestingAddress, "\n");

  console.log("═══════════════════════════════════════════════════");
  console.log("  DEPLOYMENT COMPLETE ✅");
  console.log("═══════════════════════════════════════════════════\n");

  console.log("📋 VESTING CONTRACT ADDRESSES:");
  console.log("Benjamin:", benjaminVestingAddress);
  console.log("David:", davidVestingAddress);

  console.log("\n═══════════════════════════════════════════════════");
  console.log("  NEXT STEPS - EXECUTE FROM GNOSIS SAFE");
  console.log("═══════════════════════════════════════════════════\n");

  console.log("Go to: https://app.safe.global");
  console.log("Connect to Treasury Safe:", TREASURY_SAFE);
  console.log("\n📤 STEP 2: TRANSFER TOKENS TO VESTING CONTRACTS\n");

  console.log("Transaction 1: Transfer to Benjamin's contract");
  console.log("  To:", benjaminVestingAddress);
  console.log("  Contract:", PATH_TOKEN);
  console.log("  Function: transfer");
  console.log("  Parameters:");
  console.log("    - to:", benjaminVestingAddress);
  console.log("    - amount:", FOUNDER_AMOUNT.toString(), "(11000000000000000000000000)");

  console.log("\nTransaction 2: Transfer to David's contract");
  console.log("  To:", davidVestingAddress);
  console.log("  Contract:", PATH_TOKEN);
  console.log("  Function: transfer");
  console.log("  Parameters:");
  console.log("    - to:", davidVestingAddress);
  console.log("    - amount:", FOUNDER_AMOUNT.toString(), "(11000000000000000000000000)");

  console.log("\n📝 STEP 3: CREATE VESTING SCHEDULES\n");

  const now = Math.floor(Date.now() / 1000);
  const cliffEnd = new Date((now + CLIFF_MONTHS * 30 * 24 * 60 * 60) * 1000);
  const vestEnd = new Date((now + (CLIFF_MONTHS + VESTING_MONTHS) * 30 * 24 * 60 * 60) * 1000);

  console.log("Transaction 3: Create Benjamin's vesting schedule");
  console.log("  To:", benjaminVestingAddress);
  console.log("  Function: createVestingSchedule");
  console.log("  Parameters:");
  console.log("    - beneficiary:", BENJAMIN_ADDRESS);
  console.log("    - amount:", FOUNDER_AMOUNT.toString());
  console.log("    - startTime:", now);
  console.log("    - cliffMonths:", CLIFF_MONTHS);
  console.log("    - vestingMonths:", VESTING_MONTHS);

  console.log("\nTransaction 4: Create David's vesting schedule");
  console.log("  To:", davidVestingAddress);
  console.log("  Function: createVestingSchedule");
  console.log("  Parameters:");
  console.log("    - beneficiary:", DAVID_ADDRESS);
  console.log("    - amount:", FOUNDER_AMOUNT.toString());
  console.log("    - startTime:", now);
  console.log("    - cliffMonths:", CLIFF_MONTHS);
  console.log("    - vestingMonths:", VESTING_MONTHS);

  console.log("\n📅 KEY DATES:");
  console.log("Start:", new Date(now * 1000).toLocaleDateString());
  console.log("Cliff ends:", cliffEnd.toLocaleDateString(), "(tokens start vesting)");
  console.log("Fully vested:", vestEnd.toLocaleDateString(), "(100% unlocked)");

  console.log("\n💰 CLAIMING INSTRUCTIONS:");
  console.log("After cliff ends, founders can claim anytime by:");
  console.log("1. Go to vesting contract on PolygonScan");
  console.log("2. Connect wallet");
  console.log("3. Call claim() function");
  console.log("4. Tokens transfer automatically\n");

  console.log("═══════════════════════════════════════════════════");
  console.log("  ✅ FOUNDER VESTING SETUP COMPLETE");
  console.log("═══════════════════════════════════════════════════\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
