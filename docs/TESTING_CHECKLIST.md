# PATH Token Testing Checklist

Use this checklist to thoroughly test your PATH token on Amoy testnet before deploying to mainnet.

## Your Deployed Token Info

```
Contract Address: [YOUR_TESTNET_PATH_ADDRESS]
Network: Polygon Amoy Testnet
Your Address: [YOUR_TESTNET_WALLET_ADDRESS]
Block Explorer: https://amoy.polygonscan.com/address/[YOUR_TESTNET_PATH_ADDRESS]
```

---

## 1. Basic Token Functions

### ✅ View Token in MetaMask
- [X] Open MetaMask, switch to Polygon Amoy network
- [X] Click "Import tokens"
- [X] Paste contract address: `[YOUR_TESTNET_PATH_ADDRESS]`
- [X] Verify you see: **1,000,000 PATH**

**Expected Result:** Token appears in your wallet with correct balance

---

### ✅ Transfer Tokens
- [X] Create a second test wallet address (or use a friend's)
- [X] In MetaMask, send 100 PATH to that address
- [X] Check transaction on PolygonScan
- [X] Verify recipient received 100 PATH
- [X] Verify your balance is now 999,900 PATH

**Expected Result:** Transfer succeeds, balances update correctly

**Test Address Ideas:**
- Create new MetaMask account
- Use: `0x000000000000000000000000000000000000dEaD` (burn address)

---

### ✅ Check Token Details on PolygonScan
- [ ] Go to: https://amoy.polygonscan.com/address/[YOUR_TESTNET_PATH_ADDRESS]
- [ ] Click "Contract" tab
- [ ] Verify contract is verified (or shows bytecode)
- [ ] Click "Read Contract"
- [ ] Check these values:
  - [ ] `name()` returns "PATH"
  - [ ] `symbol()` returns "PATH"
  - [ ] `totalSupply()` returns 1000000000000000000000000 (1M * 10^18)
  - [ ] `MAX_SUPPLY()` returns 100000000000000000000000000 (100M * 10^18)
  - [ ] `decimals()` returns 18
  - [ ] `balanceOf(your_address)` shows your balance

**Expected Result:** All values match expectations

---

## 2. Role-Based Access Control

### ✅ Check Your Roles
On PolygonScan → Read Contract:
- [ ] `hasRole(DEFAULT_ADMIN_ROLE, your_address)` returns `true`
- [ ] `hasRole(MINTER_ROLE, your_address)` returns `true`
- [ ] `hasRole(UPGRADER_ROLE, your_address)` returns `true`
- [ ] `hasRole(PAUSER_ROLE, your_address)` returns `true`

**Role Hashes:**
- DEFAULT_ADMIN_ROLE: `0x0000000000000000000000000000000000000000000000000000000000000000`
- MINTER_ROLE: `0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6`
- UPGRADER_ROLE: `0x189ab7a9244df0848122154315af71fe140f3db0fe014031783b0946b8c9d2e3`
- PAUSER_ROLE: `0x65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a`

**Expected Result:** You have all 4 roles

---

### ✅ Test Minting (Max Supply Cap)
On PolygonScan → Write Contract (Connect wallet first):

**Test 1: Normal Mint**
- [ ] Call `mint(address, amount)`
  - address: your address
  - amount: `1000000000000000000000` (1,000 tokens)
- [ ] Transaction succeeds
- [ ] Balance increases by 1,000 PATH

**Test 2: Try to Exceed Max Supply**
- [ ] Call `mint(address, amount)`
  - address: your address
  - amount: `100000000000000000000000000` (100M tokens - will exceed cap)
- [ ] Transaction **FAILS** with error: "PATH: Max supply exceeded"

**Expected Result:** Normal minting works, exceeding cap fails

---

### ✅ Test Pause/Unpause
On PolygonScan → Write Contract:

**Test 1: Pause Token**
- [ ] Call `pause()`
- [ ] Transaction succeeds
- [ ] Try to transfer tokens in MetaMask
- [ ] Transfer **FAILS** (paused)

**Test 2: Unpause Token**
- [ ] Call `unpause()`
- [ ] Transaction succeeds
- [ ] Try to transfer tokens in MetaMask
- [ ] Transfer **SUCCEEDS** (unpaused)

**Expected Result:** Pause stops all transfers, unpause resumes them

---

## 3. Governance Features

### ✅ Delegate Voting Power
On PolygonScan → Write Contract:

- [ ] Call `delegate(address)`
  - address: your own address
- [ ] Transaction succeeds
- [ ] Go to Read Contract
- [ ] Call `getVotes(your_address)`
- [ ] Verify it returns your full balance

**Expected Result:** Delegating to yourself activates voting power

**What This Does:**
- Delegation activates voting power for governance
- You can delegate to yourself or someone else
- Voting power = your token balance

---

### ✅ Check Voting Power
- [ ] On Read Contract, call `getVotes(your_address)`
- [ ] Should match your token balance (if delegated to yourself)
- [ ] Transfer some tokens to another address
- [ ] Check `getVotes` again - should decrease

**Expected Result:** Voting power tracks your delegated balance

---

## 4. Burn Tokens

### ✅ Test Burning
In MetaMask or PolygonScan → Write Contract:

- [ ] Call `burn(amount)`
  - amount: `100000000000000000000` (100 tokens)
- [ ] Transaction succeeds
- [ ] Check `totalSupply()` - should decrease by 100
- [ ] Check your balance - should decrease by 100

**Expected Result:** Burning reduces total supply permanently

---

## 5. Guild.xyz Integration

### ✅ Create Guild with Token Gating
- [ ] Go to https://guild.xyz
- [ ] Click "Create Guild"
- [ ] Set up basic guild info
- [ ] Add Requirement:
  - Type: "Hold tokens"
  - Network: Polygon Amoy Testnet
  - Contract: `[YOUR_TESTNET_PATH_ADDRESS]`
  - Minimum: 10 PATH tokens
- [ ] Connect your wallet
- [ ] Verify you meet the requirement (have > 10 tokens)

**Expected Result:** Guild.xyz recognizes your token and balance

---

### ✅ Test Token Gating
- [ ] Create second test wallet with 0 PATH
- [ ] Try to join guild with second wallet
- [ ] Should **FAIL** (doesn't meet requirement)
- [ ] Send 20 PATH from main wallet to second wallet
- [ ] Try to join guild again with second wallet
- [ ] Should **SUCCEED** (now has > 10 tokens)

**Expected Result:** Guild.xyz correctly enforces token requirements

---

## 6. Security Testing

### ✅ Test Role Restrictions
Create a second test wallet that has NO roles:

**Test 1: Unauthorized Minting**
- [ ] From second wallet, try to call `mint()`
- [ ] Transaction **FAILS** (doesn't have MINTER_ROLE)

**Test 2: Unauthorized Pause**
- [ ] From second wallet, try to call `pause()`
- [ ] Transaction **FAILS** (doesn't have PAUSER_ROLE)

**Expected Result:** Only authorized addresses can perform privileged actions

---

### ✅ Test Max Supply Protection
- [ ] Check current total supply
- [ ] Calculate: `100,000,000 - current_supply = remaining`
- [ ] Try to mint: `remaining + 1` tokens
- [ ] Transaction **FAILS** (would exceed cap)
- [ ] Try to mint exactly `remaining` tokens
- [ ] Transaction **SUCCEEDS**
- [ ] Try to mint 1 more token
- [ ] Transaction **FAILS** (at max supply)

**Expected Result:** Cannot exceed 100M token cap under any circumstances

---

## 7. Permit Function (ERC-2612)

### ✅ Test Gasless Approval
This is advanced - test only if you need it:

- [ ] Use ethers.js to create a permit signature
- [ ] Call `permit()` with signature
- [ ] Verify approval was granted without sender paying gas

**Expected Result:** Approvals work via signatures (gasless)

**Note:** This requires writing a script. Skip for now if not needed.

---

## 8. Upgradability Testing

### ✅ Verify Contract is Upgradeable
On PolygonScan → Read Contract:

- [ ] Verify `upgradeTo` or `upgradeToAndCall` function exists
- [ ] Verify you have UPGRADER_ROLE
- [ ] Check implementation address (advanced)

**Note:** Don't actually upgrade on testnet unless you have a new implementation ready!

**Expected Result:** Upgrade functions exist and are restricted to UPGRADER_ROLE

---

## 9. Edge Cases & Stress Testing

### ✅ Transfer Edge Cases
- [ ] Try to transfer 0 tokens → Should succeed (weird but allowed)
- [ ] Try to transfer more than you have → Should fail
- [ ] Try to transfer to zero address (0x000...000) → May fail or burn
- [ ] Try to transfer to contract address itself → Should succeed

**Expected Result:** Token handles edge cases gracefully

---

### ✅ Multiple Rapid Transactions
- [ ] Send 5 transactions rapidly (transfer, mint, delegate, etc.)
- [ ] All should process eventually
- [ ] Check final balances match expectations

**Expected Result:** Contract handles concurrent transactions correctly

---

## 10. Block Explorer Verification

### ✅ Transaction History
On PolygonScan:

- [ ] Click "Transactions" tab
- [ ] Verify you see:
  - Contract deployment
  - Your test transfers
  - Mint transactions
  - Pause/unpause (if tested)
- [ ] Click on each transaction
- [ ] Verify details are correct

**Expected Result:** All transactions visible and accurate

---

### ✅ Token Holders
On PolygonScan:

- [ ] Click "Holders" tab (if available)
- [ ] Verify you see your address with balance
- [ ] Verify any test addresses you sent tokens to

**Expected Result:** Holder list is accurate

---

## 11. Documentation & Code Review

### ✅ Review Deployed Code
- [ ] On PolygonScan → "Contract" tab
- [ ] Compare bytecode to your local compiled version
- [ ] Read through your contract code
- [ ] Verify no surprises or unexpected functions

**Expected Result:** Deployed code matches what you intended

---

## Pre-Mainnet Final Checklist

Before deploying to Polygon mainnet, ensure:

- [ ] All tests above passed
- [ ] No unexpected behavior discovered
- [ ] Guild.xyz integration works perfectly
- [ ] You understand all features and limitations
- [ ] You've read `WHAT_WE_BUILT.md` and `ARCHITECTURE.md`
- [ ] You have real POL for mainnet deployment (~$0.50)
- [ ] You've updated contract to mint 100M tokens (not 1M)
- [ ] You have a Gnosis Safe ready for treasury
- [ ] You have a plan for initial token distribution

---

## Common Issues & Solutions

### Issue: "Transaction failed"
**Check:**
- Do you have enough MATIC for gas?
- Are you on the correct network (Amoy)?
- Are you calling a restricted function without the right role?

### Issue: "Can't see token in MetaMask"
**Fix:**
- Make sure you're on Amoy network
- Import token manually with contract address
- Wait a few minutes for blockchain sync

### Issue: "Guild.xyz doesn't recognize my tokens"
**Fix:**
- Make sure you're connected to the same wallet
- Ensure Guild.xyz is set to "Polygon Amoy" network
- Wait for blockchain to sync (~1-2 minutes)
- Refresh the page

### Issue: "Voting power is 0"
**Fix:**
- You need to call `delegate(your_address)` first
- Delegation activates voting power
- Check `getVotes()` after delegating

---

## Notes Section

Use this space to record your test results:

```
Test Date: ___________

Token Address: [YOUR_TESTNET_PATH_ADDRESS]

Test Wallets Used:
1. Main: [YOUR_TESTNET_WALLET_ADDRESS]
2. Test: ___________
3. Test: ___________

Issues Found:
-
-

Features to Add Before Mainnet:
-
-

Questions/Concerns:
-
-
```

---

## Ready for Mainnet?

If all tests passed, you're ready! See `README.md` for mainnet deployment instructions.

**Remember:**
- Mainnet costs real money
- Contracts are permanent
- Test everything twice
- Have a backup plan

Good luck! 🚀
