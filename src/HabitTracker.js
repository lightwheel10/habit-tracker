import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import RightPanel from './components/RightPanel';
import LogoutConfirmationModal from './LogoutConfirmationModal';
import { 
  fetchHabits, 
  createHabit, 
  updateHabit, 
  deleteHabit, 
  logout,
  fetchAreas,
  createArea,
  updateArea,
  deleteArea
} from './services/api';

const HabitTracker = () => {
  console.log("HabitTracker component rendered");

  // State management
  const [areas, setAreas] = useState([]);
  const [selectedSection, setSelectedSection] = useState('all');
  const [selectedHabit, setSelectedHabit] = useState(null);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);
  const [habits, setHabits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // Logging state changes
  useEffect(() => {
    console.log("HabitTracker - selectedHabit changed:", selectedHabit);
  }, [selectedHabit]);

  useEffect(() => {
    console.log("HabitTracker - isRightPanelOpen changed:", isRightPanelOpen);
  }, [isRightPanelOpen]);

  // Fetch habits and areas from API
  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [fetchedHabits, fetchedAreas] = await Promise.all([fetchHabits(), fetchAreas()]);
      console.log("Fetched habits:", fetchedHabits);
      console.log("Fetched areas:", fetchedAreas);
      setHabits(fetchedHabits);
      setAreas(fetchedAreas);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Area management functions
  const handleAddArea = async (newArea) => {
    console.log("Adding new area:", newArea);
    try {
      const addedArea = await createArea(newArea);
      setAreas(prevAreas => [...prevAreas, addedArea]);
    } catch (error) {
      console.error('Error adding area:', error);
      setError('Failed to add area. Please try again.');
    }
  };

  const handleDeleteArea = async (areaId) => {
    console.log("Deleting area:", areaId);
    try {
      await deleteArea(areaId);
      setAreas(prevAreas => prevAreas.filter(area => area._id !== areaId));
      if (selectedSection === areaId) {
        setSelectedSection('all');
      }
      // Refresh habits after area deletion
      await loadData();
    } catch (error) {
      console.error('Error deleting area:', error);
      setError('Failed to delete area. Please try again.');
    }
  };

  const handleEditArea = async (areaId, newName) => {
    console.log("Editing area:", areaId, "New name:", newName);
    try {
      const updatedArea = await updateArea(areaId, { name: newName });
      setAreas(prevAreas => prevAreas.map(area => 
        area._id === areaId ? updatedArea : area
      ));
    } catch (error) {
      console.error('Error updating area:', error);
      setError('Failed to update area. Please try again.');
    }
  };

  // Habit management functions
  const handleAddHabit = async (newHabit) => {
    console.log("Adding new habit:", newHabit);
    try {
      // Ensure the new habit structure is properly formatted
      const formattedHabit = {
        ...newHabit,
        goal: {
          value: newHabit.goal.value,
          unit: newHabit.goal.unit,
          timeframe: newHabit.goal.timeframe
        },
        repeatPattern: {
          type: newHabit.repeatPattern.type,
          daysOfWeek: newHabit.repeatPattern.daysOfWeek,
          dayOfMonth: newHabit.repeatPattern.dayOfMonth,
          monthOfYear: newHabit.repeatPattern.monthOfYear
        },
        completionTarget: {
          type: newHabit.completionTarget.type,
          value: newHabit.completionTarget.value,
          timeframe: newHabit.completionTarget.timeframe
        },
        timeOfDay: newHabit.timeOfDay,
        specificTime: newHabit.specificTime,
        startDate: new Date(newHabit.startDate).toISOString(),
        endDate: newHabit.endDate ? new Date(newHabit.endDate).toISOString() : null
      };

      const addedHabit = await createHabit(formattedHabit);
      console.log("Habit added:", addedHabit);
      setHabits(prevHabits => [...prevHabits, addedHabit]);
      
      // Refetch areas to get updated habit counts
      await loadData();
    } catch (error) {
      console.error('Error adding habit:', error);
      setError('Failed to add habit. Please try again.');
    }
  };

  const handleEditHabit = async (editedHabit) => {
    console.log("Editing habit:", editedHabit);
    try {
      // Ensure the edited habit structure is properly formatted
      const formattedHabit = {
        ...editedHabit,
        goal: {
          value: editedHabit.goal.value,
          unit: editedHabit.goal.unit,
          timeframe: editedHabit.goal.timeframe
        },
        repeatPattern: {
          type: editedHabit.repeatPattern.type,
          daysOfWeek: editedHabit.repeatPattern.daysOfWeek,
          dayOfMonth: editedHabit.repeatPattern.dayOfMonth,
          monthOfYear: editedHabit.repeatPattern.monthOfYear
        },
        completionTarget: {
          type: editedHabit.completionTarget.type,
          value: editedHabit.completionTarget.value,
          timeframe: editedHabit.completionTarget.timeframe
        },
        timeOfDay: editedHabit.timeOfDay,
        specificTime: editedHabit.specificTime,
        startDate: new Date(editedHabit.startDate).toISOString(),
        endDate: editedHabit.endDate ? new Date(editedHabit.endDate).toISOString() : null
      };
  
      const updatedHabit = await updateHabit(formattedHabit._id, formattedHabit);
      console.log("Habit updated:", updatedHabit);
      setHabits(prevHabits => prevHabits.map(habit => 
        habit._id === updatedHabit._id ? updatedHabit : habit
      ));
      if (selectedHabit && selectedHabit._id === updatedHabit._id) {
        setSelectedHabit(updatedHabit);
      }
      
      // Refetch areas to get updated habit counts
      await loadData();
    } catch (error) {
      console.error('Error updating habit:', error);
      setError('Failed to update habit. Please try again.');
    }
  };

  const handleDeleteHabit = async (habitId) => {
    console.log("Deleting habit:", habitId);
    try {
      await deleteHabit(habitId);
      console.log("Habit deleted:", habitId);
      setHabits(prevHabits => prevHabits.filter(habit => habit._id !== habitId));
      if (selectedHabit && selectedHabit._id === habitId) {
        setIsRightPanelOpen(false);
        setSelectedHabit(null);
      }
      
      // Refetch areas to get updated habit counts
      await loadData();
    } catch (error) {
      console.error('Error deleting habit:', error);
      setError('Failed to delete habit. Please try again.');
    }
  };

  // Logout handlers
  const handleLogout = () => {
    console.log("Logout initiated");
    setIsLogoutModalOpen(true);
  };

  const confirmLogout = async () => {
    console.log("Logout confirmed");
    try {
      await logout();
      // Clear all local state
      setIsRightPanelOpen(false);
      setSelectedHabit(null);
      setHabits([]);
      setAreas([]);
      // Redirect to login page
      window.location.href = '/login';
    } catch (error) {
      console.error('Error during logout:', error);
      setError('Failed to logout. Please try again.');
    }
  };

  if (isLoading) {
    return <div>Loading habits and areas...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  console.log("Before render - isRightPanelOpen:", isRightPanelOpen, "selectedHabit:", selectedHabit);

  return (
    <div className="bg-gray-900 text-white min-h-screen flex relative overflow-hidden">
      <Sidebar 
        areas={areas}
        setAreas={setAreas}
        habits={habits}
        selectedSection={selectedSection}
        setSelectedSection={setSelectedSection}
        onAddArea={handleAddArea}
        onDeleteArea={handleDeleteArea}
        onEditArea={handleEditArea}
        onLogout={handleLogout}
      />
      <div className="flex-1 flex">
        <MainContent 
          areas={areas}
          habits={selectedSection === 'all' 
            ? habits 
            : habits.filter(habit => habit.areaId === selectedSection)}
          setHabits={setHabits}
          selectedSection={selectedSection}
          setSelectedHabit={setSelectedHabit}
          setIsRightPanelOpen={setIsRightPanelOpen}
          onAddHabit={handleAddHabit}
          onEditHabit={handleEditHabit}
          onDeleteHabit={handleDeleteHabit}
        />
        {console.log("Habits passed to MainContent:", habits)}
        {console.log("Before RightPanel render check - isRightPanelOpen:", isRightPanelOpen, "selectedHabit:", selectedHabit)}
        {isRightPanelOpen && selectedHabit && (
          <RightPanel 
            habit={selectedHabit}
            onClose={() => {
              console.log("RightPanel onClose called");
              setIsRightPanelOpen(false);
              setSelectedHabit(null);
            }}
            onEdit={handleEditHabit}
            habitCount={habits.length}
            areaHabitCount={habits.filter(h => h.areaId === selectedHabit.areaId).length}
          />
        )}
      </div>
      <LogoutConfirmationModal 
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={confirmLogout}
      />
    </div>
  );
};

export default HabitTracker;