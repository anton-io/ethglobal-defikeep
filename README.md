# ⛓️ DeFi Keep

**DeFi Keep** is a minimalistic, secure EVM smart contract for locking then native token over long periods of time.

Users can designate a reclaim address and specify a duration after which the funds can be withdrawn.

Perfect for long-term holders, inheritance planning, or crypto time capsules.

# 🔒⏳🔥 Motivation
Most investors underperform the very assets they invest in. According to many studies [[1]](https://www.etoro.com/news-and-analysis/press-releases/short-term-fling-or-long-term-love-analysis-shows-commitment-pays-off-when-it-comes-to-investing/)[[2]](https://www.bluewealth.com.au/general-knowledge/the-best-performing-investors-are-ones-that-are-dead/), the average investor earns significantly less than the market average, often due to emotional decisions like panic selling, FOMO buying, or trying to time the market.

In crypto, it’s even more dramatic:

* 📉 80% of active crypto traders underperform HODLers.

* ⌛ Long-term holders (LTHs) of Bitcoin historically outperform short-term speculators over nearly every 4-year cycle.

* 💸 Many retail users sell too early or rotate into worse-performing assets due to short-term thinking.

That's why offering a simple, transparent, and enforceable way to HODL isn't just useful, it's a valuable contribution to long-term investing discipline.

---

## 🧠 What It Does

DeFi Keep allows any user to:

- Lock the native token for a specified number of seconds.
- Assign a reclaim address to retrieve the funds after the unlock period.
- Update the reclaim address (e.g., if a wallet is compromised).
- View the remaining time and lock details.
- Support multiple locks per address, each with its own terms.

---

## 🔐 Features

- ✅ Time-based unlocks.
- ✅ Multiple locks per user.
- ✅ Reclaim address updatable by the current reclaim address.
- ✅ Reentrancy protection.
- ✅ Self-contained with no external dependencies.

---

## 📝 Contract Details

- **Language**: Solidity `^0.8.20`
- **File**: [`DeFiKeep.sol`](./contract/DeFiKeep.sol)
- **License**: MIT
- **Status**: Beta — Use at your own risk!

## 📦 Contract Deployments

The DeFi Keep contract has been deployed and verified in the following chains/addresses:

- **Citrea (testnet)**: [0xa1AC5bD954aa0857F15287eC67Fee4d5587f6E04](https://explorer.testnet.citrea.xyz/address/0xa1AC5bD954aa0857F15287eC67Fee4d5587f6E04?tab=contract)
- **RootStock (testnet)**: [0x88b9AD1E44b6Fc2E1F2B6A4D2b862c4C20144a6d](https://rootstock-testnet.blockscout.com/address/0x88b9AD1E44b6Fc2E1F2B6A4D2b862c4C20144a6d?tab=contract)
---

## 🚀 How to Use

DeFi Keep mainly consists of 3 operations: 1) lock funds, 2) reclaim funds, and 3) optionally transfer the lock ownership of locked funds to a new owner/address. 

### 🔐 Lock Native Token

Use the `lock` function to securely lock the native token for a specified period. Once locked, the funds cannot be reclaimed until the unlock time has passed.

```solidity
function lock(address reclaimAddress, uint256 timeInSeconds) external payable returns (uint256 lockId)
```

### 💰 Reclaim Locked Funds
Once the lock period has passed, the reclaim address can call this function to withdraw the locked funds.

```solidity
function reclaim(uint256 lockId) external
```

### 🛠 Update Reclaim Address

Use this function to change the reclaim address for a specific lock. This is useful if you want to transfer ownership to a new wallet (e.g. hardware wallet or cold storage).

```solidity
function updateReclaimAddress(uint256 lockId, address newAddress) external
```
