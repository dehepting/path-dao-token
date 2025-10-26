const { ethers } = require("hardhat");

async function main() {
  const TIMELOCK_ADDRESS = "0x0574d25A21833d218f43EE695052f85046f993F7";
  const PATH_TOKEN = "0xeb9F24bA2C9A06e10B759eA63aed397f8399B5CC";

  const path = await ethers.getContractAt("PATH", PATH_TOKEN);
  const timelock = await ethers.getContractAt("PATHTimelock", TIMELOCK_ADDRESS);

  const balance = await path.balanceOf(TIMELOCK_ADDRESS);
  const lockedBalance = await timelock.getLockedBalance();
  const unlockTime = await timelock.unlockTime();
  const isUnlocked = await timelock.isUnlocked();
  const owner = await timelock.owner();

  console.log("\n═══════════════════════════════════════════════════");
  console.log("  FUTURE GROWTH TIMELOCK STATUS");
  console.log("═══════════════════════════════════════════════════\n");

  console.log("Contract:", TIMELOCK_ADDRESS);
  console.log("Owner:", owner);
  console.log("PATH Balance:", ethers.formatEther(balance), "PATH");
  console.log("Locked Balance:", ethers.formatEther(lockedBalance), "PATH");
  console.log("Unlock Date:", new Date(Number(unlockTime) * 1000).toLocaleString());
  console.log("Is Unlocked:", isUnlocked);
  console.log("Days Until Unlock:", Math.floor((Number(unlockTime) - Date.now()/1000) / 86400), "days");

  console.log("\n═══════════════════════════════════════════════════");

  if (balance.toString() === "10000000000000000000000000") {
    console.log("✅ SUCCESS: 10,000,000 PATH locked in timelock!");
    console.log("🔒 Tokens will unlock on:", new Date(Number(unlockTime) * 1000).toLocaleDateString());
    console.log("🗳️  Release requires DAO governance vote");
  } else if (balance.toString() === "0") {
    console.log("⚠️  No tokens transferred yet");
    console.log("📤 Transfer 10M PATH from Treasury Safe to:", TIMELOCK_ADDRESS);
  } else {
    console.log("⚠️  Unexpected balance:", ethers.formatEther(balance), "PATH");
  }
  console.log("═══════════════════════════════════════════════════\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
