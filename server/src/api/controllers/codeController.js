import axios from "axios";
import dotenv from "dotenv";
import Project from "../../../models/Project.js";
import User from "../../../models/User.js";

dotenv.config();

const JDoodleClientID = process.env.JDOODLE_CLIENTID;
const JDoodleClientSecret = process.env.JDOODLE_CLIENT_SECRET;

export const saveProject = async (req, res) => {
  try {
    const { id, name, language, code, userId } = req.body;
    if (!name || !language || !code || !userId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ error: "Invalid userId" });
    }

    let resultProject;

    if (id) {
      const project = await Project.findById(id);

      if (project) {
        project.name = name;
        project.code = code;
        await project.save();
        resultProject = project;
      } else {
        return res.status(404).json({ error: "Project not found" });
      }
    } else {
      const newProject = new Project({ name, language, code, userId });
      await newProject.save();
      resultProject = newProject;
    }

    res
      .status(201)
      .json({ message: "Project saved successfully", project: resultProject });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
};

export const runCode = async (req, res) => {
  try {
    const { language, code, input } = req.body;

    if (!language || !code) {
      return res
        .status(400)
        .json({ error: "Missing required fields: 'language' or 'code'" });
    }

    const languageMapping = {
      Python: "python3",
      "C++": "cpp",
      Java: "java",
      C: "c"
    };

    const payload = {
      script: code,
      language: languageMapping[language] || language.toLowerCase(),
      versionIndex: "0",
      stdin: input || "",
      clientId: JDoodleClientID,
      clientSecret: JDoodleClientSecret,
    };

    const response = await axios.post(
      "https://api.jdoodle.com/v1/execute",
      payload
    );

    const { output, memory, cpuTime, statusCode, error } = response.data;

    if (statusCode === 200) {
      return res.status(200).json({ output, memory, cpuTime });
    } else {
      return res.status(500).json({
        error: "Code execution failed",
        details: error || output || "Unknown error",
      });
    }
  } catch (error) {
    console.error("Error running code:", error.message);
    res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
};
