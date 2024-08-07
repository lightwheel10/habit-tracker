import React from 'react';
import { Plus, Leaf, Activity, Zap } from 'lucide-react';

const EmptyState = ({ onAddHabit }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <div className="space-y-2 mb-6">
        <div className="bg-gray-800 p-3 rounded-lg flex items-center">
          <Leaf className="text-green-500 mr-3" size={24} />
          <div className="h-2 bg-gray-700 rounded w-40"></div>
        </div>
        <div className="bg-gray-800 p-3 rounded-lg flex items-center">
          <Activity className="text-blue-500 mr-3" size={24} />
          <div className="h-2 bg-gray-700 rounded w-40"></div>
        </div>
        <div className="bg-gray-800 p-3 rounded-lg flex items-center">
          <Zap className="text-orange-500 mr-3" size={24} />
          <div className="h-2 bg-gray-700 rounded w-40"></div>
        </div>
      </div>
      <h2 className="text-2xl font-bold mb-2">The Start of a Better You!</h2>
      <p className="text-gray-400 mb-6">
        Habits are like dominos. As one is formed, all others will follow!
      </p>
      <button
        onClick={onAddHabit}
        className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded inline-flex items-center"
      >
        <Plus size={20} className="mr-2" />
        Add Habits
      </button>
    </div>
  );
};

export default EmptyState;