const { ethers } = require("hardhat");

async function main() {
  const BENJAMIN_VESTING = "0x22D1Ee6a4fFF912963967aC5e143E5013C41f8DF";
  const DAVID_VESTING = "0x11B7D1eb8cd16fAcA109caA8e48aAABaC0652e9F";

  const benjaminVesting = await ethers.getContractAt("PATHVesting", BENJAMIN_VESTING);
  const davidVesting = await ethers.getContractAt("PATHVesting", DAVID_VESTING);

  const BENJAMIN_ADDRESS = "0x3546f13f74a4fc0fc45032ed12b2bc9ac692e032";
  const DAVID_ADDRESS = "0x0fbF3CBC43A7aD32528e7790cDb7b18FE404955b";

  const benSchedule = await benjaminVesting.getVestingSchedule(BENJAMIN_ADDRESS);
  const davidSchedule = await davidVesting.getVestingSchedule(DAVID_ADDRESS);

  console.log("\n═══════════════════════════════════════════════════");
  console.log("  FOUNDER VESTING START DATES");
  console.log("═══════════════════════════════════════════════════\n");

  console.log("BENJAMIN'S VESTING:");
  console.log("  Contract:", BENJAMIN_VESTING);
  console.log("  Start Time (Unix):", benSchedule.startTime.toString());
  console.log("  Start Date:", new Date(Number(benSchedule.startTime) * 1000).toLocaleString());
  console.log("  Cliff End:", new Date((Number(benSchedule.startTime) + Number(benSchedule.cliffDuration)) * 1000).toLocaleString());
  console.log("  Vesting End:", new Date((Number(benSchedule.startTime) + Number(benSchedule.cliffDuration) + Number(benSchedule.vestingDuration)) * 1000).toLocaleString());
  console.log("  Total Amount:", ethers.formatEther(benSchedule.totalAmount), "PATH");
  console.log("  Claimed:", ethers.formatEther(benSchedule.amountClaimed), "PATH");

  console.log("\nDAVID'S VESTING:");
  console.log("  Contract:", DAVID_VESTING);
  console.log("  Start Time (Unix):", davidSchedule.startTime.toString());
  console.log("  Start Date:", new Date(Number(davidSchedule.startTime) * 1000).toLocaleString());
  console.log("  Cliff End:", new Date((Number(davidSchedule.startTime) + Number(davidSchedule.cliffDuration)) * 1000).toLocaleString());
  console.log("  Vesting End:", new Date((Number(davidSchedule.startTime) + Number(davidSchedule.cliffDuration) + Number(davidSchedule.vestingDuration)) * 1000).toLocaleString());
  console.log("  Total Amount:", ethers.formatEther(davidSchedule.totalAmount), "PATH");
  console.log("  Claimed:", ethers.formatEther(davidSchedule.amountClaimed), "PATH");

  console.log("\n═══════════════════════════════════════════════════");

  if (benSchedule.startTime.toString() === davidSchedule.startTime.toString()) {
    console.log("✅ Both vesting schedules start at the same time");
  } else {
    console.log("⚠️  Warning: Vesting schedules have different start times");
  }

  console.log("═══════════════════════════════════════════════════\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
