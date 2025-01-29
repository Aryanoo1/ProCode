import React, { useState, useEffect } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Button, Tabs, Tab, Paper, Typography, Box } from "@mui/material";
import CodeMirror from "@uiw/react-codemirror";
import { java } from "@codemirror/lang-java";
import { python } from "@codemirror/lang-python";
import { cpp } from "@codemirror/lang-cpp";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { javascript } from "@codemirror/lang-javascript";
import { dracula } from "@uiw/codemirror-theme-dracula";
import { autocompletion } from "@codemirror/autocomplete";
import { basicSetup } from "@codemirror/basic-setup";
import styles from "../css/codeeditorpage.module.css";
import Cookies from "js-cookie";
import Loading from "../components/Loading";

const boilerplateCode = {
  Java: `public class Main {
  public static void main(String[] args) {
      System.out.println("Hello, World!");
  }
}`,
  Python: `print("Hello, World!")`,
  C: `#include <stdio.h>

int main() {
  printf("Hello, World!");
  return 0;
}`,
  "C++": `#include <iostream>

int main() {
  std::cout << "Hello, World!" << std::endl;
  return 0;
}`,
  JavaScript: `console.log("Hello, World!");`,
  Web: {
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Web Project</title>
  <style>
      body {
          font-family: Arial, sans-serif;
      }
  </style>
</head>
<body>
  <h1>Hello, World!</h1>
  <script>
      console.log("Hello from JavaScript!");
  </script>
</body>
</html>`,
    css: `body {
font-family: Arial, sans-serif;
background-color: #f0f0f0;
}`,
    js: `console.log("JavaScript is running!");`,
  },
};

const languageExtensions = {
  Java: [java(), autocompletion()],
  Python: [python(), autocompletion()],
  C: [cpp(), autocompletion()],
  "C++": [cpp(), autocompletion()],
  JavaScript: [javascript(), autocompletion()],
  Web: [html(), css(), javascript(), autocompletion()],
};

const CodeEditorPage = ({ isDarkMode, toggleTheme }) => {
  const userString = Cookies.get("sessionData");
  let user = null;
  const location = useLocation();
  const navigate = useNavigate();

  try {
    if (userString === "[object Object]") {
      console.error("Session data was improperly stored");
      return <Navigate to="/login" />;
    }
    user = userString ? JSON.parse(userString) : null;
  } catch (error) {
    console.error("Error parsing user data:", error);
    return <Navigate to="/login" />;
  }

  if (!user) {
    return <Navigate to="/" />;
  }
  const { language, initialData, userId, newSave } = location.state || {};

  const apiUrl = import.meta.env.VITE_API_URL;

  const isWebDev = language === "Web";

  const [code, setCode] = useState(
    isWebDev ? { html: "", css: "", js: "" } : ""
  );
  const [projectName, setProjectName] = useState(initialData?.name || "");
  const [activeTab, setActiveTab] = useState("html");
  const [output, setOutput] = useState("");
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isCodeLoading, setIsCodeLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [projectId, setProjectId] = useState(initialData?._id || null);

  useEffect(() => {
    if (initialData) {
      setCode(isWebDev ? initialData.code : initialData.code.main);
      setProjectName(initialData.name);
    } else {
      setCode(isWebDev ? boilerplateCode.Web : boilerplateCode[language]);
    }
    setIsLoading(false);
  }, [initialData, language, isWebDev]);

  const handleSave = async (silent = false) => {
    if (!projectName.trim()) {
      alert("Please enter a project name.");
      return;
    }

    if (isSaving) {
      console.log("Save operation already in progress");
      return;
    }

    setIsSaving(true);

    const project = {
      id: projectId,
      name: projectName,
      language,
      code: isWebDev ? code : { main: code },
      userId,
    };

    console.log("project id sent: ", project.id);

    try {
      const response = await fetch(`${apiUrl}/api/code/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(project),
      });

      if (!response.ok) {
        throw new Error("Failed to save project");
      }

      const savedProject = await response.json();
      setProjectId(savedProject._id);
      if (!silent) {
        alert("Project saved successfully!");
      }
    } catch (err) {
      console.error(err);
      if (!silent) {
        alert("An error occurred while saving the project.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleRun = async () => {
    if (projectName === "") {
      alert("Please name the project first.");
      return;
    }

    if (isSaving) {
      alert("Please wait for the current save operation to complete.");
      return;
    }

    setIsCodeLoading(true);
    setOutput("");

    await handleSave(true);

    if (isWebDev) {
      const iframe = document.getElementById("web-preview");
      if (iframe) {
        const htmlContent = `<!DOCTYPE html>
<html>
<head>
<style>${code.css}</style>
</head>
<body>
${code.html}
<script>${code.js}</script>
</body>
</html>`;
        iframe.srcdoc = htmlContent;
      }
    } else {
      try {
        const response = await fetch(`${apiUrl}/api/code/run`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ language, code, input }),
        });

        const data = await response.json();
        if (response.ok) {
          setOutput(data.output);
        } else {
          setOutput("An error occurred while running the code.");
        }

        await fetch(`${apiUrl}/api/activity/${userId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            date: new Date().toISOString().split("T")[0],
            runs: 1,
          }),
        });
      } catch (err) {
        console.error(err);
        setOutput("An error occurred while connecting to the server.");
      }
    }

    setIsCodeLoading(false);
  };

  const handleReturn = () => {
    navigate("/dashboard");
  };

  const extensions = [...(languageExtensions[language] || [basicSetup])];

  if (isLoading) {
    return <Loading isDarkMode={isDarkMode} />;
  }

  return (
    <Box
      className={`${styles["code-editor-container"]} ${
        isDarkMode ? styles["dark"] : ""
      }`}
    >
      <Box className={styles["header-container"]}>
        <Box className={styles["project-name-container"]}>
          <Typography
            variant="subtitle1"
            sx={{ marginRight: 2, fontSize: "1.2rem" }}
          >
            Project Name:
          </Typography>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Enter project name..."
            className={styles["project-name-input"]}
          />
        </Box>
        <Box className={styles["button-container"]}>
          <Button variant="contained" color="primary" onClick={handleRun}>
            Run
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={() => handleSave(false)}
          >
            Save
          </Button>
          <Button variant="contained" color="secondary" onClick={handleReturn}>
            Back
          </Button>
        </Box>
      </Box>

      <Paper elevation={3} className={styles["editor-paper"]}>
        <Box className={styles["editor-header"]}>
          <Typography variant="h6" gutterBottom>
            Editor
          </Typography>
          {isWebDev && (
            <Tabs
              value={activeTab}
              onChange={(e, newValue) => setActiveTab(newValue)}
              aria-label="web-editor-tabs"
              sx={{
                marginBottom: 2,
                "& .MuiTab-root": {
                  color: isDarkMode ? "#ffffff" : "#000000",
                },
                "& .Mui-selected": {
                  color: isDarkMode
                    ? "#ffffff !important"
                    : "#000000 !important",
                },
              }}
            >
              <Tab label="HTML" value="html" />
              <Tab label="CSS" value="css" />
              <Tab label="JavaScript" value="js" />
            </Tabs>
          )}
        </Box>
        <Box className={styles["code-mirror-container"]}>
          <div className={styles["code-mirror-wrapper"]}>
            <CodeMirror
              value={isWebDev ? code[activeTab] || "" : code}
              extensions={extensions}
              theme={isDarkMode ? dracula : "light"}
              onChange={(value) =>
                isWebDev
                  ? setCode({ ...code, [activeTab]: value })
                  : setCode(value)
              }
              height="100%"
            />
          </div>
        </Box>
      </Paper>

      {!isWebDev && (
        <Paper elevation={3} className={styles["output-paper"]}>
          <Box className={styles["input-container"]}>
            <Typography
              variant="h6"
              gutterBottom
              className={styles["headings"]}
            >
              Input
            </Typography>
            <textarea
              className={styles["input-textarea"]}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter input here..."
            ></textarea>
          </Box>
          <Box className={styles["output-container"]}>
            <Typography
              variant="h6"
              gutterBottom
              className={styles["headings"]}
            >
              Output
            </Typography>
            {isCodeLoading ? (
              <Loading isDarkMode={isDarkMode} />
            ) : (
              <textarea
                className={styles["output-textarea"]}
                readOnly
                value={output}
                placeholder="Output will be displayed here..."
              ></textarea>
            )}
          </Box>
        </Paper>
      )}

      {isWebDev && (
        <div className={styles["preview-screen"]}>
          <div className={styles["preview-name"]}>Preview</div>
          <iframe
            id="web-preview"
            title="Web Preview"
            className={styles["web-preview"]}
          ></iframe>
        </div>
      )}
    </Box>
  );
};

export default CodeEditorPage;
