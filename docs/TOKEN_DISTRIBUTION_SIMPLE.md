# PATH Token Distribution - Simple Guide

## What Gets Created

### Contracts You Deploy
1. **PATH Token** - Main token contract
2. **Benjamin Vesting Contract** - Holds Ben's 11M, releases over time
3. **David Vesting Contract** - Holds your 11M, releases over time
4. **Early Member Vesting Contracts** - One per early member (optional, later)

### Safes You Create
1. **Treasury Safe** - Main DAO wallet (already created, upgrade to 3-of-5)
2. **Rewards Safe** - Separate Safe for distributing rewards (create later)

---

## Week 1: Deploy & Setup Vesting

### Step 1: Deploy PATH Token
```bash
npx hardhat run scripts/deploy.js --network polygon
```
**Result:** 100M PATH → Treasury Safe

### Step 2: Deploy Vesting Contracts
```bash
npx hardhat run scripts/deploy-vesting.js --network polygon
```
**Result:** 2 empty vesting contracts created

### Step 3: Fund Vesting Contracts

**From Treasury Safe UI:**

**Transaction 1:**
- Contract: PATH_TOKEN_ADDRESS
- Function: `transfer`
- To: BENJAMIN_VESTING_ADDRESS
- Amount: `11000000000000000000000000` (11M)

**Transaction 2:**
- Contract: PATH_TOKEN_ADDRESS
- Function: `transfer`
- To: DAVID_VESTING_ADDRESS
- Amount: `11000000000000000000000000` (11M)

**Result:**
- Benjamin's vesting: 11M PATH
- David's vesting: 11M PATH
- Treasury Safe: 78M PATH

### Step 4: Create Vesting Schedules

**From Treasury Safe:**

**For Benjamin:**
- Contract: BENJAMIN_VESTING_ADDRESS
- Function: `createVestingSchedule`
- Parameters:
  - beneficiary: `BENJAMIN_ADDRESS`
  - amount: `11000000000000000000000000`
  - startTime: `[current timestamp]`
  - cliffMonths: `6`
  - vestingMonths: `48`

**For David:**
- Contract: DAVID_VESTING_ADDRESS
- Function: `createVestingSchedule`
- Parameters:
  - beneficiary: `DAVID_ADDRESS`
  - amount: `11000000000000000000000000`
  - startTime: `[current timestamp]`
  - cliffMonths: `6`
  - vestingMonths: `48`

**Result:** Vesting schedules locked, tokens release over 4.5 years

---

## Week 2: Rewards Safe

### Create Rewards Safe
1. Go to app.safe.global
2. Create new Safe
3. Name: "PATH Rewards"
4. Network: Polygon
5. Signers: David + Ben + 1 community member
6. Threshold: 2-of-3 (faster approvals)

### Fund Rewards Safe

**From Treasury Safe:**
- Contract: PATH_TOKEN_ADDRESS
- Function: `transfer`
- To: REWARDS_SAFE_ADDRESS
- Amount: `26000000000000000000000000` (26M)

**Result:**
- Rewards Safe: 26M PATH
- Treasury Safe: 52M PATH

---

## Month 1: Liquidity & Early Members

### Add Liquidity Pool

**Option 1: QuickSwap**
1. Go to quickswap.exchange
2. Connect Treasury Safe
3. Click "Pool" → "Add Liquidity"
4. Token A: PATH
5. Token B: USDC
6. Amount: 7M PATH + X USDC
7. Approve + Confirm

**How much USDC?**
- Initial price $0.10/PATH → Need $700k USDC
- Initial price $0.05/PATH → Need $350k USDC
- Initial price $0.01/PATH → Need $70k USDC

**Result:**
- Liquidity pool: 7M PATH
- Treasury Safe: 45M PATH

### Early Members (Optional)

Same process as Ben/David vesting:
1. Deploy vesting contract per member
2. Transfer tokens from Safe
3. Create vesting schedule (1yr cliff, 3yr vest suggested)

**Result:**
- Early member vesting: 8M PATH total
- Treasury Safe: 37M PATH remaining

---

## Final Distribution

```
Treasury Safe: 37M PATH (operations)
Rewards Safe: 26M PATH (course rewards, contributions)
Benjamin Vesting: 11M PATH (locked, releases over 4.5yr)
David Vesting: 11M PATH (locked, releases over 4.5yr)
Liquidity Pool: 7M PATH (public trading)
Early Members: 8M PATH (locked, various schedules)

Total: 100M PATH ✅
```

---

## Where Tokens Live (Simple)

**Day 1:**
- Treasury Safe: 100M

**Week 1 (After vesting setup):**
- Treasury Safe: 78M
- Benjamin's vesting contract: 11M (locked)
- David's vesting contract: 11M (locked)

**Week 2 (After rewards):**
- Treasury Safe: 52M
- Rewards Safe: 26M
- Vesting contracts: 22M (locked)

**Month 1 (After liquidity):**
- Treasury Safe: 37M (operations, reserved)
- Rewards Safe: 26M (controlled distribution)
- Liquidity Pool: 7M (public market)
- Vesting: 22M (locked, time-release)
- Early members: 8M (locked)

---

## How Claiming Works

**Month 7 (After 6-month cliff):**

Benjamin goes to PolygonScan:
1. Connect wallet
2. Go to his vesting contract
3. Write Contract → `claim()`
4. Confirm transaction
5. Receives ~230k PATH to his wallet

**Vesting contract:**
- Started with: 11M
- Released: 230k
- Still holds: 10.77M

Benjamin can claim monthly/weekly/whenever. Math is automatic.

---

## Key Addresses to Save

```
PATH Token: 0x...
Treasury Safe: 0x...
Rewards Safe: 0x...
Benjamin Vesting: 0x...
David Vesting: 0x...
QuickSwap LP: 0x...
```

Save these in password manager + team shared doc!

---

## Tools You'll Use

- **Deploy contracts:** Terminal (Hardhat)
- **Manage Treasury Safe:** app.safe.global
- **Add liquidity:** quickswap.exchange
- **Verify contracts:** polygonscan.com
- **Governance:** snapshot.org
- **Token gating:** guild.xyz

---

## Timeline Summary

**Week 1:** Deploy PATH + vesting, lock 22M
**Week 2:** Create Rewards Safe, transfer 26M
**Month 1:** Add liquidity (7M), early members (8M)
**Month 2+:** Operate with 37M treasury
**Month 7+:** Vesting starts releasing tokens

---

That's it! Everything else is just normal DAO operations (governance, rewards, etc).
