// src/utils/habitUtils.js

/**
 * Determines the status of a habit for a given date.
 * @param {Object} habit - The habit object.
 * @param {Date|string} date - The date to check.
 * @returns {string|null} The status of the habit ('complete', 'skipped', 'failed', or null).
 */
export const getHabitStatus = (habit, date) => {
  // Convert date strings to Date objects for comparison
  const checkDate = new Date(date);
  checkDate.setHours(0, 0, 0, 0); // Reset time to start of day
  const startDate = new Date(habit.startDate);
  startDate.setHours(0, 0, 0, 0);

  // If the check date is before the habit start date, return null
  if (checkDate < startDate) {
    return null;
  }

  // If the habit has an end date and the check date is after it, return null
  if (habit.endDate) {
    const endDate = new Date(habit.endDate);
    endDate.setHours(0, 0, 0, 0);
    if (checkDate > endDate) {
      return null;
    }
  }

  // Check if the habit should be tracked on this date based on repeatPattern
  if (!shouldTrackHabitOnDate(habit, checkDate)) {
    return null;
  }

  // Find the log entry for the given date
  const logEntry = habit.log?.find(entry => {
    const entryDate = new Date(entry.date);
    return entryDate.getTime() === checkDate.getTime();
  });

  if (logEntry) {
    if (logEntry.completed) return 'complete';
    if (logEntry.skipped) return 'skipped';
    return 'failed';
  }

  // If no log entry found and it's today or a future date, return null
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (checkDate >= today) {
    return null;
  }

  // If no log entry found for a past date, consider it as failed
  return 'failed';
};

/**
 * Determines if a habit should be tracked on a given date based on its repeat pattern.
 * @param {Object} habit - The habit object.
 * @param {Date} date - The date to check.
 * @returns {boolean} Whether the habit should be tracked on the given date.
 */
const shouldTrackHabitOnDate = (habit, date) => {
  switch (habit.repeatPattern.type) {
    case 'daily':
      return true;
    case 'weekly':
      return habit.repeatPattern.daysOfWeek.includes(date.getDay());
    case 'monthly':
      return date.getDate() === habit.repeatPattern.dayOfMonth;
    case 'yearly':
      return date.getMonth() + 1 === habit.repeatPattern.monthOfYear &&
             date.getDate() === habit.repeatPattern.dayOfMonth;
    default:
      return false;
  }
};

/**
 * Calculates the current streak for a habit.
 * @param {Object} habit - The habit object.
 * @returns {number} The current streak count.
 */
export const calculateStreak = (habit) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let currentStreak = 0;
  let latestDate = new Date(habit.startDate);
  latestDate.setHours(0, 0, 0, 0);

  while (latestDate <= today) {
    const status = getHabitStatus(habit, latestDate);
    if (status === 'complete') {
      currentStreak++;
    } else if (status === 'failed') {
      currentStreak = 0;
    }
    // If status is 'skipped' or null, we continue the streak but don't increment it
    latestDate.setDate(latestDate.getDate() + 1);
  }

  return currentStreak;
};

/**
 * Calculates various statistics for a habit.
 * @param {Object} habit - The habit object.
 * @returns {Object} An object containing habit statistics.
 */
export const getHabitStats = (habit) => {
  const completeDays = habit.log?.filter(entry => entry.completed).length || 0;
  const skippedDays = habit.log?.filter(entry => entry.skipped).length || 0;
  const failedDays = habit.log?.filter(entry => !entry.completed && !entry.skipped).length || 0;
  const totalDays = completeDays + skippedDays + failedDays;

  return {
    completeDays,
    skippedDays,
    failedDays,
    totalDays,
    streak: calculateStreak(habit)
  };
};

/**
 * Calculates the progress towards the habit's goal.
 * @param {Object} habit - The habit object.
 * @returns {number} The progress as a percentage (0-100).
 */
export const calculateProgress = (habit) => {
  const stats = getHabitStats(habit);
  const { completeDays } = stats;

  let targetDays;
  switch (habit.goal.timeframe) {
    case 'total':
      targetDays = habit.goal.value;
      break;
    case 'per day':
      targetDays = 1;
      break;
    case 'per week':
      targetDays = 7;
      break;
    case 'per month':
      targetDays = 30; // Approximation
      break;
    default:
      targetDays = 1;
  }

  const progress = (completeDays / targetDays) * 100;
  return Math.min(progress, 100); // Cap at 100%
};