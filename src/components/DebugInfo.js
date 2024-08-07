import React from 'react';

const isHabitCompletedToday = (habit) => {
  if (!habit || !habit.log) return false;
  const today = new Date().setHours(0, 0, 0, 0);
  return habit.log.some(entry => 
    new Date(entry.date).setHours(0, 0, 0, 0) === today && entry.completed
  );
};

const isHabitSkippedToday = (habit) => {
  if (!habit || !habit.log) return false;
  const today = new Date().setHours(0, 0, 0, 0);
  return habit.log.some(entry => 
    new Date(entry.date).setHours(0, 0, 0, 0) === today && entry.skipped
  );
};

const calculateStats = (habitsToCount) => {
  return {
    total: habitsToCount.length,
    completed: habitsToCount.filter(habit => isHabitCompletedToday(habit)).length,
    skipped: habitsToCount.filter(habit => isHabitSkippedToday(habit)).length,
    active: habitsToCount.filter(habit => !isHabitCompletedToday(habit) && !isHabitSkippedToday(habit)).length
  };
};

const DebugInfo = ({ habits, selectedSection, sortBy, getHabitsForCurrentView }) => {
  if (process.env.NODE_ENV !== 'development') return null;

  const statsForView = calculateStats(getHabitsForCurrentView());
  const allStats = calculateStats(habits);

  return (
    <div className="mt-8 p-4 bg-gray-800 rounded">
      <h3 className="text-lg font-bold mb-2">Debug Info:</h3>
      <p>Current View: {selectedSection === 'all' ? 'All Habits' : `Area: ${selectedSection}`}</p>
      <p>Habits in Current View: {statsForView.total}</p>
      <p>Active Habits: {statsForView.active}</p>
      <p>Completed Habits: {statsForView.completed}</p>
      <p>Skipped Habits: {statsForView.skipped}</p>
      <p>Total Habits (All Areas): {allStats.total}</p>
      <p>Selected Section: {selectedSection}</p>
      <p>Sort By: {sortBy}</p>
    </div>
  );
};

export default DebugInfo;