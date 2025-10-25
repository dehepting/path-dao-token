# Pre-Deployment Checklist

Complete these tasks before deploying to Polygon mainnet.

## ✅ Setup Tasks

### 1. Gnosis Safe
- [ ] Upgrade Safe to 3-of-5 threshold (currently 1-of-2)
- [ ] Add 3 more trusted signers
- [ ] Test a transaction on the Safe
- [ ] Save Safe address: `___________________________`

### 2. Get POL for Deployment
- [ ] Buy/bridge 10 POL (~$5-10)
- [ ] Create clean MetaMask account for deployment
- [ ] Send 10 POL to deployment wallet
- [ ] Save deployment address: `___________________________`

### 3. Update Deployment Script

**File:** `scripts/deploy.js`

- [ ] Line 19: Add Gnosis Safe address
- [ ] Line 41: Change mint to 100M tokens
- [ ] Lines 20-24: Set all roles to Safe address

### 4. Team Alignment
- [ ] Benjamin reviewed distribution plan
- [ ] Confirmed vesting terms (6mo cliff, 4yr)
- [ ] Decided initial token price for liquidity
- [ ] All signers available on deployment day

---

## 📋 Day-Of Deployment

### Deploy PATH Token
```bash
npx hardhat run scripts/deploy.js --network polygon
```

- [ ] Save Proxy Address: `___________________________`
- [ ] Save Implementation: `___________________________`
- [ ] Screenshot deployment output
- [ ] Verify contract auto-verified

### Verify Deployment

On PolygonScan → Read as Proxy:

- [ ] `totalSupply()` = 100,000,000
- [ ] `balanceOf(SAFE)` = 100,000,000
- [ ] `hasRole(MINTER_ROLE, SAFE)` = true
- [ ] All 4 roles in Safe (not personal wallet)

### Test Transaction

From Gnosis Safe:
- [ ] Delegate voting power to Safe
- [ ] Transfer 1,000 PATH to personal wallet
- [ ] Verify received in MetaMask

---

## 📦 Week 1: Vesting

### Deploy Vesting Contracts

**Update:** `scripts/deploy-vesting.js`
- [ ] Add PATH token address
- [ ] Add Safe address
- [ ] Add Benjamin's address
- [ ] Add David's address

**Run:**
```bash
npx hardhat run scripts/deploy-vesting.js --network polygon
```

- [ ] Save Benjamin vesting: `___________________________`
- [ ] Save David vesting: `___________________________`

### Fund Vesting

From Safe:
- [ ] Transfer 11M → Benjamin vesting
- [ ] Transfer 11M → David vesting
- [ ] Verify Safe balance: 78M remaining

### Create Schedules

From Safe:
- [ ] Benjamin: 6mo cliff, 48mo vest
- [ ] David: 6mo cliff, 48mo vest
- [ ] Verify schedules created

---

## 🎁 Week 2: Rewards

### Create Rewards Safe
- [ ] Create new Safe (2-of-3)
- [ ] Name: "PATH Rewards"
- [ ] Signers: David, Ben, Community Rep
- [ ] Save address: `___________________________`

### Fund Rewards Safe
- [ ] Transfer 26M PATH from Treasury → Rewards
- [ ] Verify Treasury balance: 52M

---

## 🏊 Month 1: Liquidity

### Decide Price
- [ ] Initial price: $_______ per PATH
- [ ] USDC needed: $_______ (7M × price)
- [ ] Acquire USDC

### Add Liquidity
- [ ] Go to QuickSwap
- [ ] Add 7M PATH + USDC
- [ ] Save LP token address: `___________________________`
- [ ] Verify Treasury: 45M PATH

---

## 🌐 Community Setup

### Guild.xyz
- [ ] Create guild
- [ ] Add member role (100 PATH)
- [ ] Add contributor role (1,000 PATH)
- [ ] Test with personal wallet

### Snapshot
- [ ] Create space
- [ ] Configure voting strategy
- [ ] Set proposal threshold: 100k PATH
- [ ] Test proposal

### Discord
- [ ] Connect Guild.xyz
- [ ] Gate channels by PATH holdings
- [ ] Test access with test wallet

---

## 📢 Announcement

### Documentation
- [ ] Update README with mainnet address
- [ ] Post tokenomics publicly
- [ ] Publish governance docs
- [ ] Create "How to Buy" guide

### Social
- [ ] Announce deployment
- [ ] Share contract address
- [ ] Explain distribution
- [ ] Open governance

---

## ⚠️ Emergency Contacts

**If something goes wrong:**

- Pause token: PAUSER_ROLE (2-of-3 Safe)
- Contact: David + Benjamin
- Backup: [Add trusted dev contact]

---

## 🎉 Success Criteria

Deployment successful when:

- ✅ 100M PATH minted to Safe
- ✅ All roles in Safe (not personal wallet)
- ✅ Vesting locked (22M)
- ✅ Liquidity added (7M)
- ✅ Community tools working
- ✅ No security issues

---

## 📅 Timeline

**Ready to deploy when:**
- Kraken releases funds
- 3 more Safe signers confirmed
- All checkboxes above complete

**Estimated time:**
- Deployment: 30 minutes
- Vesting setup: 1 hour
- Full distribution: 1 week

---

## Notes

```
Deployment Date: ___________

Issues encountered:
-
-

Lessons learned:
-
-

Next steps:
-
-
```

---

**You got this! 🚀**
