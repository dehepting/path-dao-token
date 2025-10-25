# Early Member Vesting Setup Guide

**Purpose:** Deploy vesting contracts for 10 early members (800K PATH each)

**Total Allocation:** 8,000,000 PATH (8M)

**Vesting Terms:**
- **Cliff:** 12 months (1 year)
- **Vesting Period:** 36 months (3 years) linear
- **Total Duration:** 48 months (4 years from start to fully vested)

---

## ✅ Prerequisites

Before starting:
- [ ] Treasury Safe has at least 8M PATH available
- [ ] All 10 early member wallet addresses collected
- [ ] Treasury Safe has 3/5 signers available to approve transactions
- [ ] Deployer wallet has at least 0.5 POL for gas

---

## 📋 Early Member Addresses

**IMPORTANT:** Update this section with actual addresses before deployment!

```javascript
const EARLY_MEMBERS = [
  { name: "Member 1", address: "0x..." },
  { name: "Member 2", address: "0x..." },
  { name: "Member 3", address: "0x..." },
  { name: "Member 4", address: "0x..." },
  { name: "Member 5", address: "0x..." },
  { name: "Member 6", address: "0x..." },
  { name: "Member 7", address: "0x..." },
  { name: "Member 8", address: "0x..." },
  { name: "Member 9", address: "0x..." },
  { name: "Member 10", address: "0x..." },
];
```

---

## 🚀 Deployment Steps

### Step 1: Create Deployment Script

Create a new file: `scripts/deploy-early-members-vesting.js`

