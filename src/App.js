import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import HabitTracker from './HabitTracker';
import PrefilledHabitTracker from './PrefilledHabitTracker';
import WelcomePage from './WelcomePage';
import Login from './components/Login';
import Signup from './components/Signup';

function App() {
  const [userType, setUserType] = useState('new'); // 'new', 'returning', or 'demo'
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const storedUserType = localStorage.getItem('userType');
    const token = localStorage.getItem('token');
    if (storedUserType) {
      setUserType(storedUserType);
    }
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleGetStarted = () => {
    localStorage.setItem('userType', 'returning');
    setUserType('returning');
  };

  const handleDemoClick = () => {
    setUserType('demo');
  };

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={
            userType === 'new' 
              ? <WelcomePage onGetStarted={handleGetStarted} onDemoClick={handleDemoClick} /> 
              : <Navigate to="/dashboard" replace />
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            userType === 'demo' 
              ? <PrefilledHabitTracker /> 
              : (isLoggedIn ? <HabitTracker /> : <Navigate to="/login" replace />)
          } 
        />
        <Route 
          path="/login" 
          element={
            isLoggedIn 
              ? <Navigate to="/dashboard" replace /> 
              : <Login setIsLoggedIn={setIsLoggedIn} setUserType={setUserType} />
          } 
        />
        <Route 
          path="/signup" 
          element={
            isLoggedIn 
              ? <Navigate to="/dashboard" replace /> 
              : <Signup setIsLoggedIn={setIsLoggedIn} setUserType={setUserType} />
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;