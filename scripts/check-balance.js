const { ethers } = require("hardhat");

async function main() {
  const PATH_TOKEN = "YOUR_PATH_TOKEN_ADDRESS";
  const TREASURY_SAFE = "YOUR_TREASURY_SAFE_ADDRESS";

  const path = await ethers.getContractAt("PATH", PATH_TOKEN);

  console.log("\n═══════════════════════════════════════");
  console.log("  PATH TOKEN BALANCE CHECK");
  console.log("═══════════════════════════════════════\n");

  console.log("Token Address:", PATH_TOKEN);
  console.log("Total Supply:", ethers.formatEther(await path.totalSupply()), "PATH");

  console.log("\n--- Checking Balances ---");
  const treasuryBalance = await path.balanceOf(TREASURY_SAFE);
  console.log("Treasury Safe:", ethers.formatEther(treasuryBalance), "PATH");
  console.log("Treasury Address:", TREASURY_SAFE);

  // Check who received the initial mint
  console.log("\n--- Checking Initial Mint ---");
  const filter = path.filters.Transfer(ethers.ZeroAddress, null);
  const events = await path.queryFilter(filter, 0, 'latest');

  if (events.length > 0) {
    console.log("Initial mint recipient:", events[0].args[1]);
    console.log("Amount minted:", ethers.formatEther(events[0].args[2]), "PATH");

    // Check if recipient is the Treasury Safe
    if (events[0].args[1].toLowerCase() === TREASURY_SAFE.toLowerCase()) {
      console.log("✅ Tokens minted directly to Treasury Safe!");
    } else {
      console.log("⚠️  Tokens NOT minted to Treasury Safe!");
      console.log("They went to:", events[0].args[1]);

      // Check that address's balance
      const actualBalance = await path.balanceOf(events[0].args[1]);
      console.log("That address has:", ethers.formatEther(actualBalance), "PATH");
    }
  }

  console.log("\n═══════════════════════════════════════\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
