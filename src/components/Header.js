import React from 'react';
import { Search, Calendar, Plus, SortAsc } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Header = ({
  areas,
  selectedSection,
  searchQuery,
  setSearchQuery,
  showCalendar,
  setShowCalendar,
  selectedDate,
  setSelectedDate,
  sortBy,
  setSortBy,
  setShowAddHabit
}) => {
  const currentArea = selectedSection === 'all'
    ? { name: 'All Habits' }
    : areas.find(area => area._id === selectedSection) || { name: 'All Habits' };

  return (
    <div className="bg-gray-800 p-4 border-b border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold text-white">{currentArea.name}</h1>
        <button
          onClick={() => setShowAddHabit(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={20} />
          <span>Add Habit</span>
        </button>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search habits..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-700 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="relative">
          <button
            onClick={() => setShowCalendar(!showCalendar)}
            className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Calendar size={18} />
            <span>{selectedDate.toLocaleDateString()}</span>
          </button>
          {showCalendar && (
            <div className="absolute right-0 mt-2 z-50">
              <DatePicker
                selected={selectedDate}
                onChange={(date) => {
                  setSelectedDate(date);
                  setShowCalendar(false);
                }}
                inline
                className="bg-gray-700"
              />
            </div>
          )}
        </div>

        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="appearance-none bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 pr-8 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="default">Default</option>
            <option value="name">Name</option>
            <option value="date">Date</option>
            <option value="completion">Completion</option>
          </select>
          <SortAsc className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
        </div>
      </div>
    </div>
  );
};

export default Header;
