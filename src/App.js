import React, { useState, useEffect } from 'react';
import ErrorBoundary from './ErrorBoundary';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import HabitTracker from './HabitTracker';
import PrefilledHabitTracker from './PrefilledHabitTracker';
import WelcomePage from './WelcomePage';
import Login from './components/Login';
import Signup from './components/Signup';
import { isLoggedIn } from './services/api';

function App() {
  const [userType, setUserType] = useState('new'); // 'new', 'returning', or 'demo'
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // UseEffect to load user type and authentication status on initial render
  useEffect(() => {
    try {
      const storedUserType = localStorage.getItem('userType');
      if (storedUserType) {
        setUserType(storedUserType);
      }
      setIsAuthenticated(isLoggedIn());
    } catch (error) {
      console.error("Error loading user type or authentication status:", error);
    }
  }, []);

  // Handle the Get Started action from the Welcome Page
  const handleGetStarted = () => {
    try {
      localStorage.setItem('userType', 'returning');
      setUserType('returning');
    } catch (error) {
      console.error("Error setting user type to 'returning':", error);
    }
  };

  // Handle the Demo Click action
  const handleDemoClick = () => {
    setUserType('demo');
  };

  return (
    <Router>
      <ErrorBoundary>
        <Routes>
          <Route 
            path="/" 
            element={<LandingPage />} 
          />
          <Route 
            path="/welcome" 
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
                : (isAuthenticated ? <HabitTracker setUserType={setUserType} /> : <Navigate to="/login" replace />)
            } 
          />
          <Route
          path="/login"
          element={
            isAuthenticated
            ? <Navigate to="/dashboard" replace />
            : (() => {
              console.log('setIsAuthenticated:', setIsAuthenticated);
              console.log('setUserType:', setUserType);
              return <Login setIsAuthenticated={setIsAuthenticated} setUserType={setUserType} />;
            })()
          }
        />

          <Route 
            path="/signup" 
            element={
              isAuthenticated 
                ? <Navigate to="/dashboard" replace /> 
                : <Signup setIsAuthenticated={setIsAuthenticated} setUserType={setUserType} />
            } 
          />
        </Routes>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
