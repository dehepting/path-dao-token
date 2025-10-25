# PATH DAO Token

Professional, secure, upgradeable ERC-20 governance token for the PATH DAO.

## 🎯 Quick Links

**Mainnet Deployment:**
- Network: Polygon Mainnet
- Contract: See `DEPLOYMENT_RECORD.md` after deployment
- Explorer: https://polygonscan.com

**Status:** ✅ Production-ready

---

## 📋 Features

- ✅ **ERC-20 Standard** - Full compliance, works everywhere
- ✅ **100M Hard Cap** - Max supply enforced in code
- ✅ **Upgradeable (UUPS)** - Add features without migration
- ✅ **Pausable** - Emergency stop mechanism
- ✅ **Governance Ready** - Built-in voting (ERC20Votes)
- ✅ **Role-Based Security** - Multi-sig compatible
- ✅ **Vesting Support** - Team token time-locks
- ✅ **Guild.xyz Compatible** - Token gating ready

---

## 🚀 Quick Start

### Prerequisites
```bash
node >= 18.0.0
npm >= 9.0.0
```

### Installation
```bash
npm install
```

### Environment Setup
```bash
cp .env.example .env
# Add your private key and API key to .env
```

### Deploy to Polygon Mainnet
```bash
# Update scripts/deploy.js first (see docs/MAINNET_DEPLOYMENT_GUIDE.md)
npx hardhat run scripts/deploy.js --network polygon
```

---

## 📚 Documentation

**For Deployment:**
- [Mainnet Deployment Guide](docs/MAINNET_DEPLOYMENT_GUIDE.md) - Complete step-by-step
- [Token Distribution Guide](docs/TOKEN_DISTRIBUTION_SIMPLE.md) - ELI5 version

**For Understanding:**
- [Architecture Overview](docs/ARCHITECTURE.md) - How everything works
- [What We Built](docs/WHAT_WE_BUILT.md) - Features explained
- [Testing Checklist](docs/TESTING_CHECKLIST.md) - Validation guide

**Post-Deployment:**
- [Mainnet Readiness Report](docs/mainnet-readiness-report.md) - Status summary

---

## 🏗️ Project Structure

```
path-dao-token/
├── contracts/
│   ├── PATH.sol              # Main token contract
│   └── PATHVesting.sol       # Vesting contract
├── scripts/
│   ├── deploy.js             # Main deployment script
│   ├── deploy-vesting.js     # Vesting deployment
│   └── utils/                # Helper scripts for testing
├── docs/                     # All documentation
├── test/                     # Unit tests (add your own)
└── hardhat.config.js         # Hardhat configuration
```

---

## 🔐 Security

**Roles:**
- `DEFAULT_ADMIN_ROLE` - Controls all roles
- `MINTER_ROLE` - Can mint tokens (up to 100M cap)
- `UPGRADER_ROLE` - Can upgrade contract
- `PAUSER_ROLE` - Can pause/unpause transfers

**Mainnet Security:**
- All roles → Gnosis Safe (3-of-5 multi-sig)
- Hardware wallets recommended for signers
- 48hr timelock on upgrades (recommended)

---

## 📊 Token Distribution

| Allocation | Amount | Status |
|------------|--------|--------|
| Treasury | 37M | Operations, partnerships |
| Community Rewards | 26M | Course completions, contributions |
| Founders | 22M | Vesting: 6mo cliff, 4yr linear |
| Early Members | 8M | Vesting: 1yr cliff, 3yr linear |
| Liquidity Pool | 7M | DEX liquidity |
| **Total** | **100M** | **Hard cap enforced** |

---

## 🛠️ Development

### Compile Contracts
```bash
npx hardhat compile
```

### Run Tests
```bash
npx hardhat test
```

### Deploy to Testnet (Amoy)
```bash
npx hardhat run scripts/deploy.js --network amoy
```

### Verify Contract
```bash
npx hardhat verify --network polygon YOUR_CONTRACT_ADDRESS
```

---

## 🌐 Networks

**Testnet (Amoy):**
- RPC: `https://polygon-amoy-bor-rpc.publicnode.com`
- Chain ID: `80002`
- Explorer: https://amoy.polygonscan.com

**Mainnet (Polygon):**
- RPC: `https://polygon-rpc.com`
- Chain ID: `137`
- Explorer: https://polygonscan.com

---

## 📞 Resources

**Tools:**
- [Gnosis Safe](https://app.safe.global) - Multi-sig wallet
- [Snapshot](https://snapshot.org) - Gasless voting
- [Guild.xyz](https://guild.xyz) - Token gating

**Documentation:**
- [OpenZeppelin Docs](https://docs.openzeppelin.com)
- [Hardhat Docs](https://hardhat.org/docs)

---

## ✅ Pre-Mainnet Checklist

Before deploying to mainnet:

- [ ] Gnosis Safe created with 3-of-5 signers
- [ ] `scripts/deploy.js` updated (100M mint, Safe addresses)
- [ ] Deployment wallet funded with 10 POL
- [ ] Team aligned on distribution plan
- [ ] Read [MAINNET_DEPLOYMENT_GUIDE.md](docs/MAINNET_DEPLOYMENT_GUIDE.md)

---

## 📝 License

MIT License - See LICENSE file

---

## 👥 Team

Built by the PATH DAO community

---

## 🔗 Links

- Website: (coming soon)
- Discord: (coming soon)
- Twitter: (coming soon)
- GitHub: https://github.com/path-dao/path-dao-token

---

**Built with ❤️ for the PATH DAO community**
