// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title PATHVesting
 * @dev Simple vesting contract for PATH tokens with cliff and linear vesting
 */
contract PATHVesting is Ownable {
    IERC20 public immutable pathToken;

    struct VestingSchedule {
        uint256 totalAmount;      // Total tokens to vest
        uint256 amountClaimed;    // Tokens already claimed
        uint256 startTime;        // When vesting starts
        uint256 cliffDuration;    // Cliff period (no tokens released)
        uint256 vestingDuration;  // Total vesting period after cliff
    }

    mapping(address => VestingSchedule) public vestingSchedules;

    event VestingScheduleCreated(
        address indexed beneficiary,
        uint256 amount,
        uint256 startTime,
        uint256 cliffDuration,
        uint256 vestingDuration
    );
    event TokensClaimed(address indexed beneficiary, uint256 amount);

    constructor(address _pathToken) Ownable(msg.sender) {
        require(_pathToken != address(0), "Invalid token address");
        pathToken = IERC20(_pathToken);
    }

    /**
     * @dev Creates a vesting schedule for a beneficiary
     * @param beneficiary Address that will receive vested tokens
     * @param amount Total amount of tokens to vest
     * @param startTime When vesting starts (unix timestamp)
     * @param cliffMonths Number of months for cliff period
     * @param vestingMonths Number of months for vesting period (after cliff)
     */
    function createVestingSchedule(
        address beneficiary,
        uint256 amount,
        uint256 startTime,
        uint256 cliffMonths,
        uint256 vestingMonths
    ) external onlyOwner {
        require(beneficiary != address(0), "Invalid beneficiary");
        require(amount > 0, "Amount must be > 0");
        require(vestingSchedules[beneficiary].totalAmount == 0, "Schedule already exists");
        require(pathToken.balanceOf(address(this)) >= amount, "Insufficient balance");

        uint256 cliffDuration = cliffMonths * 30 days;
        uint256 vestingDuration = vestingMonths * 30 days;

        vestingSchedules[beneficiary] = VestingSchedule({
            totalAmount: amount,
            amountClaimed: 0,
            startTime: startTime,
            cliffDuration: cliffDuration,
            vestingDuration: vestingDuration
        });

        emit VestingScheduleCreated(
            beneficiary,
            amount,
            startTime,
            cliffDuration,
            vestingDuration
        );
    }

    /**
     * @dev Calculates the amount of tokens that can be claimed
     * @param beneficiary Address to check
     * @return Amount of tokens that can be claimed
     */
    function claimableAmount(address beneficiary) public view returns (uint256) {
        VestingSchedule memory schedule = vestingSchedules[beneficiary];

        if (schedule.totalAmount == 0) {
            return 0;
        }

        // Before cliff, nothing is vested
        if (block.timestamp < schedule.startTime + schedule.cliffDuration) {
            return 0;
        }

        uint256 vestedAmount;

        // After full vesting period, everything is vested
        if (block.timestamp >= schedule.startTime + schedule.cliffDuration + schedule.vestingDuration) {
            vestedAmount = schedule.totalAmount;
        } else {
            // Linear vesting after cliff
            uint256 timeAfterCliff = block.timestamp - (schedule.startTime + schedule.cliffDuration);
            vestedAmount = (schedule.totalAmount * timeAfterCliff) / schedule.vestingDuration;
        }

        return vestedAmount - schedule.amountClaimed;
    }

    /**
     * @dev Allows beneficiary to claim vested tokens
     */
    function claim() external {
        uint256 amount = claimableAmount(msg.sender);
        require(amount > 0, "No tokens to claim");

        vestingSchedules[msg.sender].amountClaimed += amount;

        require(pathToken.transfer(msg.sender, amount), "Transfer failed");

        emit TokensClaimed(msg.sender, amount);
    }

    /**
     * @dev Returns vesting schedule details for a beneficiary
     */
    function getVestingSchedule(address beneficiary) external view returns (
        uint256 totalAmount,
        uint256 amountClaimed,
        uint256 claimable,
        uint256 startTime,
        uint256 cliffEnd,
        uint256 vestingEnd
    ) {
        VestingSchedule memory schedule = vestingSchedules[beneficiary];
        return (
            schedule.totalAmount,
            schedule.amountClaimed,
            claimableAmount(beneficiary),
            schedule.startTime,
            schedule.startTime + schedule.cliffDuration,
            schedule.startTime + schedule.cliffDuration + schedule.vestingDuration
        );
    }

}
