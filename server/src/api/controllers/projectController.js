import Project from "../../../models/Project.js";

export const getProjects = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required." });
    }

    const projects = await Project.find({ userId });

    return res.status(200).json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ error: "Failed to fetch projects." });
  }
};

export const delteProject = async (req, res) => {
  try {
    const { projectId } = req.query;

    if (!projectId) {
      return res
        .status(400)
        .json({ error: "Project ID and User ID are required." });
    }

    const project = await Project.findByIdAndDelete(projectId);
    if (!project) {
      return res.status(404).json({ error: "Project not found." });
    }

    return res.status(200).json({ message: "Project deleted successfully." });
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({ error: "Failed to delete project." });
  }
};