```javascript
const { ethers } = require("hardhat");

async function main() {
  console.log("═══════════════════════════════════════════════════");
  console.log("  DEPLOYING EARLY MEMBER VESTING CONTRACTS");
  console.log("═══════════════════════════════════════════════════\n");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  console.log("Account balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "POL\n");

  // ADDRESSES - UPDATE THESE!
  const PATH_TOKEN = "YOUR_PATH_TOKEN_ADDRESS"; // PATH token from main deployment
  const TREASURY_SAFE = "YOUR_TREASURY_SAFE_ADDRESS";

  const EARLY_MEMBERS = [
    { name: "Member 1", address: "0x..." }, // UPDATE THESE ADDRESSES!
    { name: "Member 2", address: "0x..." },
    { name: "Member 3", address: "0x..." },
    { name: "Member 4", address: "0x..." },
    { name: "Member 5", address: "0x..." },
    { name: "Member 6", address: "0x..." },
    { name: "Member 7", address: "0x..." },
    { name: "Member 8", address: "0x..." },
    { name: "Member 9", address: "0x..." },
    { name: "Member 10", address: "0x..." },
  ];

  const MEMBER_AMOUNT = ethers.parseEther("800000"); // 800K tokens each
  const CLIFF_MONTHS = 12; // 1 year
  const VESTING_MONTHS = 36; // 3 years

  console.log("📋 Configuration:");
  console.log("PATH Token:", PATH_TOKEN);
  console.log("Treasury Safe:", TREASURY_SAFE);
  console.log("Members to vest:", EARLY_MEMBERS.length);
  console.log("Amount per member:", ethers.formatEther(MEMBER_AMOUNT), "PATH");
  console.log("Cliff:", CLIFF_MONTHS, "months");
  console.log("Vesting:", VESTING_MONTHS, "months\n");

  // Get contract factory
  const PATHVesting = await ethers.getContractFactory("PATHVesting");

  console.log("═══════════════════════════════════════════════════");
  console.log("  DEPLOYING VESTING CONTRACTS");
  console.log("═══════════════════════════════════════════════════\n");

  const deployedContracts = [];

  // Deploy one vesting contract per member
  for (let i = 0; i < EARLY_MEMBERS.length; i++) {
    const member = EARLY_MEMBERS[i];
    console.log(`🚀 Deploying vesting contract for ${member.name}...`);

    const vesting = await PATHVesting.deploy(PATH_TOKEN);
    await vesting.waitForDeployment();
    const vestingAddress = await vesting.getAddress();

    deployedContracts.push({
      name: member.name,
      beneficiary: member.address,
      contract: vestingAddress
    });

    console.log(`✅ ${member.name}'s vesting contract: ${vestingAddress}\n`);
  }

  console.log("═══════════════════════════════════════════════════");
  console.log("  DEPLOYMENT COMPLETE ✅");
  console.log("═══════════════════════════════════════════════════\n");

  console.log("📋 DEPLOYED CONTRACTS:\n");
  deployedContracts.forEach((contract, i) => {
    console.log(`${i + 1}. ${contract.name}`);
    console.log(`   Beneficiary: ${contract.beneficiary}`);
    console.log(`   Contract: ${contract.contract}\n`);
  });

  console.log("═══════════════════════════════════════════════════");
  console.log("  NEXT STEPS - EXECUTE FROM GNOSIS SAFE");
  console.log("═══════════════════════════════════════════════════\n");

  console.log("Go to: https://app.safe.global");
  console.log("Connect to Treasury Safe:", TREASURY_SAFE);
  console.log("\n📤 STEP 1: TRANSFER TOKENS TO VESTING CONTRACTS\n");

  deployedContracts.forEach((contract, i) => {
    console.log(`Transaction ${i + 1}: Transfer to ${contract.name}'s contract`);
    console.log(`  To: ${contract.contract}`);
    console.log(`  Contract: ${PATH_TOKEN}`);
    console.log(`  Function: transfer`);
    console.log(`  Parameters:`);
    console.log(`    - to: ${contract.contract}`);
    console.log(`    - amount: ${MEMBER_AMOUNT.toString()} (800000000000000000000000)\n`);
  });

  console.log("\n📝 STEP 2: CREATE VESTING SCHEDULES\n");

  const now = Math.floor(Date.now() / 1000);
  const cliffEnd = new Date((now + CLIFF_MONTHS * 30 * 24 * 60 * 60) * 1000);
  const vestEnd = new Date((now + (CLIFF_MONTHS + VESTING_MONTHS) * 30 * 24 * 60 * 60) * 1000);

  deployedContracts.forEach((contract, i) => {
    console.log(`Transaction ${10 + i + 1}: Create ${contract.name}'s vesting schedule`);
    console.log(`  To: ${contract.contract}`);
    console.log(`  Function: createVestingSchedule`);
    console.log(`  Parameters:`);
    console.log(`    - beneficiary: ${contract.beneficiary}`);
    console.log(`    - amount: ${MEMBER_AMOUNT.toString()}`);
    console.log(`    - startTime: ${now}`);
    console.log(`    - cliffMonths: ${CLIFF_MONTHS}`);
    console.log(`    - vestingMonths: ${VESTING_MONTHS}\n`);
  });

  console.log("📅 KEY DATES:");
  console.log("Start:", new Date(now * 1000).toLocaleDateString());
  console.log("Cliff ends:", cliffEnd.toLocaleDateString(), "(tokens start vesting)");
  console.log("Fully vested:", vestEnd.toLocaleDateString(), "(100% unlocked)");

  console.log("\n💰 CLAIMING INSTRUCTIONS:");
  console.log("After cliff ends, members can claim anytime by:");
  console.log("1. Go to vesting contract on PolygonScan");
  console.log("2. Connect wallet");
  console.log("3. Call claim() function");
  console.log("4. Tokens transfer automatically\n");

  console.log("═══════════════════════════════════════════════════");
  console.log("  ✅ EARLY MEMBER VESTING SETUP COMPLETE");
  console.log("═══════════════════════════════════════════════════\n");

  // Save addresses to file for verification
  const fs = require("fs");
  const deployment = {
    timestamp: new Date().toISOString(),
    network: "polygon",
    pathToken: PATH_TOKEN,
    treasurySafe: TREASURY_SAFE,
    contracts: deployedContracts,
    vestingTerms: {
      amount: ethers.formatEther(MEMBER_AMOUNT) + " PATH",
      cliffMonths: CLIFF_MONTHS,
      vestingMonths: VESTING_MONTHS,
      startTime: now
    }
  };

  fs.writeFileSync(
    "early-member-vesting-deployment.json",
    JSON.stringify(deployment, null, 2)
  );
  console.log("📁 Deployment details saved to: early-member-vesting-deployment.json\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

---

### Step 2: Update Member Addresses

**BEFORE RUNNING THE SCRIPT:**

1. Open `scripts/deploy-early-members-vesting.js`
2. Replace the placeholder addresses (`0x...`) with actual member wallet addresses
3. Verify each address is correct (checksummed format)
4. Save the file

---

### Step 3: Run Deployment

```bash
npx hardhat run scripts/deploy-early-members-vesting.js --network polygon
```

**Expected Cost:** ~0.5 POL (for deploying 10 contracts)

**Expected Time:** ~5 minutes

**Expected Output:**
- 10 vesting contract addresses
- Instructions for Gnosis Safe transfers
- Saved deployment record in `early-member-vesting-deployment.json`

---

### Step 4: Verify Contracts on PolygonScan

For each vesting contract:

```bash
npx hardhat verify --network polygon <VESTING_CONTRACT_ADDRESS> <PATH_TOKEN_ADDRESS>
```

Example:
```bash
npx hardhat verify --network polygon <VESTING_CONTRACT_ADDRESS> <PATH_TOKEN_ADDRESS>
```

**Tip:** Create a script to verify all 10 at once:

```bash
# Save this as verify-all-early-members.sh
#!/bin/bash
PATH_TOKEN="YOUR_PATH_TOKEN_ADDRESS"

# Update these with your deployed addresses
CONTRACTS=(
  "0x..."
  "0x..."
  "0x..."
  # ... add all 10 addresses
)

for contract in "${CONTRACTS[@]}"; do
  echo "Verifying $contract..."
  npx hardhat verify --network polygon $contract $PATH_TOKEN
  sleep 5  # Wait 5 seconds between verifications
done
```

---

### Step 5: Fund Vesting Contracts (Gnosis Safe)

Go to: https://app.safe.global

Connect to Treasury Safe: `YOUR_TREASURY_SAFE_ADDRESS`

**For EACH of the 10 members:**

1. Click "New Transaction" → "Send tokens"
2. Select PATH token
3. Enter:
   - **To:** [Member's vesting contract address]
   - **Amount:** 800000 PATH
4. Click "Next" → "Submit"
5. Get 3/5 approvals
6. Execute transaction

**Total to transfer:** 8,000,000 PATH

---

### Step 6: Create Vesting Schedules

**Option A: Via PolygonScan (Recommended)**

For each member's vesting contract:

1. Go to: `https://polygonscan.com/address/[VESTING_CONTRACT_ADDRESS]#writeContract`
2. Click "Connect to Web3"
3. Find `createVestingSchedule` function
4. Enter parameters:
   - **beneficiary:** [Member's wallet address]
   - **amount:** `800000000000000000000000` (800K with 18 decimals)
   - **startTime:** [Unix timestamp - use same for all members]
   - **cliffMonths:** `12`
   - **vestingMonths:** `36`
5. Click "Write" → Confirm transaction

**Option B: Via Gnosis Safe Transaction Builder**

1. Go to Safe → Apps → Transaction Builder
2. Load vesting contract ABI
3. Call `createVestingSchedule` for each member

---

### Step 7: Verification

For each member, verify on PolygonScan:

**Check Token Balance:**
```
Contract: [Vesting contract address]
Token: PATH
Expected: 800,000 PATH
```

**Check Vesting Schedule:**
1. Go to vesting contract → "Read Contract"
2. Call `getVestingSchedule` with member's address
3. Verify:
   - `totalAmount`: 800,000,000,000,000,000,000,000 (800K PATH)
   - `amountClaimed`: 0
   - `claimable`: 0 (before cliff)
   - `cliffEnd`: [12 months from start]
   - `vestingEnd`: [48 months from start]

---

## 📊 Summary

After completion, you should have:

✅ 10 vesting contracts deployed
✅ All contracts verified on PolygonScan
✅ 8M PATH distributed (800K each)
✅ 10 vesting schedules active
✅ Deployment record saved to JSON

**Token Distribution:**
```
Total Supply: 100,000,000 PATH

Current Distribution:
├── Treasury Safe: 52,000,000 PATH (52%) - after early member funding
├── Community Safe: 26,000,000 PATH (26%)
├── Founders (Benjamin + David): 22,000,000 PATH (22%)
├── Early Members (10): 8,000,000 PATH (8%) - NEWLY ALLOCATED
└── Remaining: 0 PATH

Vesting Status:
├── Founder vesting: 6mo cliff, 48mo vest
└── Early member vesting: 12mo cliff, 36mo vest
```

---

## 🚨 Important Notes

### Security Checklist

- [ ] All member addresses verified (checksummed)
- [ ] Each member received ONLY their vesting contract address (not others)
- [ ] All vesting schedules use the SAME start time
- [ ] Treasury Safe retains admin control of all vesting contracts
- [ ] Contracts verified on PolygonScan for transparency

### Claiming Process

**Members can claim AFTER the 12-month cliff:**

1. Go to their vesting contract on PolygonScan
2. Connect wallet (same address as beneficiary)
3. Click "Write Contract" → `claim()`
4. Tokens transfer to their wallet automatically
5. Can claim multiple times as tokens vest

**Vesting Schedule:**
- **Months 0-12:** 0% claimable (cliff period)
- **Month 13:** ~2.78% claimable (~22,222 PATH)
- **Month 24:** ~33.33% claimable (~266,667 PATH)
- **Month 36:** ~66.67% claimable (~533,333 PATH)
- **Month 48:** 100% claimable (800,000 PATH)

---

## 📞 Troubleshooting

### Problem: Deployment fails with "Insufficient funds"
**Solution:** Ensure deployer wallet has at least 0.5 POL

### Problem: Contract verification fails
**Solution:** Wait 1-2 minutes after deployment, then retry

### Problem: Gnosis Safe transaction fails
**Solution:**
- Verify Treasury Safe has enough PATH tokens
- Check you have 3/5 signers
- Ensure amounts are correctly formatted

### Problem: Can't create vesting schedule
**Solution:**
- Ensure contract has been funded with 800K PATH first
- Verify you're calling from the owner address
- Check parameters are correct format

---

## 📝 Post-Deployment Checklist

- [ ] All 10 contracts deployed and verified
- [ ] All 10 contracts funded with 800K PATH
- [ ] All 10 vesting schedules created
- [ ] Deployment record saved and backed up
- [ ] Members notified with their vesting contract addresses
- [ ] Update project README with new addresses
- [ ] Update token distribution documentation

---

**✅ Early Member Vesting Complete!**
