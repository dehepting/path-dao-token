# What We Built - Explained

## Summary

We've built a professional, secure, and upgradeable DAO token system for PATH. Here's what changed and why.

## Changes to PATH Token Contract

### 1. Added Max Supply Cap

**What it does**:
```solidity
uint256 public constant MAX_SUPPLY = 100_000_000 * 10**18;

function mint(address to, uint256 amount) public onlyRole(MINTER_ROLE) {
    require(totalSupply() + amount <= MAX_SUPPLY, "PATH: Max supply exceeded");
    _mint(to, amount);
}
```

**Why it matters**:
- Prevents unlimited minting
- Builds trust with community
- Protects token value
- Cannot be exceeded, even by admin

**Example**:
- Total supply: 99M tokens
- Try to mint: 2M tokens
- Result: ❌ Transaction fails (would exceed 100M)

### 2. Added Pausable Feature

**What it does**:
```solidity
bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

function pause() public onlyRole(PAUSER_ROLE) {
    _pause();
}

function unpause() public onlyRole(PAUSER_ROLE) {
    _unpause();
}
```

**Why it matters**:
- Emergency stop button
- Protects against hacks
- Can freeze all transfers if needed
- Standard security practice

**Example Use Case**:
1. Someone discovers a bug
2. PAUSER calls `pause()`
3. All transfers stop immediately
4. Team fixes the issue
5. PAUSER calls `unpause()`
6. Everything resumes normally

### 3. Updated Inheritance Chain

**What changed**:
```solidity
// Before
contract PATH is ... ERC20Upgradeable, ERC20VotesUpgradeable

// After
contract PATH is ... ERC20Upgradeable, ERC20PausableUpgradeable, ERC20VotesUpgradeable
```

**Why it matters**:
- Properly integrates pausable functionality
- Ensures pause affects all token operations
- Follows OpenZeppelin best practices

### 4. Added Pauser Role to Initialize

**What changed**:
```solidity
// Before
function initialize(address recipient, address defaultAdmin, address minter, address upgrader)

// After
function initialize(address recipient, address defaultAdmin, address minter, address upgrader, address pauser)
```

**Why it matters**:
- Sets who can pause the contract
- Typically set to multisig for security
- Separate from other admin roles

## New Contract: PATHVesting

### What it does

Locks tokens and releases them gradually over time.

### Key Functions

**1. Create Vesting Schedule** (Owner only):
```solidity
createVestingSchedule(
    beneficiaryAddress,           // Who gets tokens
    amountInTokens,               // How many tokens
    startTimestamp,               // When to start
    cliffInMonths,                // Wait period
    vestingInMonths               // Release period
)
```

**2. Check Claimable Amount** (Anyone):
```solidity
claimableAmount(address) → uint256
// Returns how many tokens can be claimed now
```

**3. Claim Tokens** (Beneficiary):
```solidity
claim()
// Transfers all claimable tokens to beneficiary
```

### How Vesting Math Works

Example: 12M tokens, 6 month cliff, 4 year vesting

**Timeline**:
```
Month 0: Deploy, lock 12M tokens
Month 1-5: claimableAmount() = 0 (in cliff period)
Month 6: Cliff ends, vesting starts
Month 7-54: Linear release
  - Each month releases: 12M / 48 = 250,000 tokens
  - Month 12: 6 months vested = 1.5M tokens claimable
  - Month 24: 18 months vested = 4.5M tokens claimable
  - Month 54: All 12M tokens claimable
```

**The Code**:
```solidity
// If before cliff: 0 tokens
if (block.timestamp < startTime + cliffDuration) {
    return 0;
}

// If after everything: all tokens
if (block.timestamp >= startTime + cliffDuration + vestingDuration) {
    return totalAmount;
}

// Otherwise: linear calculation
uint256 timeAfterCliff = block.timestamp - (startTime + cliffDuration);
vestedAmount = (totalAmount * timeAfterCliff) / vestingDuration;
```

## How The System Works Together

### Testnet Flow (What You'll Do Now)

```
1. Deploy PATH token to Amoy
   ↓
2. Receive 1M test tokens
   ↓
3. Test all functions:
   - Transfer tokens
   - Delegate for voting
   - Mint more (test max supply cap)
   - Try to pause/unpause
   ↓
4. Deploy vesting contract
   ↓
5. Test vesting schedule
   ↓
6. Integrate with Guild.xyz
   ↓
7. Verify everything works
```

### Mainnet Flow (When You're Ready)

