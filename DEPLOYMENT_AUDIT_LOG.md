# PATH DAO - Mainnet Deployment Audit Log

**Network:** Polygon Mainnet (Chain ID: 137)
**Deployment Date:** October 25, 2025
**Deployer:** David Hepting (0x0fbF3CBC43A7aD32528e7790cDb7b18FE404955b)

---

## 📋 Deployed Contract Addresses

### Core Contracts

| Contract | Address | Status | PolygonScan |
|----------|---------|--------|-------------|
| **PATH Token (Proxy)** | `0xeb9F24bA2C9A06e10B759eA63aed397f8399B5CC` | ✅ Verified | [View](https://polygonscan.com/address/0xeb9F24bA2C9A06e10B759eA63aed397f8399B5CC) |
| **Benjamin Vesting** | `0x22D1Ee6a4fFF912963967aC5e143E5013C41f8DF` | ✅ Verified | [View](https://polygonscan.com/address/0x22D1Ee6a4fFF912963967aC5e143E5013C41f8DF) |
| **David Vesting** | `0x11B7D1eb8cd16fAcA109caA8e48aAABaC0652e9F` | ✅ Verified | [View](https://polygonscan.com/address/0x11B7D1eb8cd16fAcA109caA8e48aAABaC0652e9F) |
| **Future Growth Timelock** | `0x0574d25A21833d218f43EE695052f85046f993F7` | ✅ Verified | [View](https://polygonscan.com/address/0x0574d25A21833d218f43EE695052f85046f993F7) |

### Gnosis Safe Multisigs

| Safe | Address | Signers | PolygonScan |
|------|---------|---------|-------------|
| **Treasury Safe** | `0x325e71d4Ca1dB3b5DAdfe819320aBc6975827D36` | 3/5 | [View](https://polygonscan.com/address/0x325e71d4Ca1dB3b5DAdfe819320aBc6975827D36) |
| **Community Safe** | `0xBBa313fD8522D116a32FaCd0E7FE0F536c76961e` | 3/5 | [View](https://polygonscan.com/address/0xBBa313fD8522D116a32FaCd0E7FE0F536c76961e) |

### Beneficiary Addresses

| Person | Address | Notes |
|--------|---------|-------|
| **Benjamin Curatto** | `0x3546f13f74a4fc0fc45032ed12b2bc9ac692e032` | Co-founder |
| **David Hepting** | `0x0fbF3CBC43A7aD32528e7790cDb7b18FE404955b` | Co-founder |

---

## 📊 Token Distribution Status

### Total Supply: 100,000,000 PATH

| Allocation | Amount | Address/Contract | Status |
|------------|--------|------------------|--------|
| **Treasury Safe** | 42,000,000 PATH | `0x325e71d4Ca1dB3b5DAdfe819320aBc6975827D36` | ✅ Liquid |
| **Community Safe** | 26,000,000 PATH | `0xBBa313fD8522D116a32FaCd0E7FE0F536c76961e` | ✅ Liquid |
| **Benjamin Vesting** | 11,000,000 PATH | `0x22D1Ee6a4fFF912963967aC5e143E5013C41f8DF` | 🔒 Locked |
| **David Vesting** | 11,000,000 PATH | `0x11B7D1eb8cd16fAcA109caA8e48aAABaC0652e9F` | 🔒 Locked |
| **Future Growth Timelock** | 10,000,000 PATH | `0x0574d25A21833d218f43EE695052f85046f993F7` | 🔒 Locked |
| **QuickSwap Liquidity** | 1,000 PATH | Treasury Safe | ⏳ Pending |
| **Available (Treasury)** | 42,000,000 PATH | - | For early members, liquidity, reserves |

**Total Accounted:** 100,000,000 PATH ✅

---

## 🔐 Transaction Audit Log

### 1. PATH Token Deployment

| Field | Value |
|-------|-------|
| **Date** | October 25, 2025 |
| **TX Hash** | [Add from your deployment] |
| **Contract** | 0xeb9F24bA2C9A06e10B759eA63aed397f8399B5CC |
| **Initial Mint** | 100,000,000 PATH |
| **Recipient** | Treasury Safe (0x325e71d4Ca1dB3b5DAdfe819320aBc6975827D36) |
| **Gas Used** | ~2.96M gas |
| **Roles Granted** | All 4 roles → Treasury Safe |
| **Status** | ✅ Complete |

### 2. Benjamin Vesting Contract Deployment

| Field | Value |
|-------|-------|
| **Date** | October 25, 2025 |
| **TX Hash** | [Add from your deployment] |
| **Contract** | 0x22D1Ee6a4fFF912963967aC5e143E5013C41f8DF |
| **Gas Used** | ~1.2M gas |
| **Status** | ✅ Complete |

### 3. David Vesting Contract Deployment

| Field | Value |
|-------|-------|
| **Date** | October 25, 2025 |
| **TX Hash** | [Add from your deployment] |
| **Contract** | 0x11B7D1eb8cd16fAcA109caA8e48aAABaC0652e9F |
| **Gas Used** | ~1.2M gas |
| **Status** | ✅ Complete |

### 4. Transfer to Community Safe

| Field | Value |
|-------|-------|
| **Date** | October 25, 2025 |
| **TX Hash** | [Add from Gnosis Safe] |
| **From** | Treasury Safe (0x325e71d4Ca1dB3b5DAdfe819320aBc6975827D36) |
| **To** | Community Safe (0xBBa313fD8522D116a32FaCd0E7FE0F536c76961e) |
| **Amount** | 26,000,000 PATH |
| **Status** | ✅ Complete |

### 5. Fund Benjamin's Vesting Contract

| Field | Value |
|-------|-------|
| **Date** | October 25, 2025 |
| **TX Hash** | [Add from Gnosis Safe] |
| **From** | Treasury Safe |
| **To** | Benjamin Vesting (0x22D1Ee6a4fFF912963967aC5e143E5013C41f8DF) |
| **Amount** | 11,000,000 PATH |
| **Status** | ✅ Complete |

### 6. Fund David's Vesting Contract

| Field | Value |
|-------|-------|
| **Date** | October 25, 2025 |
| **TX Hash** | [Add from Gnosis Safe] |
| **From** | Treasury Safe |
| **To** | David Vesting (0x11B7D1eb8cd16fAcA109caA8e48aAABaC0652e9F) |
| **Amount** | 11,000,000 PATH |
| **Status** | ✅ Complete |

### 7. Create Benjamin's Vesting Schedule

| Field | Value |
|-------|-------|
| **Date** | October 25, 2025 |
| **TX Hash** | `0xd02dd019676c78f3e0c693c3d2d4124e754fc986e988fc77471d515b85695c6b` |
| **Contract** | 0x22D1Ee6a4fFF912963967aC5e143E5013C41f8DF |
| **Beneficiary** | Benjamin (0x3546f13f74a4fc0fc45032ed12b2bc9ac692e032) |
| **Amount** | 11,000,000 PATH |
| **Start Time** | 1761424889 (Oct 25, 2025 3:41:29 PM) |
| **Cliff** | 6 months |
| **Vesting** | 48 months |
| **Status** | ✅ Complete |

### 8. Create David's Vesting Schedule

| Field | Value |
|-------|-------|
| **Date** | October 25, 2025 |
| **TX Hash** | `0x087636b3e80a173f90dcd126666e771af4d0b690bbc00d22fdf04b8283255902` |
| **Contract** | 0x11B7D1eb8cd16fAcA109caA8e48aAABaC0652e9F |
| **Beneficiary** | David (0x0fbF3CBC43A7aD32528e7790cDb7b18FE404955b) |
| **Amount** | 11,000,000 PATH |
| **Start Time** | 1761424889 (Oct 25, 2025 3:41:29 PM) |
| **Cliff** | 6 months |
| **Vesting** | 48 months |
| **Status** | ✅ Complete |

### 9. Future Growth Timelock Deployment

| Field | Value |
|-------|-------|
| **Date** | October 25, 2025 |
| **TX Hash** | [Add from your deployment] |
| **Contract** | 0x0574d25A21833d218f43EE695052f85046f993F7 |
| **Lock Duration** | 730 days (2 years) |
| **Unlock Date** | October 25, 2027 |
| **Gas Used** | ~485k gas |
| **Status** | ✅ Complete |

### 10. Fund Future Growth Timelock

| Field | Value |
|-------|-------|
| **Date** | October 25, 2025 |
| **TX Hash** | [Add from Gnosis Safe] |
| **From** | Treasury Safe |
| **To** | Future Growth Timelock (0x0574d25A21833d218f43EE695052f85046f993F7) |
| **Amount** | 10,000,000 PATH |
| **Status** | ✅ Complete |

---

## 🗓️ Vesting Timeline

### Founder Vesting (Benjamin & David)

| Date | Event | Details |
|------|-------|---------|
| **Oct 25, 2025** | Vesting Start | Both schedules begin |
| **Apr 25, 2026** | Cliff Ends | Tokens start vesting (6 months) |
| **Oct 25, 2026** | 25% Vested | ~2.75M PATH claimable each |
| **Oct 25, 2027** | 50% Vested | ~5.5M PATH claimable each |
| **Oct 25, 2028** | 75% Vested | ~8.25M PATH claimable each |
| **Oct 25, 2029** | Fully Vested | 11M PATH claimable each |

### Future Growth Timelock

| Date | Event | Details |
|------|-------|---------|
| **Oct 25, 2025** | Lock Start | 10M PATH locked |
| **Oct 25, 2027** | Lock Ends | Tokens can be withdrawn |
| **TBD** | DAO Vote | Community votes on release |
| **TBD** | Unlock | Tokens released per DAO decision |

---

## ✅ Verification Checklist

### Smart Contracts
- [x] PATH Token deployed and verified
- [x] Benjamin Vesting deployed and verified
- [x] David Vesting deployed and verified
- [x] Future Growth Timelock deployed and verified
- [x] All contracts verified on PolygonScan

### Token Distribution
- [x] 100M PATH minted to Treasury Safe
- [x] 26M PATH transferred to Community Safe
- [x] 11M PATH transferred to Benjamin Vesting
- [x] 11M PATH transferred to David Vesting
- [x] 10M PATH transferred to Future Growth Timelock
- [x] 42M PATH remaining in Treasury Safe
- [x] Total = 100M PATH ✅

### Vesting Schedules
- [x] Benjamin's schedule created (11M PATH, 6mo cliff, 48mo vest)
- [x] David's schedule created (11M PATH, 6mo cliff, 48mo vest)
- [x] Both schedules start at same time (1761424889)
- [x] Future Growth locked for 2 years

### Security
- [x] All roles granted to Treasury Safe
- [x] Deployer wallet has no admin roles
- [x] Treasury Safe is 3/5 multisig
- [x] Community Safe is 3/5 multisig
- [x] Vesting contracts immutable (no emergency withdraw)
- [x] Timelock enforces 2-year lock

---

## 📞 Important Links

### Block Explorers
- **PATH Token:** https://polygonscan.com/token/0xeb9F24bA2C9A06e10B759eA63aed397f8399B5CC
- **Benjamin Vesting:** https://polygonscan.com/address/0x22D1Ee6a4fFF912963967aC5e143E5013C41f8DF
- **David Vesting:** https://polygonscan.com/address/0x11B7D1eb8cd16fAcA109caA8e48aAABaC0652e9F
- **Future Growth Timelock:** https://polygonscan.com/address/0x0574d25A21833d218f43EE695052f85046f993F7
- **Treasury Safe:** https://app.safe.global/home?safe=matic:0x325e71d4Ca1dB3b5DAdfe819320aBc6975827D36
- **Community Safe:** https://app.safe.global/home?safe=matic:0xBBa313fD8522D116a32FaCd0E7FE0F536c76961e

### QuickSwap (When liquidity added)
- **Trade PATH:** https://quickswap.exchange/#/swap?inputCurrency=0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359&outputCurrency=0xeb9F24bA2C9A06e10B759eA63aed397f8399B5CC
- **Add Liquidity:** https://quickswap.exchange/#/add/v2
- **Analytics:** https://info.quickswap.exchange/

---

## 💰 Gas Costs Summary

| Operation | Gas Used | POL Cost (est) |
|-----------|----------|----------------|
| PATH Token Deployment | ~2.96M gas | ~0.09 POL |
| Benjamin Vesting Deployment | ~1.2M gas | ~0.04 POL |
| David Vesting Deployment | ~1.2M gas | ~0.04 POL |
| Future Growth Timelock | ~485k gas | ~0.02 POL |
| Contract Verifications | FREE | 0 POL |
| Gnosis Safe TXs (approx) | Varies | ~0.01 POL each |
| **TOTAL (approx)** | **~6M gas** | **~0.25 POL** |

---

## 📝 Notes

### Deployment Decisions Made:
- ✅ Removed `emergencyWithdraw()` from vesting contracts for security
- ✅ Changed early members from 20 @ 400K to 10 @ 800K each
- ✅ Used bootstrap liquidity approach ($100 + 1K PATH instead of 7M)
- ✅ Added Future Growth 2-year timelock for community governance
- ✅ All roles controlled by 3/5 multisig (Treasury Safe)

### Remaining Tasks:
- ⏳ Add initial QuickSwap liquidity ($100 USDC + 1,000 PATH)
- ⏳ Deploy early member vesting (10 members @ 800K each = 8M PATH)
- ⏳ Set up Snapshot for governance
- ⏳ Configure Guild.xyz token gating
- ⏳ Submit to CoinGecko/CoinMarketCap

---

**Deployment Status:** ✅ Core contracts deployed and operational

**Last Updated:** October 25, 2025

**Audited By:** David Hepting & Claude Code
