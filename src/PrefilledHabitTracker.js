import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import RightPanel from './components/RightPanel';

const HabitTracker = () => {
  const [areas, setAreas] = useState([
    { id: 'physical', name: 'Physical Health', habits: [
      { id: 1, name: 'Go to gym', completed: false, goal: 1, goalType: 'Times', repeat: 'Per Day', frequency: 'Daily', timeOfDay: 'Morning', startDate: '2024-08-01', reminders: [], streak: 1, completeDays: 1, failedDays: 0, skippedDays: 0, totalDays: 1 },
      { id: 2, name: 'Drink water', completed: false, goal: 8, goalType: 'Times', repeat: 'Per Day', frequency: 'Daily', timeOfDay: 'Any Time', startDate: '2024-08-01', reminders: [], streak: 2, completeDays: 2, failedDays: 0, skippedDays: 0, totalDays: 2 },
    ]},
    { id: 'mental', name: 'Mental Health', habits: [
      { id: 3, name: 'Meditate', completed: false, goal: 15, goalType: 'Minutes', repeat: 'Per Day', frequency: 'Daily', timeOfDay: 'Morning', startDate: '2024-08-01', reminders: [], streak: 3, completeDays: 3, failedDays: 0, skippedDays: 0, totalDays: 3 },
      { id: 4, name: 'Read a book', completed: false, goal: 30, goalType: 'Minutes', repeat: 'Per Day', frequency: 'Daily', timeOfDay: 'Evening', startDate: '2024-08-02', reminders: [], streak: 1, completeDays: 1, failedDays: 0, skippedDays: 0, totalDays: 1 },
    ]},
  ]);
  const [selectedSection, setSelectedSection] = useState('all');
  const [selectedHabit, setSelectedHabit] = useState(null);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);

  return (
    <div className="bg-gray-900 text-white min-h-screen flex">
      <Sidebar 
        areas={areas} 
        setAreas={setAreas}
        selectedSection={selectedSection}
        setSelectedSection={setSelectedSection}
      />
      <MainContent 
        areas={areas}
        setAreas={setAreas}
        selectedSection={selectedSection}
        setSelectedHabit={setSelectedHabit}
        setIsRightPanelOpen={setIsRightPanelOpen}
      />
      {isRightPanelOpen && selectedHabit && (
        <RightPanel 
          habit={selectedHabit} 
          onClose={() => {
            setIsRightPanelOpen(false);
            setSelectedHabit(null);
          }} 
        />
      )}
    </div>
  );
};

export default HabitTracker;