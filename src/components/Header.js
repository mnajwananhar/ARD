"use client";

import { PlusCircle, RefreshCw } from "lucide-react";

// Simple, clearly recognizable hot air balloon icon
const Balloon = ({ size = 24, className = "" }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Main balloon */}
      <path
        d="M12 2C7.58172 2 4 5.58172 4 10C4 13.3894 6.05452 16.2698 9 17.3833V19H15V17.3833C17.9455 16.2698 20 13.3894 20 10C20 5.58172 16.4183 2 12 2Z"
        fill="currentColor"
        fillOpacity="0.2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Vertical panels */}
      <path
        d="M8 3.5V14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M12 2V17"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M16 3.5V14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* Basket */}
      <rect
        x="9"
        y="19"
        width="6"
        height="3"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.5"
      />

      {/* Strings connecting to basket */}
      <line
        x1="10"
        y1="17"
        x2="9.5"
        y2="19"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="14"
        y1="17"
        x2="14.5"
        y2="19"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
};

const Header = ({
  showCompleted,
  filteredProjects,
  resetAllCompletions,
  setShowAddForm,
}) => {
  return (
    <div className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
      <div className="flex items-center">
        <Balloon size={32} className="text-blue-400 mr-2" />
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          Airdrop Tracker
        </h1>
      </div>
      <div className="flex space-x-2">
        {!showCompleted && filteredProjects.length > 0 && (
          <button
            onClick={resetAllCompletions}
            className="flex items-center justify-center w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-full transition-all duration-200 border border-gray-700"
            title="Reset all daily checks"
          >
            <RefreshCw size={18} className="text-yellow-400" />
          </button>
        )}
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center justify-center w-10 h-10 bg-blue-600 hover:bg-blue-500 text-white rounded-full transition-all duration-200"
          title="Add new project"
        >
          <PlusCircle size={18} />
        </button>
      </div>
    </div>
  );
};

export default Header;
