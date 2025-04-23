"use client";

import { useState, useEffect } from "react";
import Header from "../components/Header";
import ActiveProjects from "../components/ActiveProjects";
import CompletedProjects from "../components/CompletedProjects";
import AddProjectModal from "../components/AddProjectModal";
import EditProjectModal from "../components/EditProjectModal";
import NotesModal from "../components/NotesModal";
import Navigation from "../components/Navigation";

export default function Home() {
  // State declarations
  const [projects, setProjects] = useState([]);
  const [completedProjects, setCompletedProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [filteredCompletedProjects, setFilteredCompletedProjects] = useState(
    []
  );
  const [showCompleted, setShowCompleted] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [activeLinksDropdown, setActiveLinksDropdown] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [newLink, setNewLink] = useState({ name: "", url: "" });
  const [highlightAddLink, setHighlightAddLink] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [activeProjectNotes, setActiveProjectNotes] = useState({
    name: "",
    notes: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilters, setActiveFilters] = useState([]);

  // Constants
  const typeOptions = [
    { value: "daily", label: "Daily Tasks" },
    { value: "testnet", label: "Testnet" },
    { value: "retro", label: "Retroactive" },
    { value: "node", label: "Node" },
    { value: "depin", label: "DePIN" },
    { value: "other", label: "Other" },
  ];

  // Fetch projects on component mount
  useEffect(() => {
    fetchProjects();
  }, []);

  // Filter projects when search or filters change
  useEffect(() => {
    filterProjects();
  }, [projects, completedProjects, searchTerm, activeFilters]);

  // Fetch projects from API
  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/projects");
      if (!response.ok) throw new Error("Failed to fetch projects");

      const data = await response.json();

      // Separate active and completed projects
      const completed = data.filter((p) => p.completed);
      const active = data.filter((p) => !p.completed);

      setProjects(active);
      setCompletedProjects(completed);
      setFilteredProjects(active);
      setFilteredCompletedProjects(completed);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  // Filter projects based on search term and active filters
  const filterProjects = () => {
    // Filter active projects
    const filteredActive = projects.filter((project) => {
      // Check search term
      const matchesSearch =
        searchTerm === "" ||
        project.name.toLowerCase().includes(searchTerm.toLowerCase());

      // Check filters
      const matchesFilter =
        activeFilters.length === 0 ||
        (project.types
          ? project.types.some((type) => activeFilters.includes(type))
          : project.type
          ? activeFilters.includes(project.type)
          : false);

      return matchesSearch && matchesFilter;
    });

    // Filter completed projects
    const filteredCompleted = completedProjects.filter((project) => {
      // Check search term
      const matchesSearch =
        searchTerm === "" ||
        project.name.toLowerCase().includes(searchTerm.toLowerCase());

      // Check filters
      const matchesFilter =
        activeFilters.length === 0 ||
        (project.types
          ? project.types.some((type) => activeFilters.includes(type))
          : project.type
          ? activeFilters.includes(project.type)
          : false);

      return matchesSearch && matchesFilter;
    });

    setFilteredProjects(filteredActive);
    setFilteredCompletedProjects(filteredCompleted);
  };

  // Toggle dropdown menu
  const toggleDropdown = (projectId) => {
    setActiveDropdown(projectId === activeDropdown ? null : projectId);
    // Close links dropdown when opening another dropdown
    if (projectId !== null && activeLinksDropdown !== null) {
      setActiveLinksDropdown(null);
    }
  };

  // Toggle links dropdown
  const toggleLinksDropdown = (projectId) => {
    setActiveLinksDropdown(
      projectId === activeLinksDropdown ? null : projectId
    );
    // Close options dropdown when opening links dropdown
    if (projectId !== null && activeDropdown !== null) {
      setActiveDropdown(null);
    }
  };

  // Toggle project completion status
  const toggleCompletion = async (projectId) => {
    try {
      const projectToUpdate = projects.find((p) => p.id === projectId);
      if (!projectToUpdate) return;

      const updated = {
        ...projectToUpdate,
        completed: !projectToUpdate.completed,
      };

      // Update UI optimistically - tetap dalam array yang sama, tidak memindahkan proyek
      setProjects(projects.map((p) => (p.id === projectId ? updated : p)));

      // Send update to API
      const response = await fetch(`/api/projects/${projectId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });

      if (!response.ok) {
        throw new Error("Failed to update project");
      }

      // Jangan memanggil fetchProjects() karena akan memfilter ulang
      // Perbarui saja filteredProjects dengan hasil update
      setFilteredProjects(
        filteredProjects.map((p) => (p.id === projectId ? updated : p))
      );
    } catch (error) {
      console.error("Error toggling completion:", error);
      // Rollback optimistic update if failed
      await fetchProjects();
    }
  };

  // Move project to completed
  const moveToCompleted = async (projectId) => {
    try {
      const projectToUpdate = projects.find((p) => p.id === projectId);
      if (!projectToUpdate) return;

      const updatedProject = {
        ...projectToUpdate,
        completed: true,
        dateCompleted: new Date().toISOString(),
      };

      // Update UI optimistically
      setProjects(projects.filter((p) => p.id !== projectId));
      setCompletedProjects([updatedProject, ...completedProjects]);

      // Send update to API
      const response = await fetch(`/api/projects/${projectId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProject),
      });

      if (!response.ok) {
        throw new Error("Failed to complete project");
      }

      // Refetch to ensure data consistency
      await fetchProjects();
    } catch (error) {
      console.error("Error moving to completed:", error);
      await fetchProjects();
    }
  };

  // Move project back to active
  const moveToActive = async (projectId) => {
    try {
      const projectToUpdate = completedProjects.find((p) => p.id === projectId);
      if (!projectToUpdate) return;

      const updatedProject = {
        ...projectToUpdate,
        completed: false,
        dateCompleted: null,
      };

      // Update UI optimistically
      setCompletedProjects(completedProjects.filter((p) => p.id !== projectId));
      setProjects([updatedProject, ...projects]);

      // Send update to API
      const response = await fetch(`/api/projects/${projectId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProject),
      });

      if (!response.ok) {
        throw new Error("Failed to move project to active");
      }

      // Refetch to ensure data consistency
      await fetchProjects();
    } catch (error) {
      console.error("Error moving to active:", error);
      await fetchProjects();
    }
  };

  // Add new project
  const addProject = async (project) => {
    try {
      const newProject = {
        ...project,
        id: Date.now(),
        completed: false,
        dateAdded: new Date().toISOString(),
      };

      // Update UI optimistically
      setProjects([newProject, ...projects]);

      // Send to API
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProject),
      });

      if (!response.ok) {
        throw new Error("Failed to add project");
      }

      // Refetch to ensure data consistency
      await fetchProjects();
    } catch (error) {
      console.error("Error adding project:", error);
      await fetchProjects();
    }
  };

  // Delete project
  const deleteProject = async (projectId) => {
    try {
      // Determine if the project is in active or completed list
      const isActive = projects.some((p) => p.id === projectId);

      // Update UI optimistically
      if (isActive) {
        setProjects(projects.filter((p) => p.id !== projectId));
      } else {
        setCompletedProjects(
          completedProjects.filter((p) => p.id !== projectId)
        );
      }

      // Send delete request to API
      const response = await fetch(`/api/projects/${projectId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete project");
      }

      // Refetch to ensure data consistency
      await fetchProjects();
    } catch (error) {
      console.error("Error deleting project:", error);
      await fetchProjects();
    }
  };

  // Edit project
  const editProject = (projectId) => {
    const projectToEdit = projects.find((p) => p.id === projectId);
    if (projectToEdit) {
      setEditingProject(projectToEdit);
      setNewLink({ name: "", url: "" });
      setShowEditForm(true);
    }
  };

  // Update edited project
  const updateProject = async (e) => {
    e.preventDefault();

    try {
      // Update UI optimistically
      setProjects(
        projects.map((p) => (p.id === editingProject.id ? editingProject : p))
      );

      // Send update to API
      const response = await fetch(`/api/projects/${editingProject.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingProject),
      });

      if (!response.ok) {
        throw new Error("Failed to update project");
      }

      // Reset form and fetch fresh data
      setShowEditForm(false);
      setEditingProject(null);
      await fetchProjects();
    } catch (error) {
      console.error("Error updating project:", error);
      await fetchProjects();
    }
  };

  // View project notes
  const viewProjectNotes = (project) => {
    setActiveProjectNotes({
      name: project.name,
      notes: project.notes,
    });
    setShowNotesModal(true);
  };

  // Reset all project completions
  const resetAllCompletions = async () => {
    if (projects.length === 0 && completedProjects.length === 0) return;

    try {
      // Mark all projects as not completed
      const toReset = [...projects, ...completedProjects].map((p) => ({
        ...p,
        completed: false,
        dateCompleted: null,
      }));

      // Optimistic update
      setProjects(toReset);
      setCompletedProjects([]);

      // Send batch update to API
      await Promise.all(
        toReset.map((project) =>
          fetch(`/api/projects/${project.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(project),
          })
        )
      );

      // Refetch to ensure data consistency
      await fetchProjects();
    } catch (error) {
      console.error("Error resetting completions:", error);
      await fetchProjects();
    }
  };

  return (
    <div
      className="max-w-6xl mx-auto px-4 py-6"
      style={{
        height: "calc(100vh - 40px)",
        overflow: "hidden",
        marginBottom: "40px",
      }}
    >
      <Header
        showCompleted={showCompleted}
        filteredProjects={filteredProjects}
        resetAllCompletions={resetAllCompletions}
        setShowAddForm={setShowAddForm}
      />

      <Navigation
        showCompleted={showCompleted}
        setShowCompleted={setShowCompleted}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        activeFilters={activeFilters}
        setActiveFilters={setActiveFilters}
        typeOptions={typeOptions}
      />

      <div className="mt-6">
        {!showCompleted ? (
          <ActiveProjects
            projects={projects}
            filteredProjects={filteredProjects}
            toggleCompletion={toggleCompletion}
            toggleDropdown={toggleDropdown}
            activeDropdown={activeDropdown}
            moveToCompleted={moveToCompleted}
            deleteProject={deleteProject}
            editProject={editProject}
            viewProjectNotes={viewProjectNotes}
            toggleLinksDropdown={toggleLinksDropdown}
            activeLinksDropdown={activeLinksDropdown}
            typeOptions={typeOptions}
          />
        ) : (
          <CompletedProjects
            completedProjects={completedProjects}
            filteredCompletedProjects={filteredCompletedProjects}
            viewProjectNotes={viewProjectNotes}
            toggleLinksDropdown={toggleLinksDropdown}
            activeLinksDropdown={activeLinksDropdown}
            typeOptions={typeOptions}
            moveToActive={moveToActive}
          />
        )}
      </div>

      {showAddForm && (
        <AddProjectModal
          setShowAddForm={setShowAddForm}
          addProject={addProject}
          typeOptions={typeOptions}
        />
      )}

      {showEditForm && editingProject && (
        <EditProjectModal
          editingProject={editingProject}
          setEditingProject={setEditingProject}
          newLink={newLink}
          setNewLink={setNewLink}
          updateProject={updateProject}
          setShowEditForm={setShowEditForm}
          highlightAddLink={highlightAddLink}
          setHighlightAddLink={setHighlightAddLink}
          typeOptions={typeOptions}
        />
      )}

      {showNotesModal && (
        <NotesModal
          activeProjectNotes={activeProjectNotes}
          setShowNotesModal={setShowNotesModal}
          setActiveProjectNotes={setActiveProjectNotes}
        />
      )}
    </div>
  );
}
