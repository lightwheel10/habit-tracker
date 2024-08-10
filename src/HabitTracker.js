import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/habits/Header';
import HabitList from './components/habits/HabitList';
import RightPanel from './components/RightPanel';
import LogoutConfirmationModal from './components/LogoutConfirmationModal';
import LoginForm from './components/Login';
import AddHabitModal from './components/habits/AddHabitModal';
import {
  fetchHabits,
  createHabit,
  updateHabit,
  deleteHabit,
  logout,
  fetchAreas,
  createArea,
  updateArea,
  deleteArea,
  login,
} from './services/api';
import { debounce } from 'lodash';

const HabitTracker = ({ setUserType }) => {
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Header-specific state management
  const [showAddHabitModal, setShowAddHabitModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [sortBy, setSortBy] = useState('default');

  // Check for token on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  // Load data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  // Logging effects
  useEffect(() => {
    console.log("HabitTracker - areas updated:", areas);
  }, [areas]);

  useEffect(() => {
    console.log("HabitTracker - habits updated:", habits);
  }, [habits]);

  useEffect(() => {
    console.log("HabitTracker - selectedHabit changed:", selectedHabit);
  }, [selectedHabit]);

  useEffect(() => {
    console.log("HabitTracker - isRightPanelOpen changed:", isRightPanelOpen);
  }, [isRightPanelOpen]);

  // Load habits and areas data
  const loadData = async () => {
    if (!isAuthenticated) {
      console.log("Not authenticated, skipping data load");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const [fetchedHabits, fetchedAreas] = await Promise.all([fetchHabits(), fetchAreas()]);
      console.log("Fetched habits:", fetchedHabits);
      console.log("Fetched areas:", fetchedAreas);

      if (!Array.isArray(fetchedHabits) || !Array.isArray(fetchedAreas)) {
        throw new Error('Invalid data format received from server');
      }

      setHabits(fetchedHabits.filter(habit => habit && typeof habit === 'object'));
      setAreas(fetchedAreas.filter(area => area && typeof area === 'object'));
    } catch (error) {
      console.error('Error fetching data:', error);
      if (error.response && error.response.status === 401) {
        setIsAuthenticated(false);
        setError('Your session has expired. Please log in again.');
      } else {
        setError('Failed to load data. Please try again.');
      }
      setHabits([]);
      setAreas([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Add the filteredHabits logic
  const filteredHabits = useMemo(() => {
    console.log("Calculating filtered habits. Selected section:", selectedSection);
    const filtered = selectedSection === 'all'
      ? habits
      : habits.filter(habit => {
          console.log("Checking habit:", habit.name, "Area ID:", habit.areaId);
          return habit.areaId === selectedSection;
        });
    console.log("Filtered habits result:", filtered);
    return filtered;
  }, [selectedSection, habits]);

  // Handle adding a new area
  const handleAddArea = async (newArea) => {
    console.log("Adding new area:", newArea);
    if (!newArea.name || newArea.name.trim() === '') {
      setError("Area name cannot be empty");
      return;
    }
    try {
      const response = await createArea(newArea);
      console.log("Area added response:", response);

      if (!response || typeof response !== 'object' || !response._id) {
        throw new Error('Invalid response from server when creating area');
      }

      setAreas(prevAreas => {
        const updatedAreas = [...prevAreas, response];
        console.log("Updated areas:", updatedAreas);
        return updatedAreas;
      });
      setSelectedSection(response._id);
      // Force a re-render
      setTimeout(() => setAreas(prev => [...prev]), 0);
      return response;
    } catch (error) {
      console.error('Error adding area:', error);
      setError('Failed to add area. Please try again.');
    }
  };

  // Handle deleting an area
  const handleDeleteArea = async (areaId) => {
    console.log("Deleting area:", areaId);
    try {
      await deleteArea(areaId);
      setAreas(prevAreas => prevAreas.filter(area => area._id !== areaId));
      if (selectedSection === areaId) {
        setSelectedSection('all');
      }
      setHabits(prevHabits => prevHabits.filter(habit => habit.areaId !== areaId));
    } catch (error) {
      console.error('Error deleting area:', error);
      setError('Failed to delete area. Please try again.');
    }
  };

  // Handle editing an area with debouncing to reduce unnecessary API calls
  const debouncedEditArea = useCallback(
    debounce(async (areaId, newName) => {
      console.log("Editing area:", areaId, "New name:", newName);
      if (!newName || newName.trim() === '') {
        setError("Area name cannot be empty");
        return;
      }
      try {
        const updatedArea = await updateArea(areaId, { name: newName });
        if (!updatedArea || typeof updatedArea !== 'object' || !updatedArea._id) {
          throw new Error('Invalid response from server when updating area');
        }
        setAreas(prevAreas => prevAreas.map(area =>
          area._id === areaId ? updatedArea : area
        ));
      } catch (error) {
        console.error('Error updating area:', error);
        setError('Failed to update area. Please try again.');
      }
    }, 300),
    []
  );

  // Trigger the debounced edit area function
  const handleEditArea = (areaId, newName) => {
    debouncedEditArea(areaId, newName);
  };

  // Handle adding a new habit
  const handleAddHabit = async (newHabit) => {
    console.log("Adding new habit:", newHabit);
    try {
      const formattedHabit = {
        ...newHabit,
        goal: {
          value: newHabit.goal.value,
          unit: newHabit.goal.unit,
          timeframe: newHabit.goal.timeframe,
        },
        repeatPattern: {
          type: newHabit.repeatPattern.type,
          daysOfWeek: newHabit.repeatPattern.daysOfWeek,
          dayOfMonth: newHabit.repeatPattern.dayOfMonth,
          monthOfYear: newHabit.repeatPattern.monthOfYear,
        },
        completionTarget: {
          type: newHabit.completionTarget.type,
          value: newHabit.completionTarget.value,
          timeframe: newHabit.completionTarget.timeframe,
        },
        timeOfDay: newHabit.timeOfDay,
        specificTime: newHabit.specificTime,
        startDate: new Date(newHabit.startDate).toISOString(),
        endDate: newHabit.endDate ? new Date(newHabit.endDate).toISOString() : null,
        areaId: newHabit.areaId,
      };

      console.log("Formatted habit data:", formattedHabit);
      const addedHabit = await createHabit(formattedHabit);
      console.log("Habit added:", addedHabit);
      if (!addedHabit || typeof addedHabit !== 'object' || !addedHabit._id || !addedHabit.areaId) {
        throw new Error('Invalid response from server when creating habit');
      }
      setHabits(prevHabits => {
        const updatedHabits= [...prevHabits, addedHabit];
        console.log("Adding new habit to state:", updatedHabits);
        return updatedHabits;
      });
      setShowAddHabitModal(false); // Close the modal after adding
    } catch (error) {
      console.error('Error adding habit:', error);
      setError('Failed to add habit. Please try again.');
    }
  };

  useEffect(() => {
    console.log("Habits state updated:", habits);
  }, [habits]);

  // Handle editing an existing habit
  const handleEditHabit = async (editedHabit) => {
    console.log("Editing habit:", editedHabit);
    try {
      const formattedHabit = {
        ...editedHabit,
        goal: {
          value: editedHabit.goal.value,
          unit: editedHabit.goal.unit,
          timeframe: editedHabit.goal.timeframe,
        },
        repeatPattern: {
          type: editedHabit.repeatPattern.type,
          daysOfWeek: editedHabit.repeatPattern.daysOfWeek,
          dayOfMonth: editedHabit.repeatPattern.dayOfMonth,
          monthOfYear: editedHabit.repeatPattern.monthOfYear,
        },
        completionTarget: {
          type: editedHabit.completionTarget.type,
          value: editedHabit.completionTarget.value,
          timeframe: editedHabit.completionTarget.timeframe,
        },
        timeOfDay: editedHabit.timeOfDay,
        specificTime: editedHabit.specificTime,
        startDate: new Date(editedHabit.startDate).toISOString(),
        endDate: editedHabit.endDate ? new Date(editedHabit.endDate).toISOString() : null,
      };

      const updatedHabit = await updateHabit(formattedHabit._id, formattedHabit);
      console.log("Habit updated:", updatedHabit);
      if (!updatedHabit || typeof updatedHabit !== 'object' || !updatedHabit._id) {
        throw new Error('Invalid response from server when updating habit');
      }
      setHabits(prevHabits => {
        const updatedHabits = prevHabits.map(habit =>
          habit._id === updatedHabit._id ? updatedHabit : habit
        );
        console.log("Updated habits state:", updatedHabits);
        return updatedHabits;
      });
      
      if (selectedHabit && selectedHabit._id === updatedHabit._id) {
        setSelectedHabit(updatedHabit);
      }
    } catch (error) {
      console.error('Error updating habit:', error);
      setError('Failed to update habit. Please try again.');
    }
  };

  // Handle deleting a habit
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
    } catch (error) {
      console.error('Error deleting habit:', error);
      setError('Failed to delete habit. Please try again.');
    }
  };

  // Handle user logout
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
      setIsAuthenticated(false);
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
    } catch (error) {
      console.error('Error during logout:', error);
      setError('Failed to logout. Please try again.');
    } finally {
      setIsLogoutModalOpen(false);
    }
  };

  // Handle user login
  const handleLogin = async (credentials) => {
    try {
      const response = await login(credentials);
      if (response.accessToken && response.refreshToken) {
        setIsAuthenticated(true);
        await loadData();
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred during login. Please try again.');
    }
  };

  // Display loading spinner if data is still being fetched
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-200"></div>
    </div>;
  }

  // Display login form if not authenticated
  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} error={error} setIsAuthenticated={setIsAuthenticated} setUserType={setUserType} />;
  }

  // Display error message if there's an error
  if (error) {
    return <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
      <strong className="font-bold">Error:</strong>
      <span className="block sm:inline"> {error}</span>
    </div>;
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
        <div className="flex-1">
          <Header
            areas={areas}
            selectedSection={selectedSection}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            showCalendar={showCalendar}
            setShowCalendar={setShowCalendar}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            sortBy={sortBy}
            setSortBy={setSortBy}
            setShowAddHabit={setShowAddHabitModal}
          />
          <HabitList
            areas={areas}
            setAreas={setAreas}
            habits={filteredHabits}
            setHabits={setHabits}
            selectedSection={selectedSection}
            setSelectedHabit={setSelectedHabit}
            setIsRightPanelOpen={setIsRightPanelOpen}
            onAddHabit={handleAddHabit}
            onEditHabit={handleEditHabit}
            onDeleteHabit={handleDeleteHabit}
          />
        </div>
        {console.log("Habits passed to HabitList:", habits)}
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
          />
        )}
      </div>
      <LogoutConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={confirmLogout}
      />
      {showAddHabitModal && (
        <AddHabitModal
          areas={areas}
          onAddHabit={handleAddHabit}
          onClose={() => setShowAddHabitModal(false)}
        />
      )}
    </div>
  );
};

export default HabitTracker;
