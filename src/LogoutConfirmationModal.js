import React from 'react';
import { X } from 'lucide-react'; // Import the X icon from lucide-react

const LogoutConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg w-96 relative">
        {/* Close button */}
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-white"
          onClick={onClose}
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold mb-4 text-white">Confirm Logout</h2>
        <p className="mb-6 text-gray-300">Are you sure you want to log out?</p>
        <div className="flex justify-end space-x-4">
          <button
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition duration-150 ease-in-out"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition duration-150 ease-in-out"
            onClick={onConfirm}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutConfirmationModal;