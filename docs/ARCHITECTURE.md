# PATH DAO Architecture

## Overview

This document explains the architecture of the PATH DAO token system and how everything works together.

## Smart Contracts

### 1. PATH Token (contracts/PATH.sol)

**Purpose**: Main ERC-20 token for the PATH DAO

**Key Features**:
- 100M max supply cap (enforced in `mint()` function)
- Upgradeable using UUPS proxy pattern
- Pausable for emergency situations
- Built-in governance (ERC20Votes)
- Role-based access control

**Roles**:
- `DEFAULT_ADMIN_ROLE`: Can grant/revoke other roles
- `MINTER_ROLE`: Can mint new tokens (up to max supply)
- `UPGRADER_ROLE`: Can upgrade contract implementation
- `PAUSER_ROLE`: Can pause/unpause token transfers

**How Upgrades Work**:
```
User holds tokens at: 0xProxy123...
↓
Proxy points to → Implementation v1 (0xImpl1...)
↓
You upgrade via UPGRADER_ROLE
↓
Proxy now points to → Implementation v2 (0xImpl2...)
↓
User's tokens still at 0xProxy123... (unchanged!)
```

**Built-in Staking (via Delegation)**:
- Users can delegate voting power to themselves or others
- `delegate(address)` - Stakes tokens for voting
- `getVotes(address)` - Returns voting power
- No separate staking contract needed for basic governance

### 2. PATHVesting Contract (contracts/PATHVesting.sol)

**Purpose**: Handles vesting for team, advisors, early members

**How It Works**:
1. Owner transfers PATH tokens to vesting contract
2. Owner creates vesting schedule for beneficiary:
   - Total amount
   - Start time
   - Cliff period (e.g., 6 months)
   - Vesting duration (e.g., 4 years)
3. Beneficiary claims tokens as they vest

**Example Vesting Schedule** (from your tokenomics):
```
Benjamin Curatto: 11M tokens
- 6 month cliff
- 4 year linear vesting
- After 6 months: 0 tokens claimable
- After 1 year: ~2.75M tokens claimable
- After 2 years: ~5.5M tokens claimable
- After 4.5 years: All 11M tokens claimable
```

**Code Example**:
```javascript
// Deploy vesting contract
const vesting = await PATHVesting.deploy(pathTokenAddress);

// Transfer tokens to vesting contract
await path.transfer(vesting.address, ethers.parseEther("11000000"));

// Create vesting schedule
await vesting.createVestingSchedule(
  beneficiaryAddress,    // Who gets tokens
  ethers.parseEther("11000000"),  // Amount
  Date.now() / 1000,     // Start time
  6,                     // 6 month cliff
  48                     // 48 month (4 year) vesting
);

// Beneficiary claims after cliff
await vesting.connect(beneficiary).claim();
```

## Token Flow Architecture

### Initial Distribution (Mainnet)

```
Deploy PATH Token
↓
Mint 100M tokens to → Treasury (Gnosis Safe)
↓
Treasury Distributes:
├─ 11M → Benjamin vesting contract
├─ 11M → David vesting contract
├─ 26M → Community rewards contract (to be built)
├─ 27M → Treasury operations (stays in safe)
├─ 8M → Early members vesting
├─ 7M → Liquidity pool
└─ 10M → Reserved for future growth
```

### Treasury Allocations (from subscription revenue)

```
Member pays $99/month
↓
30% ($29.70) → PATH DAO Treasury
↓
Treasury Auto-splits:
├─ 50% → Rewards Pool (distribute to contributors)
├─ 10% → Buyback PATH + burn (price support)
├─ 10% → Liquidity Pool (DEX liquidity)
├─ 20% → Investments (RWA/ETH/BTC)
└─ 10% → Operational Buffer
```

## Contracts to Build (Phased Approach)

### Phase 1: Foundation (Now - Deploy to Testnet)
- ✅ PATH Token with max supply cap
- ✅ PATHVesting contract
- Next: Test on Amoy testnet

### Phase 2: Treasury & Distribution (Before Mainnet)
- Treasury contract or Gnosis Safe setup
- Deploy vesting schedules for team
- Set up proper role assignments

### Phase 3: Rewards System (After Launch)
- Rewards distribution contract
- Manual approval flow initially
- Admin can distribute tokens for:
  - Course completions
  - Community contributions
  - Content creation

### Phase 4: Automation (Months 1-3)
- Backend integration for course verification
- Automated reward triggers
- Staking contract with time-locks and multipliers

### Phase 5: Advanced Governance (Months 3-6)
- On-chain voting contracts
- Governance with multipliers
- Proposal system
- Snapshot integration

## How Members Interact

### As a Token Holder

**View Balance**:
```javascript
// In MetaMask or etherscan
balanceOf(yourAddress)
```

**Stake for Voting** (built-in):
```javascript
// Delegate to yourself to activate voting power
delegate(yourOwnAddress)

// Check voting power
getVotes(yourAddress)
```

**Transfer Tokens**:
```javascript
// Standard ERC-20 transfer
transfer(recipientAddress, amount)
```

**Burn Tokens**:
```javascript
// Reduce supply (if you want to)
burn(amount)
```

### As a Vesting Beneficiary

**Check Claimable Amount**:
```javascript
vesting.claimableAmount(yourAddress)
```

**Claim Vested Tokens**:
```javascript
vesting.claim()
```

**View Schedule**:
```javascript
vesting.getVestingSchedule(yourAddress)
// Returns: total, claimed, claimable, start, cliff end, vesting end
```

## Security Considerations

### What CAN Be Changed (via upgrade)
- Add new features to token
- Add reward mechanisms
- Enhance governance logic
- Fix bugs

### What CANNOT Be Changed
- Max supply cap (100M)
- Existing token balances
- Already vested tokens
- Role assignments (unless admin changes them)

### Emergency Features
- **Pause**: PAUSER_ROLE can stop all transfers
- **Unpause**: PAUSER_ROLE can resume transfers
- Use case: Security breach, hack detected

### Multi-Sig Recommendations
For mainnet, these roles should be held by a Gnosis Safe with multiple signers:
- DEFAULT_ADMIN_ROLE: 3-of-5 multisig
- MINTER_ROLE: 2-of-3 multisig (trusted team members)
- UPGRADER_ROLE: 3-of-5 multisig (requires consensus)
- PAUSER_ROLE: 2-of-3 multisig (emergency response)

## Next Steps

1. **Test on Amoy testnet**
   - Deploy token
   - Test all functions
   - Verify Guild.xyz integration

2. **Set up Gnosis Safe**
   - Create multisig wallet
   - Add signers
   - Test transactions

3. **Deploy to Mainnet**
   - Update contract to mint 100M tokens
   - Mint to treasury address
   - Deploy vesting contracts
   - Distribute initial allocations

4. **Integrate with Platform**
   - Connect subscription payments to treasury
   - Build rewards distribution system
   - Set up course completion tracking

## Questions?

Contact: dehepting75@gmail.com
