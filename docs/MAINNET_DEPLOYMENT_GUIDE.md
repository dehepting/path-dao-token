# PATH Token - Mainnet Deployment Guide

## Pre-Deployment Setup

### 1. Gnosis Safe Configuration

**Status:** ✅ DONE (1-of-2 Safe created)

**Current Setup:**
- Signers: David + Benjamin (2 total)
- Threshold: 1-of-2

**Before Mainnet:**
- [ ] Add 3 more trusted signers
- [ ] Change threshold to 3-of-5
- [ ] Document all signer addresses
- [ ] Test a transaction on the Safe

**Recommended Signers:**
1. David (you) - Hardware wallet recommended
2. Benjamin - Hardware wallet recommended
3. Trusted advisor #1
4. Community member #1
5. Technical lead #1

### 2. Update Deployment Script

**File:** `scripts/deploy.js`

**Changes needed:**

```javascript
// Line 41 - Change mint amount
// FROM:
_mint(recipient, 1000000 * 10 ** decimals());

// TO:
_mint(recipient, 100000000 * 10 ** decimals()); // 100M tokens

// Lines 19-24 - Update role recipients
const GNOSIS_SAFE_ADDRESS = "YOUR_SAFE_ADDRESS_HERE"; // ← ADD THIS

const path = await upgrades.deployProxy(
  PATH,
  [
    GNOSIS_SAFE_ADDRESS,  // recipient - gets 100M tokens
    GNOSIS_SAFE_ADDRESS,  // defaultAdmin
    GNOSIS_SAFE_ADDRESS,  // minter
    GNOSIS_SAFE_ADDRESS,  // upgrader
    GNOSIS_SAFE_ADDRESS,  // pauser
  ],
  {
    initializer: "initialize",
    kind: "uups"
  }
);
```

### 3. Prepare Deployment Wallet

**Option A: Clean MetaMask Account (Recommended)**
```
1. Create new MetaMask account: "PATH Deployment"
2. Fund with 10 POL (~$5-10)
3. Save private key securely
4. This wallet is ONLY for deployment
5. After deployment, it has no power (roles in Safe)
```

**Option B: Hardware Wallet**
```
1. Connect Ledger/Trezor
2. Configure Hardhat to use hardware wallet
3. Deploy from hardware wallet
4. More secure but more complex
```

**My Recommendation:** Use Option A. The deployment wallet has no ongoing control.

### 4. Get Mainnet POL

**You need ~10 POL ($5-10 USD)**

**How to get it:**
- Buy MATIC on exchange (Coinbase, Binance)
- Bridge from Ethereum using Polygon Bridge
- Buy directly on Polygon via Transak/MoonPay

**Fund your deployment wallet:**
- Send 10 POL to deployment address
- Verify it arrived: Check on PolygonScan

---

## Deployment Day

### Step 1: Final Checks

- [ ] Gnosis Safe has 3+ signers
- [ ] Deployment wallet funded with 10 POL
- [ ] `deploy.js` updated with Safe address
- [ ] `deploy.js` updated to mint 100M tokens
- [ ] `.env` has correct PRIVATE_KEY
- [ ] `.env` has POLYGONSCAN_API_KEY
- [ ] Team is ready/available for verification

### Step 2: Deploy PATH Token

```bash
# From your project directory
npx hardhat run scripts/deploy.js --network polygon
```

**Expected output:**
```
Deploying PATH token...
Deploying with account: 0xYourDeploymentAddress
Account balance: 10000000000000000000 (10 POL)

Deploying upgradeable PATH token...

✅ PATH Token deployed!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Proxy Address: 0xYOUR_TOKEN_ADDRESS_HERE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 Token Details:
  Name: PATH
  Symbol: PATH
  Total Supply: 100000000.0 PATH
  Max Supply: 100000000.0 PATH
  Your Balance: 0.0 PATH (all in Safe)

🔗 View on PolygonScan:
  https://polygonscan.com/address/0xYOUR_TOKEN_ADDRESS_HERE

🎉 Deployment complete!
```

**CRITICAL:**
- ✅ Save the Proxy Address immediately
- ✅ Screenshot the entire output
- ✅ Verify on PolygonScan
- ✅ Don't lose this address!

