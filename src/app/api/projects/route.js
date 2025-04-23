import { NextResponse } from "next/server";
import {
  initializeDatabase,
  getAllProjects,
  createProject,
} from "../../lib/db";

// Initialize the database when the server starts
initializeDatabase().catch(console.error);

export async function GET() {
  try {
    const projects = await getAllProjects();
    return NextResponse.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const project = await request.json();

    if (!project.name) {
      return NextResponse.json(
        { error: "Project name is required" },
        { status: 400 }
      );
    }

    const projectId = await createProject(project);
    return NextResponse.json({ id: projectId }, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Failed to create project: " + error.message },
      { status: 500 }
    );
  }
}
