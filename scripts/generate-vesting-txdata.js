const { ethers } = require("hardhat");

async function main() {
  // ADDRESSES FROM DEPLOYMENT - UPDATE THESE
  const BENJAMIN_VESTING = "FOUNDER_1_VESTING_CONTRACT_ADDRESS";
  const DAVID_VESTING = "FOUNDER_2_VESTING_CONTRACT_ADDRESS";

  const BENJAMIN_ADDRESS = "FOUNDER_1_ADDRESS";
  const DAVID_ADDRESS = "FOUNDER_2_ADDRESS";

  const AMOUNT = ethers.parseEther("11000000");
  const START_TIME = Math.floor(Date.now() / 1000);
  const CLIFF_MONTHS = 6;
  const VESTING_MONTHS = 48;

  // Get contract interface
  const PATHVesting = await ethers.getContractFactory("PATHVesting");
  const iface = PATHVesting.interface;

  // Encode Benjamin's transaction
  const benjaminData = iface.encodeFunctionData("createVestingSchedule", [
    BENJAMIN_ADDRESS,
    AMOUNT,
    START_TIME,
    CLIFF_MONTHS,
    VESTING_MONTHS
  ]);

  // Encode David's transaction
  const davidData = iface.encodeFunctionData("createVestingSchedule", [
    DAVID_ADDRESS,
    AMOUNT,
    START_TIME,
    CLIFF_MONTHS,
    VESTING_MONTHS
  ]);

  console.log("\n═══════════════════════════════════════════════════");
  console.log("  VESTING SCHEDULE TRANSACTION DATA");
  console.log("═══════════════════════════════════════════════════\n");

  console.log("Start Time:", START_TIME);
  console.log("Date:", new Date(START_TIME * 1000).toLocaleString());
  console.log("\n--- BENJAMIN'S TRANSACTION ---");
  console.log("To:", BENJAMIN_VESTING);
  console.log("Value: 0");
  console.log("Data:", benjaminData);

  console.log("\n--- DAVID'S TRANSACTION ---");
  console.log("To:", DAVID_VESTING);
  console.log("Value: 0");
  console.log("Data:", davidData);

  console.log("\n═══════════════════════════════════════════════════");
  console.log("  HOW TO USE IN GNOSIS SAFE");
  console.log("═══════════════════════════════════════════════════\n");
  console.log("1. Go to Safe → New Transaction → Send tokens");
  console.log("2. Click 'Advanced options' or 'Custom data'");
  console.log("3. Paste the 'To' address");
  console.log("4. Set Value: 0");
  console.log("5. Paste the 'Data' from above");
  console.log("6. Submit → Get approvals → Execute\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
