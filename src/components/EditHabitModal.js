import React, { useState } from 'react';
import { X, Calendar } from 'lucide-react';

const EditHabitModal = ({ habit, areas, onSaveEdit, onClose }) => {
  // Initialize state with the current habit data, applying necessary transformations
  const [editedHabit, setEditedHabit] = useState({
    ...habit,
    goal: habit.goal || { value: 1, unit: 'times', timeframe: 'per day' },
    repeatPattern: habit.repeatPattern || { type: 'daily', daysOfWeek: [], dayOfMonth: 1, monthOfYear: 1 },
    completionTarget: habit.completionTarget || { type: 'every time', value: 1, timeframe: 'day' },
    timeOfDay: habit.timeOfDay || ['any time'],
    specificTime: habit.specificTime || null,
    areaId: habit.areaId || '',
    startDate: habit.startDate ? new Date(habit.startDate).toISOString().split('T')[0] : '',
    endDate: habit.endDate ? new Date(habit.endDate).toISOString().split('T')[0] : ''
  });

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const formattedHabit = {
      ...editedHabit,
      areaId: editedHabit.areaId === "" ? null : editedHabit.areaId,
      startDate: editedHabit.startDate ? new Date(editedHabit.startDate).toISOString() : null,
      endDate: editedHabit.endDate ? new Date(editedHabit.endDate).toISOString() : null
    };
    onSaveEdit(formattedHabit);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 p-6 rounded-lg w-96 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white">Edit Habit</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          {/* Habit Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-400 mb-1">NAME</label>
            <input
              type="text"
              className="bg-gray-800 text-white px-3 py-2 rounded w-full"
              value={editedHabit.name}
              onChange={(e) => setEditedHabit({...editedHabit, name: e.target.value})}
              required
            />
          </div>

          {/* Goal */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-400 mb-1">GOAL</label>
            <div className="flex space-x-2">
              <input
                type="number"
                className="bg-gray-800 text-white px-3 py-2 rounded w-16"
                value={editedHabit.goal.value}
                onChange={(e) => setEditedHabit({...editedHabit, goal: {...editedHabit.goal, value: parseInt(e.target.value)}})}
                min="1"
                required
              />
              <select 
                className="bg-gray-800 text-white px-3 py-2 rounded flex-grow"
                value={editedHabit.goal.unit}
                onChange={(e) => setEditedHabit({...editedHabit, goal: {...editedHabit.goal, unit: e.target.value}})}
              >
                <option value="times">Times</option>
                <option value="minutes">Minutes</option>
                <option value="hours">Hours</option>
              </select>
              <select 
                className="bg-gray-800 text-white px-3 py-2 rounded flex-grow"
                value={editedHabit.goal.timeframe}
                onChange={(e) => setEditedHabit({...editedHabit, goal: {...editedHabit.goal, timeframe: e.target.value}})}
              >
                <option value="total">Total</option>
                <option value="per day">Per Day</option>
                <option value="per week">Per Week</option>
                <option value="per month">Per Month</option>
              </select>
            </div>
          </div>

          {/* Repeat Pattern */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-400 mb-1">REPEAT PATTERN</label>
            <select 
              className="bg-gray-800 text-white px-3 py-2 rounded w-full"
              value={editedHabit.repeatPattern.type}
              onChange={(e) => setEditedHabit({...editedHabit, repeatPattern: {...editedHabit.repeatPattern, type: e.target.value}})}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

          {/* Completion Target */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-400 mb-1">COMPLETION TARGET</label>
            <div className="flex space-x-2">
              <select 
                className="bg-gray-800 text-white px-3 py-2 rounded flex-grow"
                value={editedHabit.completionTarget.type}
                onChange={(e) => setEditedHabit({...editedHabit, completionTarget: {...editedHabit.completionTarget, type: e.target.value}})}
              >
                <option value="every time">Every Time</option>
                <option value="times per timeframe">Times Per Timeframe</option>
                <option value="days per timeframe">Days Per Timeframe</option>
              </select>
              {editedHabit.completionTarget.type !== 'every time' && (
                <>
                  <input
                    type="number"
                    className="bg-gray-800 text-white px-3 py-2 rounded w-16"
                    value={editedHabit.completionTarget.value}
                    onChange={(e) => setEditedHabit({...editedHabit, completionTarget: {...editedHabit.completionTarget, value: parseInt(e.target.value)}})}
                    min="1"
                    required
                  />
                  <select 
                    className="bg-gray-800 text-white px-3 py-2 rounded flex-grow"
                    value={editedHabit.completionTarget.timeframe}
                    onChange={(e) => setEditedHabit({...editedHabit, completionTarget: {...editedHabit.completionTarget, timeframe: e.target.value}})}
                  >
                    <option value="day">Day</option>
                    <option value="week">Week</option>
                    <option value="month">Month</option>
                  </select>
                </>
              )}
            </div>
          </div>

          {/* Time of Day */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-400 mb-1">TIME OF DAY</label>
            <select 
              className="bg-gray-800 text-white px-3 py-2 rounded w-full"
              value={editedHabit.timeOfDay[0]}
              onChange={(e) => setEditedHabit({...editedHabit, timeOfDay: [e.target.value]})}
            >
              <option value="any time">Any Time</option>
              <option value="morning">Morning</option>
              <option value="afternoon">Afternoon</option>
              <option value="evening">Evening</option>
              <option value="specific time">Specific Time</option>
            </select>
            {editedHabit.timeOfDay[0] === 'specific time' && (
              <input
                type="time"
                className="bg-gray-800 text-white px-3 py-2 rounded w-full mt-2"
                value={editedHabit.specificTime || ''}
                onChange={(e) => setEditedHabit({...editedHabit, specificTime: e.target.value})}
                required
              />
            )}
          </div>

          {/* Start Date */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-400 mb-1">START DATE</label>
            <div className="relative">
              <input
                type="date"
                className="bg-gray-800 text-white px-3 py-2 rounded w-full"
                value={editedHabit.startDate}
                onChange={(e) => setEditedHabit({...editedHabit, startDate: e.target.value})}
              />
              <Calendar className="absolute right-3 top-2 text-gray-400" size={20} />
            </div>
          </div>

          {/* End Date */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-400 mb-1">END DATE (Optional)</label>
            <div className="relative">
              <input
                type="date"
                className="bg-gray-800 text-white px-3 py-2 rounded w-full"
                value={editedHabit.endDate || ''}
                onChange={(e) => setEditedHabit({...editedHabit, endDate: e.target.value || null})}
              />
              <Calendar className="absolute right-3 top-2 text-gray-400" size={20} />
            </div>
          </div>

          {/* Area Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-400 mb-1">AREA</label>
            <select 
              className="bg-gray-800 text-white px-3 py-2 rounded w-full"
              value={editedHabit.areaId}
              onChange={(e) => setEditedHabit({...editedHabit, areaId: e.target.value || null})}
            >
              <option value="">All Habits</option>
              {areas.map(area => (
                <option key={area._id} value={area._id}>{area.name}</option>
              ))}
            </select>
          </div>

          {/* Form Buttons */}
          <div className="flex justify-end">
            <button 
              type="button"
              className="bg-gray-700 text-white px-4 py-2 rounded mr-2"
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditHabitModal;