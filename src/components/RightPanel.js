import React, { useState, useEffect } from 'react';
import { X, Calendar, Edit, Share2, ChevronLeft, ChevronRight, Check, X as XIcon, SkipForward } from 'lucide-react';
import { getHabitStatus, getHabitStats, calculateProgress } from '../utils/habitUtils';

const RightPanel = ({ habit, onClose, onEdit, habitCount, areaHabitCount }) => {
  console.log("RightPanel rendered with habit:", habit);

  // State for calendar view
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Effect to reset current month when habit changes
  useEffect(() => {
    setCurrentMonth(new Date());
  }, [habit]);

  // Date calculations
  const currentDate = new Date();
  const startDate = new Date(habit.startDate);
  const daysSinceStart = Math.floor((currentDate - startDate) / (1000 * 60 * 60 * 24));
  
  // Get habit statistics
  const stats = getHabitStats(habit);

  // Calculate progress
  const progress = calculateProgress(habit);

  // Function to render the calendar
  const renderCalendar = () => {
    const days = [];
    const weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Render weekday headers
    weekdays.forEach(day => {
      days.push(<div key={day} className="text-center text-xs font-bold text-gray-500">{day}</div>);
    });

    // Fill in blank days
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="text-center text-gray-500"></div>);
    }

    // Render days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const isToday = date.toDateString() === currentDate.toDateString();
      const status = getHabitStatus(habit, date);
      
      let statusIcon;
      let statusColor;
      if (status === 'complete') {
        statusIcon = <div className="w-2 h-2 bg-blue-500 rounded-full mx-auto mt-1"></div>;
        statusColor = 'bg-blue-500';
      } else if (status === 'skipped') {
        statusIcon = <SkipForward size={12} className="text-yellow-500 mx-auto mt-1" />;
        statusColor = 'bg-yellow-500';
      } else if (status === 'failed') {
        statusIcon = <XIcon size={12} className="text-red-500 mx-auto mt-1" />;
        statusColor = 'bg-red-500';
      }

      days.push(
        <div 
          key={i} 
          className={`text-center p-1 ${isToday ? `${statusColor} text-white rounded-full` : ''}`}
        >
          <div className="text-xs">{i}</div>
          {statusIcon}
        </div>
      );
    }

    return days;
  };

  // Function to change month
  const changeMonth = (increment) => {
    setCurrentMonth(prevMonth => {
      const newMonth = new Date(prevMonth);
      newMonth.setMonth(newMonth.getMonth() + increment);
      return newMonth;
    });
  };

  // Function to format the habit goal
  const formatHabitGoal = () => {
    return `${habit.goal.value} ${habit.goal.unit} ${habit.goal.timeframe}`;
  };

  return (
    <div className="w-1/3 bg-gray-800 p-4 overflow-y-auto h-screen fixed right-0 top-0 shadow-lg transition-transform duration-300 ease-in-out transform">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{habit.name}</h2>
        <div className="flex space-x-2">
          <button className="p-2 bg-gray-700 rounded"><Calendar size={16} /></button>
          <button className="p-2 bg-gray-700 rounded" onClick={() => onEdit(habit)}><Edit size={16} /></button>
          <button className="p-2 bg-gray-700 rounded"><Share2 size={16} /></button>
          <button className="p-2 bg-gray-700 rounded" onClick={onClose}><X size={16} /></button>
        </div>
      </div>
      
      {/* Goal */}
      <div className="mb-4 bg-gray-700 p-4 rounded">
        <h3 className="text-xs font-semibold text-gray-400 mb-1">GOAL</h3>
        <p className="text-lg font-bold">{formatHabitGoal()}</p>
      </div>

      {/* Progress */}
      <div className="mb-4 bg-gray-700 p-4 rounded">
        <h3 className="text-xs font-semibold text-gray-400 mb-1">PROGRESS</h3>
        <div className="w-full bg-gray-600 rounded-full h-2.5 mb-2">
          <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
        </div>
        <p className="text-sm">{progress.toFixed(1)}% complete</p>
      </div>
      
      {/* Current Streak */}
      <div className="mb-4 bg-gray-700 p-4 rounded">
        <h3 className="text-xs font-semibold text-gray-400 mb-1">CURRENT STREAK</h3>
        <div className="flex items-center">
          <div className="text-orange-500 mr-2">🔥</div>
          <p className="text-2xl font-bold">{stats.streak} days</p>
        </div>
        <p className="text-xs text-gray-400">FROM {startDate.toLocaleDateString()}</p>
      </div>
      
      {/* Habit Statistics */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-700 p-2 rounded">
          <h4 className="text-xs font-semibold text-gray-400 mb-1 flex items-center">
            <Check size={12} className="mr-1 text-green-500" /> COMPLETE
          </h4>
          <p className="text-lg font-bold">{stats.completeDays} days</p>
          <p className="text-xs text-green-500">↑ {stats.completeDays} days</p>
        </div>
        <div className="bg-gray-700 p-2 rounded">
          <h4 className="text-xs font-semibold text-gray-400 mb-1 flex items-center">
            <XIcon size={12} className="mr-1 text-red-500" /> FAILED
          </h4>
          <p className="text-lg font-bold">{stats.failedDays} days</p>
          <p className="text-xs text-gray-400">---</p>
        </div>
        <div className="bg-gray-700 p-2 rounded">
          <h4 className="text-xs font-semibold text-gray-400 mb-1 flex items-center">
            <SkipForward size={12} className="mr-1 text-yellow-500" /> SKIPPED
          </h4>
          <p className="text-lg font-bold">{stats.skippedDays} days</p>
          <p className="text-xs text-gray-400">---</p>
        </div>
        <div className="bg-gray-700 p-2 rounded">
          <h4 className="text-xs font-semibold text-gray-400 mb-1">TOTAL</h4>
          <p className="text-lg font-bold">{stats.totalDays} times</p>
          <p className="text-xs text-green-500">↑ {stats.totalDays} times</p>
        </div>
      </div>

      {/* Habit Counts */}
      <div className="mb-4 bg-gray-700 p-2 rounded">
        <h4 className="text-xs font-semibold text-gray-400 mb-1">HABIT COUNTS</h4>
        <p className="text-sm">Total Habits: <span className="font-bold">{habitCount}</span></p>
        <p className="text-sm">Habits in this Area: <span className="font-bold">{areaHabitCount}</span></p>
      </div>
      
      {/* Calendar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <button onClick={() => changeMonth(-1)}><ChevronLeft size={20} /></button>
          <h3 className="text-lg font-semibold">
            {currentMonth.toLocaleString('default', { month: 'long' })} {currentMonth.getFullYear()}
          </h3>
          <button onClick={() => changeMonth(1)}><ChevronRight size={20} /></button>
        </div>
        <div className="grid grid-cols-7 gap-1">
          {renderCalendar()}
        </div>
      </div>
      
      {/* Streaks */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Streaks</h3>
        <div className="bg-gray-700 p-4 rounded">
          <div className="flex justify-between text-xs text-gray-400">
            <span>{startDate.toLocaleDateString()}</span>
            <span>{currentDate.toLocaleDateString()}</span>
          </div>
          <div className="h-8 bg-blue-500 rounded-full mt-2" style={{ width: `${(stats.streak / daysSinceStart) * 100}%` }}></div>
        </div>
      </div>

      {/* Notes section */}
      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">Notes</h3>
        <textarea 
          className="w-full bg-gray-700 text-white rounded p-2"
          rows="3"
          placeholder="Add notes about this habit..."
        ></textarea>
      </div>
    </div>
  );
};

export default RightPanel;