import React, { useState } from 'react';
import { MoreVertical, Check, Edit, Trash2 } from 'lucide-react';

const HabitList = ({ habits, setAreas, setSelectedHabit, setIsRightPanelOpen }) => {
  const [editingHabit, setEditingHabit] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);

  const handleComplete = (habitId) => {
    setAreas(prevAreas => prevAreas.map(area => ({
      ...area,
      habits: area.habits.map(habit => 
        habit.id === habitId ? { ...habit, completed: !habit.completed } : habit
      )
    })));
  };

  const handleEditHabit = (habit) => {
    setEditingHabit({...habit});
    setOpenMenuId(null);
  };

  const handleSaveEdit = () => {
    if (editingHabit) {
      setAreas(prevAreas => prevAreas.map(area => ({
        ...area,
        habits: area.habits.map(habit => 
          habit.id === editingHabit.id ? editingHabit : habit
        )
      })));
      setEditingHabit(null);
    }
  };

  const handleDeleteHabit = (habitId) => {
    setAreas(prevAreas => prevAreas.map(area => ({
      ...area,
      habits: area.habits.filter(habit => habit.id !== habitId)
    })));
    setOpenMenuId(null);
  };

  const activeHabits = habits.filter(habit => !habit.completed);
  const archivedHabits = habits.filter(habit => habit.completed);

  const renderHabit = (habit, isArchived = false) => (
    <div 
      key={habit.id} 
      className={`bg-gray-800 p-4 rounded flex items-center justify-between cursor-pointer ${isArchived ? 'opacity-50' : ''}`}
      onClick={() => {
        setSelectedHabit(habit);
        setIsRightPanelOpen(true);
      }}
    >
      <div className="flex items-center">
        <button 
          className={`mr-4 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
            isArchived ? 'bg-green-500 border-green-500' : 'border-gray-400'
          }`}
          onClick={(e) => {
            e.stopPropagation();
            handleComplete(habit.id);
          }}
        >
          {isArchived && <Check size={16} className="text-white" />}
        </button>
        {editingHabit && editingHabit.id === habit.id ? (
          <input
            type="text"
            value={editingHabit.name}
            onChange={(e) => setEditingHabit({...editingHabit, name: e.target.value})}
            onClick={(e) => e.stopPropagation()}
            className="bg-gray-700 text-white px-2 py-1 rounded"
          />
        ) : (
          <span>{habit.name}</span>
        )}
      </div>
      <div className="flex items-center">
        <span className="text-gray-400 mr-4">{habit.timeOfDay}</span>
        <div className="relative">
          <button 
            className="text-gray-400"
            onClick={(e) => {
              e.stopPropagation();
              setOpenMenuId(openMenuId === habit.id ? null : habit.id);
            }}
          >
            <MoreVertical size={18} />
          </button>
          {openMenuId === habit.id && (
            <div className="absolute right-0 mt-2 w-48 bg-gray-700 rounded-md shadow-lg z-10">
              {!isArchived && (
                editingHabit && editingHabit.id === habit.id ? (
                  <button 
                    className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSaveEdit();
                    }}
                  >
                    Save
                  </button>
                ) : (
                  <button 
                    className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditHabit(habit);
                    }}
                  >
                    <Edit size={14} className="inline mr-2" /> Edit
                  </button>
                )
              )}
              <button 
                className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-600"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteHabit(habit.id);
                }}
              >
                <Trash2 size={14} className="inline mr-2" /> Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="space-y-2">
        {activeHabits.map(habit => renderHabit(habit))}
      </div>
      {archivedHabits.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4">Archived Habits</h3>
          <div className="space-y-2">
            {archivedHabits.map(habit => renderHabit(habit, true))}
          </div>
        </div>
      )}
    </>
  );
};

export default HabitList;