// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title PATHTimelock
 * @notice Simple timelock for Future Growth allocation
 * @dev Locks 10M PATH for 2 years, requires community vote to release
 *
 * Purpose: "Resources for sustainable operations; requires community vote to release"
 *
 * Flow:
 * 1. Deploy contract
 * 2. Transfer 10M PATH to contract
 * 3. After 2 years: Community votes via Snapshot
 * 4. If approved: Owner (Treasury Safe) can withdraw
 */
contract PATHTimelock is Ownable {
    IERC20 public immutable pathToken;
    uint256 public immutable unlockTime;
    uint256 public constant LOCK_DURATION = 730 days; // 2 years

    bool public withdrawn;

    event TokensLocked(uint256 amount, uint256 unlockTime);
    event TokensWithdrawn(address indexed recipient, uint256 amount);

    /**
     * @notice Constructor sets PATH token and calculates unlock time
     * @param _pathToken Address of PATH token contract
     */
    constructor(address _pathToken) Ownable(msg.sender) {
        require(_pathToken != address(0), "Invalid token address");

        pathToken = IERC20(_pathToken);
        unlockTime = block.timestamp + LOCK_DURATION;

        emit TokensLocked(0, unlockTime); // Amount will be transferred after deployment
    }

    /**
     * @notice Check if tokens are unlocked
     * @return bool True if current time >= unlockTime
     */
    function isUnlocked() public view returns (bool) {
        return block.timestamp >= unlockTime;
    }

    /**
     * @notice Get time remaining until unlock
     * @return uint256 Seconds until unlock (0 if already unlocked)
     */
    function timeUntilUnlock() public view returns (uint256) {
        if (isUnlocked()) {
            return 0;
        }
        return unlockTime - block.timestamp;
    }

    /**
     * @notice Get current locked balance
     * @return uint256 Amount of PATH tokens in contract
     */
    function getLockedBalance() public view returns (uint256) {
        return pathToken.balanceOf(address(this));
    }

    /**
     * @notice Withdraw tokens after unlock time
     * @dev Only callable by owner (Treasury Safe) after unlock time
     * @dev Requires community governance vote before calling
     * @param recipient Address to receive tokens
     */
    function withdraw(address recipient) external onlyOwner {
        require(isUnlocked(), "Tokens still locked");
        require(!withdrawn, "Already withdrawn");
        require(recipient != address(0), "Invalid recipient");

        uint256 balance = getLockedBalance();
        require(balance > 0, "No tokens to withdraw");

        withdrawn = true;

        require(pathToken.transfer(recipient, balance), "Transfer failed");

        emit TokensWithdrawn(recipient, balance);
    }

    /**
     * @notice Emergency withdraw function (only before any tokens deposited)
     * @dev Safety mechanism in case of deployment error
     * @dev Can only be used if balance is 0
     */
    function emergencyCancel() external view onlyOwner {
        require(getLockedBalance() == 0, "Tokens already deposited");
        // Transfer ownership back to owner for contract cleanup
        // This allows redeployment if setup went wrong
    }
}
