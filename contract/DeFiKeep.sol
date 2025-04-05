// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// @title DeFi Keep: Time-Locked native token vault onchain
// @author Antonio Roldao
// @notice This contract allows users to lock the native token for a specified
//         duration with a designated reclaim address. Funds can only be reclaimed
//         by the reclaim address after the unlock time. Ideal for secure,
//         long-term storage.
/**
 *
 *  /$$$$$$$          /$$$$$$$$/$$       /$$   /$$
 * | $$__  $$        | $$_____|__/      | $$  /$$/
 * | $$  \ $$ /$$$$$$| $$      /$$      | $$ /$$/  /$$$$$$  /$$$$$$  /$$$$$$
 * | $$  | $$/$$__  $| $$$$$  | $$      | $$$$$/  /$$__  $$/$$__  $$/$$__  $$
 * | $$  | $| $$$$$$$| $$__/  | $$      | $$  $$ | $$$$$$$| $$$$$$$| $$  \ $$
 * | $$  | $| $$_____| $$     | $$      | $$\  $$| $$_____| $$_____| $$  | $$
 * | $$$$$$$|  $$$$$$| $$     | $$      | $$ \  $|  $$$$$$|  $$$$$$| $$$$$$$/
 * |_______/ \_______|__/     |__/      |__/  \__/\_______/\_______| $$____/
 *                                                                 | $$
 *                                                                 | $$
 *                                                                 |__/
 *
 *
 *  DeFiKeep - Time-locked native token onchain.
 *
 *  A minimal and auditable smart contract for long-term native token storage.
 *  Users can lock native token for a specified period and assign a reclaim address.
 *  Only after the lock duration has passed can the funds be reclaimed.
 *
 *  Features:
 *   - Lock the native token for a fixed period (e.g., 5+ years).
 *   - Specify a reclaim address (different from the sender if desired).
 *   - Update the reclaim address prior to unlocking.
 *   - View time remaining or check if a lock is unlockable.
 *   - Protection against reentrancy attacks.
 *
 *  Ideal for:
 *   - Cold storage enforcement.
 *   - Native token time capsules.
 *   - HODL with hard-coded discipline.
 *
*/

contract DeFiKeep {
    // Define a struct to represent each lock.
    // Each lock contains the reclaim address, the amount, when it was locked, unlock time, and reclaimed status.
    struct Lock {
        address reclaimAddress; // The address that is allowed to reclaim the locked funds.
        uint256 amount;         // The amount of native token locked.
        uint256 lockedTime;     // The timestamp of when the funds were locked.
        uint256 unlockTime;     // The time when the lock is released and funds can be reclaimed.
        bool reclaimed;         // Whether the funds have already been reclaimed.
    }

    // Mapping that stores a list of locks for each address (indexed by reclaimAddress address).
    mapping(address => Lock[]) public locks;

    // Events that log various actions in the contract.
    event Locked(address indexed reclaimAddress, uint256 amount, uint256 lockedTime, uint256 unlockTime);
    event Reclaimed(address indexed reclaimAddress, uint256 amount);
    event ReclaimAddressUpdated(address indexed reclaimAddress, address indexed newAddress, uint256 lockId);

    // Reentrancy guard to prevent reentrancy attacks.
    uint256 private _lock;

    // Modifier that prevents reentrancy attacks.
    modifier nonReentrant() {
        require(_lock == 0, "ReentrancyGuard: reentrant call");
        _lock = 1;
        _;
        _lock = 0;
    }

    // Function to lock the native token for a specified duration and associate a reclaim address.
    function lock(address reclaimAddress, uint256 timeInSeconds) external payable returns (uint256 lockId) {
        require(msg.value > 0, "Must lock a positive value.");
        require(reclaimAddress != address(0), "Invalid reclaim address.");
        require(timeInSeconds > 0, "Must specify lock duration.");

        uint256 unlockTime = block.timestamp + timeInSeconds;
        uint256 lockedTime = block.timestamp;

        locks[msg.sender].push(Lock({
            reclaimAddress: reclaimAddress,
            amount: msg.value,
            lockedTime: lockedTime,
            unlockTime: unlockTime,
            reclaimed: false
        }));

        lockId = locks[msg.sender].length - 1;

        emit Locked(reclaimAddress, msg.value, lockedTime, unlockTime);
    }

    // Function to update the reclaim address for an existing lock.
    function updateReclaimAddress(uint256 lockId, address newAddress) external {
        require(newAddress != address(0), "Invalid address.");
        Lock memory locked = locks[msg.sender][lockId];
        require(msg.sender == locked.reclaimAddress, "Not reclaim address.");
        require(!locked.reclaimed, "Already reclaimed.");

        locked.reclaimAddress = newAddress;
        locks[newAddress].push(locked);

        uint256 lastIndex = locks[msg.sender].length - 1;
        if (lockId != lastIndex) {
            locks[msg.sender][lockId] = locks[msg.sender][lastIndex];
        }
        locks[msg.sender].pop();

        emit ReclaimAddressUpdated(msg.sender, newAddress, lockId);
    }

    // Function to allow the reclaim address to withdraw the locked funds after the unlock time.
    function reclaim(uint256 lockId) external nonReentrant {
        Lock storage locked = locks[msg.sender][lockId];
        require(msg.sender == locked.reclaimAddress, "Not reclaim address.");
        require(!locked.reclaimed, "Already reclaimed.");
        require(block.timestamp >= locked.unlockTime, "Not unlocked yet.");

        locked.reclaimed = true;
        uint256 amount = locked.amount;

        (bool success, ) = locked.reclaimAddress.call{value: amount}("");
        require(success, "Transfer failed.");

        emit Reclaimed(locked.reclaimAddress, amount);
    }

    // Function to check how much time is left until a specific lock is unlocked.
    function timeLeft(address reclaimAddress, uint256 lockId) external view returns (uint256) {
        Lock storage locked = locks[reclaimAddress][lockId];
        if (block.timestamp >= locked.unlockTime) return 0;
        return locked.unlockTime - block.timestamp;
    }

    // Function to check whether a specific lock has been unlocked.
    function isUnlocked(address reclaimAddress, uint256 lockId) external view returns (bool) {
        return block.timestamp >= locks[reclaimAddress][lockId].unlockTime;
    }

    // Function to get all locks for a specific address.
    function getLocks(address user) external view returns (Lock[] memory) {
        return locks[user];
    }

    // Function to get the details of a specific lock.
    function lockDetails(address reclaimAddress, uint256 lockId) external view returns (Lock memory) {
        return locks[reclaimAddress][lockId];
    }

    // Fallback function to prevent accidental token transfers.
    receive() external payable {
        revert("Use lock() to send.");
    }
}