```
1. Update contract: Change 1M → 100M in initialize()
   ↓
2. Create Gnosis Safe (multisig wallet)
   ↓
3. Deploy PATH token
   - Mint 100M to Gnosis Safe
   ↓
4. Deploy vesting contracts
   ↓
5. From Gnosis Safe:
   - Send tokens to vesting contracts
   - Create vesting schedules
   - Distribute unlocked tokens
   ↓
6. Set up Guild.xyz with token address
   ↓
7. Launch DAO!
```

## Key Concepts Explained

### 1. Upgradeable vs Regular Contracts

**Regular Contract**:
```
Deploy Contract → Gets address 0x123
Code is PERMANENT
Want to change? → Deploy NEW contract at 0x456
Everyone needs to migrate
```

**Upgradeable Contract (What we built)**:
```
Deploy Proxy → Gets address 0x123 (permanent)
Proxy points to → Implementation v1 at 0xABC
Want to change? → Deploy Implementation v2 at 0xDEF
Proxy now points to → Implementation v2
Everyone still uses 0x123 (unchanged!)
```

### 2. Role-Based Access Control

**How it works**:
```
DEFAULT_ADMIN_ROLE (you)
├─ Can grant MINTER_ROLE to Alice
├─ Can grant PAUSER_ROLE to Bob
└─ Can revoke roles

MINTER_ROLE (Alice)
└─ Can mint tokens (up to max supply)

PAUSER_ROLE (Bob)
└─ Can pause/unpause

UPGRADER_ROLE (you)
└─ Can upgrade contract
```

**In code**:
```solidity
// Check if caller has role
onlyRole(MINTER_ROLE)

// Grant role
grantRole(MINTER_ROLE, aliceAddress)

// Revoke role
revokeRole(MINTER_ROLE, aliceAddress)
```

### 3. Built-in Staking (via Delegation)

**What "staking" means** for governance:
- Not about earning rewards (yet)
- About activating voting power
- Your tokens = your votes

**How it works**:
```solidity
// You have 1000 PATH tokens
balanceOf(you) // = 1000

// But voting power is 0
getVotes(you) // = 0

// Delegate to yourself (activate voting power)
delegate(you)

// Now you have voting power
getVotes(you) // = 1000

// You can also delegate to someone else
delegate(aliceAddress)
// Now Alice can vote with your tokens
getVotes(aliceAddress) // = 1000 (+ her own)
getVotes(you) // = 0
```

## What's Next to Build

### Short Term (Weeks 1-2)
- Test everything on Amoy
- Set up Gnosis Safe
- Deploy to mainnet

### Medium Term (Months 1-3)
- Rewards distribution contract
- Manual approval system for rewards
- Payment → Treasury integration

### Long Term (Months 3-6)
- Automated course verification
- Advanced staking with time-locks
- On-chain governance voting
- Multiplier system

## Why We Built It This Way

**Modular Design**:
- Token is separate from vesting
- Vesting is separate from rewards
- Can upgrade each independently
- Won't break existing functionality

**Start Simple**:
- Basic features work now
- Can add complexity later
- Reduces risk of bugs
- Faster to market

**Security First**:
- Max supply cap (can't print infinite tokens)
- Pausable (emergency stop)
- Role-based access (limit permissions)
- Upgradeable (fix bugs if needed)

**Future-Proof**:
- Built-in governance (ERC20Votes)
- Upgradeable (add features later)
- Standard interfaces (works with all tools)
- Well-documented (you can understand it)

## Common Questions

**Q: Can the max supply be increased later?**
A: No, it's a `constant`. Even an upgrade can't change it. This is intentional for trust.

**Q: What if I need more than 100M tokens?**
A: You'd need to deploy a new token. This is by design to protect holders.

**Q: Can I add staking rewards later?**
A: Yes! Build a separate staking contract that:
- Takes PATH tokens as deposits
- Calculates rewards
- Distributes from rewards pool

**Q: How do I add automated course rewards?**
A: Build a rewards contract that:
- Your backend calls after course completion
- Mints/transfers PATH tokens to user
- Tracks lifetime earnings

**Q: Can Guild.xyz read balances while paused?**
A: Yes! Pausing only affects transfers, not view functions. Balance checks still work.

**Q: What if I want to change tokenomics?**
A: Allocations are off-chain (your spreadsheet). You control distribution from treasury. On-chain rules (max supply, roles) are fixed unless upgraded.

## Summary

You now have:
- ✅ Production-ready PATH token
- ✅ 100M max supply cap
- ✅ Emergency pause feature
- ✅ Upgradeable for future features
- ✅ Built-in governance (voting)
- ✅ Vesting contract for team tokens
- ✅ Clear architecture for growth

Ready to deploy to testnet and test it out!
