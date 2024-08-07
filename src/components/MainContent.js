import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Plus, Search, Calendar, Check, SkipForward, MoreVertical, Edit, Trash2 } from 'lucide-react';
import AddHabitModal from './AddHabitModal';
import EditHabitModal from './EditHabitModal';
import CalendarComponent from './Calendar';
import EmptyState from './EmptyState';
import DebugInfo from './DebugInfo';
import { fetchHabits, createHabit, updateHabit, updateHabitLog, deleteHabit } from '../services/api';

// Helper functions
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

const getHabitStatusForDate = (habit, date) => {
  if (!habit || !habit.log) return 'pending';
  const logEntry = habit.log.find(entry => 
    new Date(entry.date).toDateString() === date.toDateString()
  );
  if (logEntry) {
    if (logEntry.completed) return 'completed';
    if (logEntry.skipped) return 'skipped';
    return 'failed';
  }
  return 'pending';
};

const MainContent = ({ 
  areas = [], 
  habits = [],
  setHabits,
  selectedSection, 
  setSelectedHabit, 
  setIsRightPanelOpen,
  onAddHabit,
  onEditHabit,
  onDeleteHabit,
}) => {
  console.log("MainContent rendered with habits:", habits);

  const [searchQuery, setSearchQuery] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);
  const [showAddHabit, setShowAddHabit] = useState(false);
  const [showEditHabit, setShowEditHabit] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [sortBy, setSortBy] = useState('default');
  const [openMenuId, setOpenMenuId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const calendarRef = useRef(null);

  useEffect(() => {
    console.log("MainContent useEffect - habits changed:", habits);
  }, [habits]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getHabitsForCurrentView = useCallback(() => {
    console.log("getHabitsForCurrentView called with selectedSection:", selectedSection);
    if (!habits || habits.length === 0) return [];
    if (selectedSection === 'all') {
      return habits;
    }
    return habits.filter(habit => habit.areaId === selectedSection);
  }, [habits, selectedSection]);

  const filteredHabits = getHabitsForCurrentView().filter(habit => {
    // Create new Date objects and reset to start of day
    const habitStartDate = new Date(habit.startDate);
    habitStartDate.setHours(0, 0, 0, 0);
    
    const selectedDateCopy = new Date(selectedDate);
    selectedDateCopy.setHours(0, 0, 0, 0);
  
    // If endDate exists, set it to end of the day
    let habitEndDate = null;
    if (habit.endDate) {
      habitEndDate = new Date(habit.endDate);
      habitEndDate.setHours(23, 59, 59, 999);
    }
  
    // Check if habit name matches search query
    const nameMatches = habit.name.toLowerCase().includes(searchQuery.toLowerCase());
  
    // Check if selected date is within habit's date range
    const isWithinDateRange = habitStartDate <= selectedDateCopy && 
                              (!habitEndDate || habitEndDate >= selectedDateCopy);
  
    return nameMatches && isWithinDateRange;
  });

  const successHabits = filteredHabits.filter(habit => getHabitStatusForDate(habit, selectedDate) === 'completed');
  const skippedHabits = filteredHabits.filter(habit => getHabitStatusForDate(habit, selectedDate) === 'skipped');
  const pendingHabits = filteredHabits.filter(habit => getHabitStatusForDate(habit, selectedDate) === 'pending');

  const sortedHabits = [...pendingHabits].sort((a, b) => {
    if (sortBy === 'timeOfDay') return a.timeOfDay[0].localeCompare(b.timeOfDay[0]);
    if (sortBy === 'alphabetical') return a.name.localeCompare(b.name);
    return 0;
  });

  const showEmptyState = filteredHabits.length === 0;

  const handleAddHabit = async (newHabit) => {
    console.log("handleAddHabit called with:", newHabit);
    try {
      const habitToCreate = {
        ...newHabit,
        log: [],
        areaId: newHabit.areaId || 'defaultAreaId'
      };
      await onAddHabit(habitToCreate);  // Use the prop function
      console.log("Habit created successfully");
      setShowAddHabit(false);
    } catch (error) {
      console.error('Error creating habit:', error);
      setError('Failed to add habit. Please try again.');
      if (error.response && error.response.status === 401) {
        console.log("Unauthorized error, redirecting to login");
        window.location.href = '/login';
      }
    }
  };

  const handleEditHabit = (habit) => {
    console.log("handleEditHabit called with:", habit);
    setEditingHabit(habit);
    setShowEditHabit(true);
    setOpenMenuId(null);
  };

  const handleSaveEdit = async (editedHabit) => {
    console.log("handleSaveEdit called with:", editedHabit);
    try {
      const updatedHabit = await updateHabit(editedHabit._id, editedHabit);
      console.log("Habit updated:", updatedHabit);
      setHabits(prevHabits => prevHabits.map(habit => 
        habit._id === updatedHabit._id ? updatedHabit : habit
      ));
      setShowEditHabit(false);
      setEditingHabit(null);
      setSelectedHabit(current => current && current._id === updatedHabit._id ? updatedHabit : current);
    } catch (error) {
      console.error('Error updating habit:', error);
      console.error('Error details:', error.response ? error.response.data : error.message);
      setError('Failed to update habit. Please try again.');
      if (error.response && error.response.status === 401) {
        console.log("Unauthorized error, redirecting to login");
        window.location.href = '/login';
      }
    }
  };

  const handleDeleteHabit = async (habitId) => {
    console.log("handleDeleteHabit called with:", habitId);
    try {
      await deleteHabit(habitId);
      console.log("Habit deleted:", habitId);
      setHabits(prevHabits => prevHabits.filter(habit => habit._id !== habitId));
      setOpenMenuId(null);
      setSelectedHabit(current => current && current._id === habitId ? null : current);
      setIsRightPanelOpen(current => current && current._id === habitId ? false : current);
    } catch (error) {
      console.error('Error deleting habit:', error);
      setError('Failed to delete habit. Please try again.');
      if (error.response && error.response.status === 401) {
        console.log("Unauthorized error, redirecting to login");
        window.location.href = '/login';
      }
    }
  };

  const handleHabitAction = async (habitId, action, e) => {
    console.log("handleHabitAction called with:", habitId, action);
    e.stopPropagation();
    try {
      const updatedHabit = await updateHabitLog(habitId, {
        date: selectedDate.toISOString(),
        completed: action === 'done',
        skipped: action === 'skip'
      });
      console.log("Habit log updated:", updatedHabit);
      setHabits(prevHabits => prevHabits.map(habit => 
        habit._id === habitId ? updatedHabit : habit
      ));
      setSelectedHabit(current => current && current._id === habitId ? updatedHabit : current);
    } catch (error) {
      console.error('Error updating habit log:', error);
      setError('Failed to update habit. Please try again.');
      if (error.response && error.response.status === 401) {
        console.log("Unauthorized error, redirecting to login");
        window.location.href = '/login';
      }
    }
  };

  const handleHabitClick = (habit) => {
    console.log("handleHabitClick called with habit:", habit);
    setSelectedHabit(habit);
    setIsRightPanelOpen(true);
    setTimeout(() => {
      console.log("After state updates - selectedHabit:", habit);
      console.log("After state updates - isRightPanelOpen:", true);
    }, 0);
  };

  if (isLoading) return <div>Loading habits...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="flex-1 p-6 flex flex-col">
      {/* Header section */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">
          {selectedSection === 'all' ? 'All Habits' : areas.find(area => area.id === selectedSection)?.name || 'Unknown Area'}
        </h2>
        <div className="flex items-center space-x-2">
          {/* Search input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search habits"
              className="bg-gray-800 text-white px-4 py-2 rounded-full w-64 pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
          {/* Calendar button */}
          <div className="relative" ref={calendarRef}>
            <button 
              className="bg-gray-800 p-2 rounded-full"
              onClick={() => setShowCalendar(!showCalendar)}
            >
              <Calendar size={18} />
            </button>
            {showCalendar && (
              <div className="absolute right-0 mt-2 z-10">
                <CalendarComponent 
                  selectedDate={selectedDate}
                  setSelectedDate={setSelectedDate}
                  setShowCalendar={setShowCalendar}
                />
              </div>
            )}
          </div>
          {/* Sort dropdown */}
          <select 
            className="bg-gray-800 text-white px-4 py-2 rounded-full"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="default">Default View</option>
            <option value="timeOfDay">Time of Day</option>
            <option value="alphabetical">Alphabetical</option>
          </select>
          {/* Add Habit button */}
          <button 
            className="bg-blue-600 text-white px-4 py-2 rounded-full flex items-center"
            onClick={() => setShowAddHabit(true)}
          >
            <Plus size={18} className="mr-2" /> Add Habit
          </button>
        </div>
      </div>

      {/* Main content */}
      {showEmptyState ? (
        <EmptyState onAddHabit={() => setShowAddHabit(true)} />
      ) : (
        <>
          {/* Habits to complete */}
          {sortedHabits.length > 0 && (
            <div className="space-y-2 flex-grow">
              <h3 className="text-xl font-bold mb-4">Pending ({sortedHabits.length})</h3>
              {console.log("Rendering sortedHabits:", sortedHabits)}
              {sortedHabits.map((habit) => (
                <div 
                  key={habit._id} 
                  className="bg-gray-800 p-4 rounded flex flex-col cursor-pointer"
                  onClick={() => handleHabitClick(habit)}
                >
                  {console.log("Rendering habit:", habit.name)}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {habit.emoji && <span className="mr-2">{habit.emoji}</span>}
                      <span className="text-lg font-semibold">{habit.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        className="bg-green-500 text-white px-3 py-1 rounded flex items-center"
                        onClick={(e) => handleHabitAction(habit._id, 'done', e)}
                      >
                        <Check size={16} className="mr-1" /> Done
                      </button>
                      <button
                        className="bg-yellow-500 text-white px-3 py-1 rounded flex items-center"
                        onClick={(e) => handleHabitAction(habit._id, 'skip', e)}
                      >
                        <SkipForward size={16} className="mr-1" /> Skip
                      </button>
                      <div className="relative">
                        <button 
                          className="text-gray-400"
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId(openMenuId === habit._id ? null : habit._id);
                          }}
                        >
                          <MoreVertical size={18} />
                        </button>
                        {openMenuId === habit._id && (
                          <div className="absolute right-0 mt-2 w-48 bg-gray-700 rounded-md shadow-lg z-10">
                            <button 
                              className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-600"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditHabit(habit);
                              }}
                            >
                              <Edit size={14} className="inline mr-2" /> Edit
                            </button>
                            <button 
                              className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-600"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteHabit(habit._id);
                              }}
                            >
                              <Trash2 size={14} className="inline mr-2" /> Delete
                            </button>
                          </div>
                        )}
                      </div>
                      </div>
                  </div>
                  <span className="text-sm text-gray-400 mt-1">{habit.timeOfDay[0]}</span>
                  <span className="text-sm mt-1">
                    Status: {getHabitStatusForDate(habit, selectedDate).charAt(0).toUpperCase() + getHabitStatusForDate(habit, selectedDate).slice(1)}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Completed habits */}
          {successHabits.length > 0 && (
            <div className="mt-8">
              <h3 className="text-xl font-bold mb-4">Completed ({successHabits.length})</h3>
              <div className="space-y-2">
                {successHabits.map((habit) => (
                  <div 
                    key={habit._id} 
                    className="bg-gray-800 p-4 rounded flex items-center justify-between cursor-pointer"
                    onClick={() => handleHabitClick(habit)}
                  >
                    <div className="flex items-center">
                      {habit.emoji && <span className="mr-2">{habit.emoji}</span>}
                      <span>{habit.name}</span>
                    </div>
                    <span>Times Completed: {habit.log?.filter(entry => entry.completed).length || 0}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skipped habits */}
          {skippedHabits.length > 0 && (
            <div className="mt-8">
              <h3 className="text-xl font-bold mb-4">Skipped ({skippedHabits.length})</h3>
              <div className="space-y-2">
                {skippedHabits.map((habit) => (
                  <div 
                    key={habit._id} 
                    className="bg-gray-800 p-4 rounded flex items-center justify-between cursor-pointer"
                    onClick={() => handleHabitClick(habit)}
                  >
                    <div className="flex items-center">
                      {habit.emoji && <span className="mr-2">{habit.emoji}</span>}
                      <span>{habit.name}</span>
                    </div>
                    <span>Times Skipped: {habit.log?.filter(entry => entry.skipped).length || 0}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
      
      {/* Modals */}
      {showAddHabit && (
        <AddHabitModal 
          areas={areas}
          onAddHabit={handleAddHabit}
          onClose={() => {
            console.log("Closing Add Habit Modal");
            setShowAddHabit(false);
          }}
        />
      )}

      {showEditHabit && (
        <EditHabitModal 
          habit={editingHabit}
          areas={areas}
          onSaveEdit={handleSaveEdit}
          onClose={() => {
            console.log("Closing Edit Habit Modal");
            setShowEditHabit(false);
          }}
        />
      )}

      {/* Debug information */}
      <DebugInfo 
        habits={habits}
        selectedSection={selectedSection}
        sortBy={sortBy}
        getHabitsForCurrentView={getHabitsForCurrentView}
      />
    </div>
  );
};

export default MainContent;