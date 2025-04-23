import { NextResponse } from "next/server";
import { getProjectById, updateProject, deleteProject } from "../../../lib/db";

export async function GET(request, { params }) {
  try {
    const { id } = params;

    const project = await getProjectById(id);

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error(`Error fetching project with ID ${params.id}:`, error);
    return NextResponse.json(
      { error: "Failed to fetch project: " + error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const project = await request.json();

    if (!project.name) {
      return NextResponse.json(
        { error: "Project name is required" },
        { status: 400 }
      );
    }

    await updateProject(id, project);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Error updating project with ID ${params.id}:`, error);

    if (error.message === "Project not found") {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(
      { error: "Failed to update project: " + error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    await deleteProject(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Error deleting project with ID ${params.id}:`, error);

    if (error.message === "Project not found") {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(
      { error: "Failed to delete project: " + error.message },
      { status: 500 }
    );
  }
}
