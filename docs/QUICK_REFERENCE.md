# PATH Token - Quick Reference

## 🎯 When Kraken Releases Funds

### Immediate Steps (30 minutes)

1. **Get POL**
   - Bridge to Polygon or buy directly
   - Need: 10 POL (~$5-10)

2. **Update deploy.js**
   ```javascript
   // Line 19
   const GNOSIS_SAFE = "YOUR_SAFE_ADDRESS";

   // Line 41
   _mint(recipient, 100000000 * 10 ** decimals());
   ```

3. **Deploy**
   ```bash
   npx hardhat run scripts/deploy.js --network polygon
   ```

4. **Save address immediately!**

---

## 📂 File Locations

**Deployment:**
- Main script: `scripts/deploy.js`
- Vesting script: `scripts/deploy-vesting.js`

**Documentation:**
- Simple guide: `docs/TOKEN_DISTRIBUTION_SIMPLE.md` ← Start here!
- Full guide: `docs/MAINNET_DEPLOYMENT_GUIDE.md`
- Checklist: `docs/PRE_DEPLOYMENT_CHECKLIST.md`

**Contracts:**
- Token: `contracts/PATH.sol`
- Vesting: `contracts/PATHVesting.sol`

---

## 🔑 Key Commands

**Deploy to mainnet:**
```bash
npx hardhat run scripts/deploy.js --network polygon
```

**Deploy vesting:**
```bash
npx hardhat run scripts/deploy-vesting.js --network polygon
```

**Verify contract:**
```bash
npx hardhat verify --network polygon ADDRESS
```

---

## 💰 Where Tokens Go

```
Day 1: 100M → Treasury Safe

Week 1:
├─ 11M → Benjamin vesting (locked)
├─ 11M → David vesting (locked)
└─ 78M → Treasury Safe

Week 2:
├─ 26M → Rewards Safe
└─ 52M → Treasury Safe

Month 1:
├─ 7M → Liquidity Pool
├─ 8M → Early members (locked)
└─ 37M → Treasury Safe (operations)
```

---

## ⚡ Common Tasks

### From Gnosis Safe

**Transfer tokens:**
- Contract: PATH_TOKEN_ADDRESS
- Function: `transfer`
- To: recipient
- Amount: tokens (with 18 decimals)

**Delegate voting:**
- Function: `delegate`
- Address: GNOSIS_SAFE_ADDRESS

**Create vesting:**
- Contract: VESTING_CONTRACT
- Function: `createVestingSchedule`
- Params: beneficiary, amount, start, 6, 48

---

## 🆘 Troubleshooting

**Transaction fails:**
- Check: Enough POL for gas?
- Check: On Polygon network?
- Check: Safe has enough signatures?

**Can't see tokens:**
- Import in MetaMask
- Address: YOUR_PATH_TOKEN
- Should auto-fill PATH details

**Vesting not working:**
- Check: Contract has tokens?
- Check: Schedule created?
- Check: Cliff period passed?

---

## 📞 Important Links

**Tools:**
- Safe: app.safe.global
- QuickSwap: quickswap.exchange
- PolygonScan: polygonscan.com

**Docs:**
- OpenZeppelin: docs.openzeppelin.com
- Snapshot: docs.snapshot.org
- Guild.xyz: docs.guild.xyz

---

## ✅ Pre-Flight Check

Before deploying:

- [ ] Safe has 3+ signers
- [ ] deploy.js updated
- [ ] 10 POL acquired
- [ ] Benjamin available
- [ ] Read TOKEN_DISTRIBUTION_SIMPLE.md

---

## 🎯 Success =

✅ 100M minted to Safe
✅ All roles in Safe
✅ Contract verified
✅ Test transfer works
✅ Vesting deployed & funded

Then celebrate! 🎉

---

**Everything you need is in `docs/` folder.**

**Start with: `TOKEN_DISTRIBUTION_SIMPLE.md`**
