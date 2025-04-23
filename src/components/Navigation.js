"use client";

import { CheckSquare, Award, Search, Filter, X } from "lucide-react";
import MultiSelect from "./MultiSelect";

const Navigation = ({
  showCompleted,
  setShowCompleted,
  searchTerm,
  setSearchTerm,
  activeFilters,
  setActiveFilters,
  typeOptions,
}) => {
  // Handle filter toggle - multi-select implementation
  const toggleFilter = (value) => {
    if (activeFilters.includes(value)) {
      // If value is already selected, remove it
      setActiveFilters(activeFilters.filter((filter) => filter !== value));
    } else {
      // If value is not selected, add it
      setActiveFilters([...activeFilters, value]);
    }
  };

  return (
    <div className="flex flex-col mb-6 space-y-4">
      <div className="flex bg-gray-800 rounded-xl p-1">
        <button
          className={`flex-1 py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center ${
            !showCompleted
              ? "bg-blue-600 text-white shadow-lg"
              : "hover:bg-gray-700"
          }`}
          onClick={() => setShowCompleted(false)}
        >
          <CheckSquare size={18} className="mr-2" />
          Active Tasks
        </button>
        <button
          className={`flex-1 py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center ${
            showCompleted
              ? "bg-blue-600 text-white shadow-lg"
              : "hover:bg-gray-700"
          }`}
          onClick={() => setShowCompleted(true)}
        >
          <Award size={18} className="mr-2" />
          Completed
        </button>
      </div>
      <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-3">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-500" />
          </div>
          <input
            type="text"
            placeholder="Search projects or links..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <X size={18} className="text-gray-500 hover:text-white" />
            </button>
          )}
        </div>
        <div className="flex-shrink-0 relative md:min-w-[220px]">
          <MultiSelect
            options={typeOptions}
            selected={activeFilters}
            onChange={setActiveFilters}
            placeholder="Filter by type"
          />
        </div>
      </div>
    </div>
  );
};

export default Navigation;
