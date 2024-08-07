import React, { useState, useRef, useEffect } from 'react';
import { Plus, Settings, BookOpen, LogOut, X } from 'lucide-react';

const Sidebar = ({ 
  areas, 
  setAreas, 
  habits = [], 
  selectedSection, 
  setSelectedSection,
  onAddArea, // Add this prop
  onLogout
}) => {
  // State for new area input
  const [newAreaInput, setNewAreaInput] = useState('');
  const [showNewAreaInput, setShowNewAreaInput] = useState(false);
  
  // State for resources dropdown
  const [showResourcesDropdown, setShowResourcesDropdown] = useState(false);
  
  // Refs for handling click outside
  const newAreaInputRef = useRef(null);
  const resourcesDropdownRef = useRef(null);

  // Effect for handling clicks outside of new area input and resources dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (newAreaInputRef.current && !newAreaInputRef.current.contains(event.target)) {
        setShowNewAreaInput(false);
      }
      if (resourcesDropdownRef.current && !resourcesDropdownRef.current.contains(event.target)) {
        setShowResourcesDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handler for adding a new area
  const handleNewArea = () => {
    console.log("handleNewArea called");
    if (newAreaInput.trim()) {
      console.log("Calling onAddArea with:", { name: newAreaInput.trim() });
      onAddArea({ name: newAreaInput.trim() });
      setNewAreaInput('');
      setShowNewAreaInput(false);
    }
  };

  // Handler for toggling resources dropdown
  const handleResourcesClick = () => {
    setShowResourcesDropdown(!showResourcesDropdown);
  };

  // Calculate total active habits
  const totalActiveHabits = habits.filter(habit => !habit.completed).length;

  return (
    <div className="w-64 bg-gray-800 p-4 flex flex-col h-screen">
      {/* User profile section */}
      <div className="flex items-center mb-6">
        <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center mr-2">
          P
        </div>
        <span className="font-semibold">Paras Tiwari</span>
      </div>

      {/* All Habits section */}
      <div 
        className={`mb-4 cursor-pointer hover:bg-gray-700 p-2 rounded ${selectedSection === 'all' ? 'bg-blue-600' : ''}`}
        onClick={() => setSelectedSection('all')}
      >
        <span className="font-semibold">All Habits ({totalActiveHabits})</span>
      </div>

      {/* Areas section */}
      <div className="mb-6 flex-grow">
        <h3 className="text-xs font-semibold text-gray-400 mb-2">AREAS</h3>
        {areas.map((area) => {
          const activeHabitsCount = habits.filter(habit => habit.areaId === area._id && !habit.completed).length;
          return (
            <div 
              key={area._id} 
              className={`flex items-center justify-between text-gray-300 mb-2 cursor-pointer hover:bg-gray-700 p-1 rounded ${selectedSection === area._id ? 'bg-gray-700' : ''}`}
              onClick={() => setSelectedSection(area._id)}
            >
              <span>{area.name}</span>
              <span className="text-sm text-gray-400">{activeHabitsCount}</span>
            </div>
          );
        })}
        {showNewAreaInput ? (
          <div className="flex items-center mb-2" ref={newAreaInputRef}>
            <input
              type="text"
              value={newAreaInput}
              onChange={(e) => setNewAreaInput(e.target.value)}
              className="bg-gray-700 text-white px-2 py-1 rounded mr-2 flex-grow"
              placeholder="New area name"
            />
            <button onClick={handleNewArea} className="text-green-500 mr-2">Add</button>
            <button onClick={() => setShowNewAreaInput(false)} className="text-red-500">
              <X size={16} />
            </button>
          </div>
        ) : (
          <div 
            className="flex items-center text-gray-400 cursor-pointer hover:bg-gray-700 p-1 rounded"
            onClick={() => setShowNewAreaInput(true)}
          >
            <Plus size={16} className="mr-2" />
            <span>New Area</span>
          </div>
        )}
      </div>

      {/* Preferences section */}
      <div className="mb-6">
        <h3 className="text-xs font-semibold text-gray-400 mb-2">PREFERENCES</h3>
        <div 
          className="flex items-center text-gray-300 mb-2 cursor-pointer hover:bg-gray-700 p-1 rounded"
        >
          <Settings size={16} className="mr-2" />
          <span>App Settings</span>
        </div>
        <div 
          className="flex items-center text-gray-300 cursor-pointer hover:bg-gray-700 p-1 rounded relative"
          onClick={handleResourcesClick}
          ref={resourcesDropdownRef}
        >
          <BookOpen size={16} className="mr-2" />
          <span>Resources</span>
          {showResourcesDropdown && (
            <div className="absolute left-full ml-2 bottom-0 bg-gray-700 rounded-md shadow-lg z-10 w-48">
              <a href="/contact" className="block px-4 py-2 text-sm text-white hover:bg-gray-600">Contact Us</a>
              <a href="/vote" className="block px-4 py-2 text-sm text-white hover:bg-gray-600">Vote on a Feature</a>
              <a href="/refer" className="block px-4 py-2 text-sm text-white hover:bg-gray-600">Refer a Friend</a>
            </div>
          )}
        </div>
      </div>

      {/* Logout button */}
      <div className="mt-auto">
        <button 
          className="flex items-center text-red-500 hover:bg-gray-700 p-1 rounded w-full"
          onClick={onLogout}
        >
          <LogOut size={16} className="mr-2" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;