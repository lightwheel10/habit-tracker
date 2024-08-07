import React from 'react';
import { useNavigate } from 'react-router-dom';

const WelcomePage = ({ onGetStarted, onDemoClick }) => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    onGetStarted();
    navigate('/dashboard');
  };

  const handleDemoClick = () => {
    onDemoClick();
    navigate('/dashboard');
  };

  return (
    <div className="bg-gray-900 min-h-screen flex items-center justify-center text-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to Habit Tracker</h1>
        <p className="mb-8">Start building better habits today!</p>
        <button 
          onClick={handleGetStarted}
          className="bg-blue-600 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-blue-700 transition duration-300 mr-4"
        >
          Get Started
        </button>
        <button 
          onClick={handleDemoClick}
          className="bg-green-600 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-green-700 transition duration-300"
        >
          Try Demo
        </button>
      </div>
    </div>
  );
};

export default WelcomePage;