### Step 3: Verify Contract

**Should happen automatically, but if not:**

```bash
npx hardhat verify --network polygon YOUR_PROXY_ADDRESS
```

**Check on PolygonScan:**
- Go to: https://polygonscan.com/address/YOUR_PROXY_ADDRESS
- Click "Contract" tab
- Should see green checkmark: "Contract Source Code Verified"
- Should see "Read as Proxy" and "Write as Proxy"

### Step 4: Verify Deployment

**From PolygonScan → Read as Proxy:**

Check these values:
- [ ] `name()` = "PATH"
- [ ] `symbol()` = "PATH"
- [ ] `totalSupply()` = 100,000,000 (with 18 decimals)
- [ ] `MAX_SUPPLY()` = 100,000,000
- [ ] `balanceOf(GNOSIS_SAFE_ADDRESS)` = 100,000,000
- [ ] `hasRole(MINTER_ROLE, GNOSIS_SAFE_ADDRESS)` = true

**All roles should be in Gnosis Safe:**
- [ ] DEFAULT_ADMIN_ROLE → Safe
- [ ] MINTER_ROLE → Safe
- [ ] UPGRADER_ROLE → Safe
- [ ] PAUSER_ROLE → Safe

### Step 5: Test Basic Functions

**From Gnosis Safe:**

**Test 1: Delegate Voting Power**
```
1. Go to Safe → New Transaction
2. Contract: YOUR_PATH_TOKEN_ADDRESS
3. Function: delegate(address)
4. Parameter: GNOSIS_SAFE_ADDRESS (delegate to self)
5. Submit → Get 3-of-5 approvals → Execute
6. Verify: getVotes(GNOSIS_SAFE_ADDRESS) = 100M
```

**Test 2: Small Transfer**
```
1. Safe → New Transaction
2. Function: transfer(address, amount)
3. To: David's personal address
4. Amount: 1000000000000000000000 (1,000 PATH)
5. Submit → Approve → Execute
6. Verify: David receives 1,000 PATH in MetaMask
```

---

## Week 1: Vesting Setup

### Step 1: Deploy Vesting Contracts

**Update `scripts/deploy-vesting.js` with:**
- PATH token address (from deployment)
- Gnosis Safe address
- Benjamin's address
- David's address

**Run deployment:**
```bash
npx hardhat run scripts/deploy-vesting.js --network polygon
```

**Save addresses:**
- [ ] Benjamin vesting contract: 0x...
- [ ] David vesting contract: 0x...

### Step 2: Fund Vesting Contracts

**From Gnosis Safe:**

**Transaction 1: Fund Benjamin's Vesting**
```
Contract: PATH_TOKEN_ADDRESS
Function: transfer(address, amount)
To: BENJAMIN_VESTING_ADDRESS
Amount: 11000000000000000000000000 (11M PATH)
```

**Transaction 2: Fund David's Vesting**
```
Contract: PATH_TOKEN_ADDRESS
Function: transfer(address, amount)
To: DAVID_VESTING_ADDRESS
Amount: 11000000000000000000000000 (11M PATH)
```

**Verify:**
- [ ] Benjamin vesting balance: 11M PATH
- [ ] David vesting balance: 11M PATH
- [ ] Safe balance: 78M PATH remaining

### Step 3: Create Vesting Schedules

**From Gnosis Safe:**

**Benjamin's Schedule:**
```
Contract: BENJAMIN_VESTING_ADDRESS
Function: createVestingSchedule(
  beneficiary: BENJAMIN_ADDRESS,
  amount: 11000000000000000000000000,
  startTime: [current timestamp],
  cliffMonths: 6,
  vestingMonths: 48
)
```

**David's Schedule:**
```
Contract: DAVID_VESTING_ADDRESS
Function: createVestingSchedule(
  beneficiary: DAVID_ADDRESS,
  amount: 11000000000000000000000000,
  startTime: [current timestamp],
  cliffMonths: 6,
  vestingMonths: 48
)
```

