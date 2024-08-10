import React, { useState } from 'react';
import { X, Calendar, Smile } from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const AddHabitModal = ({ areas, onAddHabit, onClose }) => {
  const [newHabit, setNewHabit] = useState({
    name: '',
    emoji: '',
    goal: {
      value: 1,
      unit: 'times',
      timeframe: 'per day'
    },
    repeatPattern: {
      type: 'daily',
      daysOfWeek: [],
      dayOfMonth: 1,
      monthOfYear: 1
    },
    completionTarget: {
      type: 'every time',
      value: 1,
      timeframe: 'day'
    },
    timeOfDay: ['any time'],
    specificTime: null,
    startDate: new Date(),
    endDate: null,
    areaId: ''
  });
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleEmojiClick = (emojiObject) => {
    setNewHabit({ ...newHabit, emoji: emojiObject.emoji });
    setShowEmojiPicker(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newHabit.areaId) {
      alert("Please select an area for the habit.");
      return;
    }
    try {
      onAddHabit(newHabit);
    } catch (error) {
      console.error('Error adding new habit:', error);
      alert('Failed to add habit. Please try again.');
    }
  };

  const handleStartDateChange = (date) => {
    setNewHabit({ ...newHabit, startDate: date });
  };

  const handleEndDateChange = (date) => {
    setNewHabit({ ...newHabit, endDate: date });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 p-6 rounded-lg w-120 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white">Add New Habit</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="habitName" className="block text-sm font-medium text-gray-400 mb-1">NAME</label>
            <div className="flex items-center">
              <button
                type="button"
                className="bg-gray-800 text-white px-3 py-2 rounded-l"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              >
                {newHabit.emoji || <Smile size={20} />}
              </button>
              <input
                id="habitName"
                type="text"
                className="bg-gray-800 text-white px-3 py-2 rounded-r flex-grow"
                value={newHabit.name}
                onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
                required
              />
            </div>
            {showEmojiPicker && (
              <div className="absolute mt-2 z-10">
                <EmojiPicker onEmojiClick={handleEmojiClick} />
              </div>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="goalValue" className="block text-sm font-medium text-gray-400 mb-1">GOAL</label>
            <div className="flex space-x-2">
              <input
                id="goalValue"
                type="number"
                className="bg-gray-800 text-white px-3 py-2 rounded w-16"
                value={newHabit.goal.value}
                onChange={(e) => setNewHabit({ ...newHabit, goal: { ...newHabit.goal, value: parseInt(e.target.value) } })}
                min="1"
                required
              />
              <select
                id="goalUnit"
                className="bg-gray-800 text-white px-3 py-2 rounded flex-grow"
                value={newHabit.goal.unit}
                onChange={(e) => setNewHabit({ ...newHabit, goal: { ...newHabit.goal, unit: e.target.value } })}
              >
                <option value="times">Times</option>
                <option value="minutes">Minutes</option>
                <option value="hours">Hours</option>
              </select>
              <select
                id="goalTimeframe"
                className="bg-gray-800 text-white px-3 py-2 rounded flex-grow"
                value={newHabit.goal.timeframe}
                onChange={(e) => setNewHabit({ ...newHabit, goal: { ...newHabit.goal, timeframe: e.target.value } })}
              >
                <option value="total">Total</option>
                <option value="per day">Per Day</option>
                <option value="per week">Per Week</option>
                <option value="per month">Per Month</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="repeatPattern" className="block text-sm font-medium text-gray-400 mb-1">REPEAT PATTERN</label>
            <select
              id="repeatPattern"
              className="bg-gray-800 text-white px-3 py-2 rounded w-full"
              value={newHabit.repeatPattern.type}
              onChange={(e) => setNewHabit({ ...newHabit, repeatPattern: { ...newHabit.repeatPattern, type: e.target.value } })}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="completionTarget" className="block text-sm font-medium text-gray-400 mb-1">COMPLETION TARGET</label>
            <div className="flex space-x-2">
              <select
                id="completionTarget"
                className="bg-gray-800 text-white px-3 py-2 rounded flex-grow"
                value={newHabit.completionTarget.type}
                onChange={(e) => setNewHabit({ ...newHabit, completionTarget: { ...newHabit.completionTarget, type: e.target.value } })}
              >
                <option value="every time">Every Time</option>
                <option value="times per timeframe">Times Per Timeframe</option>
                <option value="days per timeframe">Days Per Timeframe</option>
              </select>
              {newHabit.completionTarget.type !== 'every time' && (
                <>
                  <input
                    id="completionTargetValue"
                    type="number"
                    className="bg-gray-800 text-white px-3 py-2 rounded w-16"
                    value={newHabit.completionTarget.value}
                    onChange={(e) => setNewHabit({ ...newHabit, completionTarget: { ...newHabit.completionTarget, value: parseInt(e.target.value) } })}
                    min="1"
                    required
                  />
                  <select
                    id="completionTargetTimeframe"
                    className="bg-gray-800 text-white px-3 py-2 rounded flex-grow"
                    value={newHabit.completionTarget.timeframe}
                    onChange={(e) => setNewHabit({ ...newHabit, completionTarget: { ...newHabit.completionTarget, timeframe: e.target.value } })}
                  >
                    <option value="day">Day</option>
                    <option value="week">Week</option>
                    <option value="month">Month</option>
                  </select>
                </>
              )}
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="timeOfDay" className="block text-sm font-medium text-gray-400 mb-1">TIME OF DAY</label>
            <select
              id="timeOfDay"
              className="bg-gray-800 text-white px-3 py-2 rounded w-full"
              value={newHabit.timeOfDay[0]}
              onChange={(e) => setNewHabit({ ...newHabit, timeOfDay: [e.target.value] })}
            >
              <option value="any time">Any Time</option>
              <option value="morning">Morning</option>
              <option value="afternoon">Afternoon</option>
              <option value="evening">Evening</option>
              <option value="specific time">Specific Time</option>
            </select>
            {newHabit.timeOfDay[0] === 'specific time' && (
              <input
                id="specificTime"
                type="time"
                className="bg-gray-800 text-white px-3 py-2 rounded w-full mt-2"
                value={newHabit.specificTime || ''}
                onChange={(e) => setNewHabit({ ...newHabit, specificTime: e.target.value })}
                required
              />
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-400 mb-1">START DATE</label>
            <div className="relative">
              <DatePicker
                id="startDate"
                selected={newHabit.startDate}
                onChange={handleStartDateChange}
                className="bg-gray-800 text-white px-3 py-2 rounded w-full"
                dateFormat="dd-MM-yyyy"
              />
              <Calendar className="absolute right-3 top-2 text-gray-400" size={20} />
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-400 mb-1">END DATE (Optional)</label>
            <div className="relative">
              <DatePicker
                id="endDate"
                selected={newHabit.endDate}
                onChange={handleEndDateChange}
                className="bg-gray-800 text-white px-3 py-2 rounded w-full"
                dateFormat="dd-MM-yyyy"
                isClearable
                placeholderText="Select end date"
              />
              <Calendar className="absolute right-3 top-2 text-gray-400" size={20} />
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="area" className="block text-sm font-medium text-gray-400 mb-1">AREA</label>
            <select
              id="area"
              className="bg-gray-800 text-white px-3 py-2 rounded w-full"
              value={newHabit.areaId}
              onChange={(e) => setNewHabit({ ...newHabit, areaId: e.target.value })}
              required
            >
              <option value="">All Habits</option>
              {areas.map(area => (
                <option key={area._id} value={area._id}>{area.name}</option>
              ))}
            </select>
          </div>

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
              Add Habit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddHabitModal;
