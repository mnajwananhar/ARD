"use client";

import {
  CalendarClock,
  FileText,
  Link as LinkIcon,
  ExternalLink,
  FileCheck,
  RefreshCw,
  X,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

const CompletedProjects = ({
  completedProjects,
  filteredCompletedProjects,
  viewProjectNotes,
  toggleLinksDropdown,
  activeLinksDropdown,
  typeOptions,
  moveToActive, // New prop for moving projects back to active
}) => {
  // State declarations
  const [showMoveToActiveModal, setShowMoveToActiveModal] = useState(false);
  const [modalProjectId, setModalProjectId] = useState(null);
  const [linksPosition, setLinksPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });

  // Ref declarations
  const mainContainerRef = useRef(null);
  const linksButtonRefs = useRef({}); // Changed to object for multiple buttons

  // Constants
  const MAX_ITEMS_BEFORE_SCROLL = 10;
  const shouldScroll =
    filteredCompletedProjects.length > MAX_ITEMS_BEFORE_SCROLL;

  // Format date function
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  // Get label for a type from type options
  const getTypeLabel = (type) => {
    const option = typeOptions.find((opt) => opt.value === type);
    return option ? option.label : type;
  };

  // Get project name by ID
  const getProjectName = (projectId) => {
    const project = completedProjects.find((p) => p.id === projectId);
    return project ? project.name : "this project";
  };

  // Function to get appropriate icon based on type
  const getTypeIcon = (type) => {
    switch (type) {
      case "daily":
        return <FileCheck size={16} className="text-blue-400" />;
      case "testnet":
        return <FileCheck size={16} className="text-purple-400" />;
      case "retro":
        return <FileCheck size={16} className="text-pink-400" />;
      case "node":
        return <FileCheck size={16} className="text-green-400" />;
      case "depin":
        return <FileCheck size={16} className="text-orange-400" />;
      default:
        return <FileCheck size={16} className="text-indigo-400" />;
    }
  };

  // Update dropdown positions when they open - similar to ActiveProjects
  useEffect(() => {
    if (activeLinksDropdown && linksButtonRefs.current[activeLinksDropdown]) {
      const buttonRect =
        linksButtonRefs.current[activeLinksDropdown].getBoundingClientRect();
      // Calculate appropriate width based on content
      const width = 250; // Default width

      setLinksPosition({
        top: buttonRect.bottom + window.scrollY + 5,
        left: buttonRect.left,
        width,
      });
    }
  }, [activeLinksDropdown]);

  // Handle click outside to close dropdowns and modals
  useEffect(() => {
    const handleClickOutside = (e) => {
      // Handle links dropdown
      if (
        activeLinksDropdown &&
        linksButtonRefs.current[activeLinksDropdown] &&
        !linksButtonRefs.current[activeLinksDropdown].contains(e.target) &&
        !document.getElementById("links-dropdown-portal").contains(e.target)
      ) {
        toggleLinksDropdown(null);
      }

      // Handle modal - only close when clicking outside the modal content
      if (showMoveToActiveModal) {
        const modalContent = document.querySelector(
          ".moveToActive-modal-content"
        );
        if (modalContent && !modalContent.contains(e.target)) {
          setShowMoveToActiveModal(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activeLinksDropdown, toggleLinksDropdown, showMoveToActiveModal]);

  // Create portal containers if they don't exist
  useEffect(() => {
    const createPortalContainer = (id) => {
      if (!document.getElementById(id)) {
        const portalDiv = document.createElement("div");
        portalDiv.id = id;
        document.body.appendChild(portalDiv);
      }
    };

    createPortalContainer("links-dropdown-portal");
    createPortalContainer("moveToActive-modal-portal");

    return () => {
      const cleanupPortal = (id) => {
        const portal = document.getElementById(id);
        if (portal) document.body.removeChild(portal);
      };

      cleanupPortal("links-dropdown-portal");
      cleanupPortal("moveToActive-modal-portal");
    };
  }, []);

  // Show modal to confirm moving back to active
  const handleShowMoveToActiveModal = (projectId) => {
    setModalProjectId(projectId);
    setShowMoveToActiveModal(true);
  };

  // Confirm moving back to active
  const confirmMoveToActive = () => {
    if (modalProjectId) {
      moveToActive(modalProjectId);
      setShowMoveToActiveModal(false);
      setModalProjectId(null);
    }
  };

  // Links dropdown portal - similar to ActiveProjects
  const linksDropdownPortal =
    activeLinksDropdown &&
    createPortal(
      <div
        className="fixed py-1 bg-gray-800 rounded-lg shadow-lg border border-gray-700 z-50"
        style={{
          top: `${linksPosition.top}px`,
          left: `${linksPosition.left}px`,
          width: `${linksPosition.width}px`,
          maxHeight: "400px",
          overflowY: "auto",
        }}
      >
        {filteredCompletedProjects
          .find((p) => p.id === activeLinksDropdown)
          ?.links.map((link, index) => (
            <a
              key={index}
              href={
                link.url.startsWith("http") ? link.url : `https://${link.url}`
              }
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
            >
              <span className="mr-2 truncate max-w-[200px]">{link.name}</span>
              <ExternalLink
                size={12}
                className="text-blue-400 ml-auto flex-shrink-0"
              />
            </a>
          ))}
      </div>,
      document.getElementById("links-dropdown-portal")
    );

  // Move to active modal portal
  const moveToActiveModalPortal =
    showMoveToActiveModal &&
    createPortal(
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
        <div className="bg-gray-800 rounded-lg border border-gray-700 shadow-xl max-w-md w-full p-5 moveToActive-modal-content">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center">
              <div className="mr-3 flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-purple-900/50">
                <RefreshCw size={20} className="text-purple-400" />
              </div>
              <h3 className="text-lg font-medium text-white">
                Move to Active Projects
              </h3>
            </div>
            <button
              onClick={() => setShowMoveToActiveModal(false)}
              className="text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>
          <div className="mb-6">
            <p className="text-gray-300">
              Are you sure you want to move{" "}
              <span className="font-semibold text-white">
                {getProjectName(modalProjectId)}
              </span>{" "}
              back to active projects?
            </p>
          </div>
          <div className="flex space-x-3 justify-end">
            <button
              onClick={() => setShowMoveToActiveModal(false)}
              className="px-4 py-2 rounded-md bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={confirmMoveToActive}
              className="px-4 py-2 rounded-md bg-purple-600 text-white hover:bg-purple-700 transition-colors flex items-center"
            >
              <RefreshCw size={16} className="mr-1" />
              Move to Active
            </button>
          </div>
        </div>
      </div>,
      document.getElementById("moveToActive-modal-portal")
    );

  return (
    <div ref={mainContainerRef}>
      {filteredCompletedProjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          {completedProjects.length === 0 ? (
            <>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-800 mb-4">
                <FileCheck size={32} className="text-gray-400" />
              </div>
              <p className="text-xl text-gray-400 mb-2">
                No completed projects yet
              </p>
              <p className="text-gray-500">Complete a project to see it here</p>
            </>
          ) : (
            <>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-800 mb-4">
                <FileCheck size={32} className="text-gray-400" />
              </div>
              <p className="text-xl text-gray-400 mb-4">
                No matching completed projects found
              </p>
            </>
          )}
        </div>
      ) : (
        <div
          className={`space-y-3 ${
            shouldScroll ? "max-h-[80vh] overflow-y-auto pr-2" : ""
          }`}
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#4B5563 #1F2937",
          }}
        >
          {filteredCompletedProjects.map((project) => (
            <div
              key={project.id}
              className="flex items-start justify-between p-4 rounded-lg border border-gray-800 bg-gray-800/30 backdrop-blur-sm hover:bg-gray-800/50 transition-all duration-200"
            >
              <div className="flex items-start space-x-3">
                <div className="flex items-center">
                  {/* Display primary type icon (first in the list or legacy type) */}
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-900 flex-shrink-0">
                    {getTypeIcon(
                      project.types && project.types.length > 0
                        ? project.types[0]
                        : project.type || "daily"
                    )}
                  </div>

                  <div className="ml-3">
                    <h3 className="font-medium text-gray-300">
                      {project.name}
                    </h3>

                    {/* Display type badges */}
                    {project.types && project.types.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {project.types.map((type) => (
                          <span
                            key={type}
                            className={`text-xs px-2 py-0.5 rounded-full ${
                              type === "daily"
                                ? "bg-blue-900/50 text-blue-300"
                                : type === "testnet"
                                ? "bg-purple-900/50 text-purple-300"
                                : type === "retro"
                                ? "bg-pink-900/50 text-pink-300"
                                : type === "node"
                                ? "bg-green-900/50 text-green-300"
                                : type === "depin"
                                ? "bg-orange-900/50 text-orange-300"
                                : "bg-indigo-900/50 text-indigo-300"
                            }`}
                          >
                            {getTypeLabel(type)}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* If using legacy type field and no types array */}
                    {(!project.types || project.types.length === 0) &&
                      project.type && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${
                              project.type === "daily"
                                ? "bg-blue-900/50 text-blue-300"
                                : project.type === "testnet"
                                ? "bg-purple-900/50 text-purple-300"
                                : project.type === "retro"
                                ? "bg-pink-900/50 text-pink-300"
                                : project.type === "node"
                                ? "bg-green-900/50 text-green-300"
                                : project.type === "depin"
                                ? "bg-orange-900/50 text-orange-300"
                                : "bg-indigo-900/50 text-indigo-300"
                            }`}
                          >
                            {getTypeLabel(project.type)}
                          </span>
                        </div>
                      )}

                    <div className="flex items-center mt-2 text-sm text-gray-500">
                      <CalendarClock size={14} className="mr-1" />
                      <span>
                        Completed: {formatDate(project.dateCompleted)}
                      </span>
                    </div>
                  </div>

                  <div className="flex ml-2">
                    {/* Move to Active button */}
                    <button
                      onClick={() => handleShowMoveToActiveModal(project.id)}
                      className="ml-2 p-1.5 rounded-full bg-purple-900/50 hover:bg-purple-900/80 transition-colors"
                      title="Move to Active Projects"
                    >
                      <RefreshCw size={14} className="text-purple-300" />
                    </button>

                    {project.notes && (
                      <button
                        onClick={() => viewProjectNotes(project)}
                        className="ml-2 p-1 rounded-full hover:bg-gray-700"
                        title="View Notes"
                      >
                        <FileText size={14} className="text-yellow-400" />
                      </button>
                    )}

                    {/* Links button - updated to match ActiveProjects implementation */}
                    {project.links && project.links.length > 0 && (
                      <button
                        ref={(el) => {
                          linksButtonRefs.current[project.id] = el;
                        }}
                        onClick={() =>
                          toggleLinksDropdown(
                            activeLinksDropdown === project.id
                              ? null
                              : project.id
                          )
                        }
                        className={`ml-2 p-1 rounded-full hover:bg-gray-700 ${
                          activeLinksDropdown === project.id
                            ? "bg-gray-700"
                            : ""
                        }`}
                        title="View links"
                      >
                        <LinkIcon size={14} className="text-blue-400" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Optional: Add a counter when scrolling is enabled */}
      {shouldScroll && (
        <div className="text-sm text-gray-500 mt-2 text-right">
          Showing {filteredCompletedProjects.length} completed projects
        </div>
      )}

      {/* Render portals */}
      {linksDropdownPortal}
      {moveToActiveModalPortal}
    </div>
  );
};

export default CompletedProjects;