**Verify:**
- [ ] Benjamin can see schedule: `getVestingSchedule(BENJAMIN_ADDRESS)`
- [ ] David can see schedule: `getVestingSchedule(DAVID_ADDRESS)`
- [ ] Claimable amount: 0 (still in cliff)

---

## Week 2: Community Setup

### Snapshot Governance

**Create Snapshot Space:**
1. Go to: https://snapshot.org
2. Create space: "pathdao.eth" (or similar)
3. Settings:
   - Token: YOUR_PATH_TOKEN_ADDRESS
   - Network: Polygon
   - Voting strategy: erc20-balance-of
   - Proposal threshold: 100,000 PATH
   - Voting period: 3 days
   - Quorum: 10%

### Guild.xyz Integration

**Create Guild:**
1. Go to: https://guild.xyz
2. Create Guild: "PATH DAO"
3. Add roles:

**Role: Member**
- Requirement: Hold 100 PATH
- Reward: Discord "Member" role

**Role: Contributor**
- Requirement: Hold 1,000 PATH
- Reward: Discord "Contributor" role

**Role: Core**
- Requirement: Hold 10,000 PATH
- Reward: Discord "Core" role

### Discord Setup

**Create channels gated by PATH:**
- #general: Public
- #members: 100+ PATH required
- #contributors: 1,000+ PATH required
- #core: 10,000+ PATH required
- #governance: 100+ PATH, voting discussions

---

## Month 1: Distribution

### Liquidity Pool Setup

**QuickSwap (Polygon DEX):**
```
From Gnosis Safe:
1. Approve QuickSwap router for 3.5M PATH
2. Add liquidity: 3.5M PATH + X USDC
3. Receive LP tokens → Hold in Safe
```

**Calculate USDC needed:**
- Decide initial price (e.g., $0.10 per PATH)
- 3.5M PATH × $0.10 = $350,000 USDC needed
- Or lower price: $0.01 = $35,000 USDC

### Early Member Vesting

**For 8M early member allocation:**
```
1. Deploy separate vesting contracts per member
2. Fund each contract from Safe
3. Create schedules: 1yr cliff, 3yr vest
4. Document all addresses
```

---

## Ongoing Operations

### Monthly Tasks

**Treasury Management:**
- Review spending requests
- Approve rewards distribution
- Monitor token metrics
- Governance proposals

**Community Engagement:**
- Weekly governance calls
- Monthly transparency reports
- Snapshot proposals
- Discord engagement

### Security Monitoring

**Watch for:**
- Unusual transfer patterns
- Large sells on DEX
- Security researcher reports
- Smart contract bugs

**Emergency Contacts:**
- PAUSER_ROLE in 2-of-3 Safe
- Can pause if emergency
- Announce immediately
- Plan unpause vote

---

## Summary Timeline

**Week 1: Deploy & Verify**
- Day 1: Deploy PATH token
- Day 2: Verify all roles in Safe
- Day 3: Test basic functions
- Day 4-7: Deploy vesting contracts

**Week 2: Community Setup**
- Setup Snapshot
- Create Guild.xyz
- Configure Discord
- Announce launch

**Week 3-4: Initial Distribution**
- Fund vesting contracts
- Add liquidity to DEX
- Early member allocation
- Public announcement

**Month 2+: Operations**
- Governance proposals
- Rewards distribution
- Community growth
- Feature development

---

## Key Addresses to Save

**Mainnet Deployment:**
```
PATH Token (Proxy): 0x...
PATH Implementation: 0x...
Gnosis Safe (Treasury): 0x...
Benjamin Vesting: 0x...
David Vesting: 0x...
Rewards Safe: 0x...
QuickSwap LP: 0x...
```

**Roles:**
```
DEFAULT_ADMIN_ROLE: 0x0000...0000
MINTER_ROLE: 0x9f2df0fe...
UPGRADER_ROLE: 0x189ab7a9...
PAUSER_ROLE: 0x65d7a28e...
```

---

## Questions Before Deployment?

**Review with team:**
- [ ] All understand vesting schedules
- [ ] Agree on initial token price
- [ ] Confirm distribution percentages
- [ ] Review emergency procedures
- [ ] Understand upgrade process

**Ready to deploy? Let's go! 🚀**
