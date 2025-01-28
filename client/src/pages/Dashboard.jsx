import React, { useState, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import ProjectList from "../components/ProjectList";
import NewProjectModal from "../components/NewProjectModal";
import { Pie } from "react-chartjs-2";
import "chart.js/auto";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { format } from "date-fns";
import { Tooltip as ReactTooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import Cookies from "js-cookie";
import FindUsers from "../components/FindUsers";
import { MdLibraryAdd } from "react-icons/md";
import styles from "../css/dashboard.module.css";
import UserDetails from "../components/UserDetails";
import Loading from "../components/Loading";

const Dashboard = ({ isDarkMode, toggleTheme, initialNewSave }) => {
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newSave, setNewSave] = useState(initialNewSave || 0);
  const [heatmapData, setHeatmapData] = useState([]);
  const [hasActivityData, setHasActivityData] = useState(true);
  const [userWindow, setUserWindow] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const userString = Cookies.get("sessionData");
  let user = null;
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

  const userId = user._id;
  const userName = user.username;
  const userImage = user.image;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsResponse, activityResponse] = await Promise.all([
          fetch(`${apiUrl}/api/projects?userId=${userId}`),
          fetch(`${apiUrl}/api/activity/${userId}`),
        ]);

        const projectsData = await projectsResponse.json();
        setProjects(projectsData);

        if (activityResponse.ok) {
          const activityData = await activityResponse.json();
          const activityMap = new Map(
            activityData.map((item) => [
              format(new Date(item.date), "yyyy-MM-dd"),
              item.runs,
            ])
          );
          const yearStart = new Date(new Date().getFullYear(), 0, 1);
          const yearEnd = new Date(new Date().getFullYear(), 11, 31);
          const allDates = [];
          for (
            let date = yearStart;
            date <= yearEnd;
            date.setDate(date.getDate() + 1)
          ) {
            const formattedDate = format(date, "yyyy-MM-dd");
            allDates.push({
              date: formattedDate,
              count: activityMap.get(formattedDate) || 0,
            });
          }
          setHeatmapData(allDates);
          setHasActivityData(true);
        } else {
          setHasActivityData(false);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setHasActivityData(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const addProject = (language) => {
    setShowModal(false);
    navigate("/project", {
      state: {
        language,
        userId,
        newSave,
        setNewSave: null,
      },
    });
  };

  const deleteProject = async (id) => {
    const updatedProjects = projects.filter((project) => project._id !== id);
    setProjects(updatedProjects);

    try {
      const response = await fetch(
        `${apiUrl}/api/projects/delete/?projectId=${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete the project.");
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      setProjects(projects);
      alert("Failed to delete the project. Please try again.");
    }
  };

  const openProject = (project) => {
    navigate("/project", {
      state: {
        language: project.language,
        initialData: project,
        userId,
        newSave,
        setNewSave: null,
      },
    });
  };

  const projectLanguageData = () => {
    const languageColors = {
      Web: "#FFD700",
      Python: "#87CEFA",
      Java: "#98FB98",
      C: "#A9A9A9",
      "C++": "#9370DB",
    };

    const languageCount = projects.reduce((acc, project) => {
      acc[project.language] = (acc[project.language] || 0) + 1;
      return acc;
    }, {});

    if (Object.keys(languageCount).length === 0) {
      return {
        labels: ["No data"],
        datasets: [
          {
            data: [1],
            backgroundColor: ["#E6E6FA"],
            hoverBackgroundColor: ["#D3D3D3"],
          },
        ],
        languageCount,
        languageColors: { Default: "#b3b3b3" },
      };
    }

    return {
      labels: Object.keys(languageCount),
      datasets: [
        {
          data: Object.values(languageCount),
          backgroundColor: Object.keys(languageCount).map(
            (lang) => languageColors[lang] || "#D3D3D3"
          ),
          hoverBackgroundColor: Object.keys(languageCount).map(
            (lang) => languageColors[lang] || "#D3D3D3"
          ),
        },
      ],
      languageCount,
      languageColors,
    };
  };

  const getClassForValue = (value) => {
    if (!value || !value.count) {
      return styles["color-empty"];
    }
    if (value.count < 10) {
      return styles["color-scale-1"];
    }
    if (value.count < 25) {
      return styles["color-scale-2"];
    }
    if (value.count < 50) {
      return styles["color-scale-3"];
    }
    return styles["color-scale-4"];
  };

  const chartOptions = {
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
      },
    },
  };

  const tooltipContent = (value) => {
    if (!value || value.count === null || value.count === 0) {
      return `${format(new Date(value.date), "dd MMM yyyy")}: 0 runs`;
    }
    return `${format(new Date(value.date), "dd MMM yyyy")}: ${
      value.count
    } runs`;
  };

  if (isLoading) {
    return <Loading isDarkMode={isDarkMode} />;
  }

  return (
    <div
      className={`${styles["dash-box"]} ${isDarkMode ? styles["dark"] : ""}`}
    >
      <Navbar
        userName={userName}
        userImage={userImage}
        toggleTheme={toggleTheme}
        isDarkMode={isDarkMode}
      />
      <div className={styles["dash-content"]}>
        <div className={styles.projects}>
          <div className={styles["projects-header"]}>
            <h3>Your Projects</h3>
            <MdLibraryAdd
              title="Create New Project"
              className={styles["new-project-button"]}
              onClick={() => setShowModal(true)}
            />
          </div>
          <ProjectList
            projects={projects}
            onDelete={deleteProject}
            onOpen={openProject}
            isDarkMode={isDarkMode}
          />
          <NewProjectModal
            open={showModal}
            onClose={() => setShowModal(false)}
            onCreate={addProject}
            isDarkMode={isDarkMode}
          />
        </div>
        <div className={styles["right-space"]}>
          <div className={styles["right-container"]}>
            <div className={styles.friends}>
              {userWindow ? (
                <UserDetails
                  setUserWindow={setUserWindow}
                  isDarkMode={isDarkMode}
                />
              ) : (
                <FindUsers
                  setUserWindow={setUserWindow}
                  isDarkMode={isDarkMode}
                />
              )}
            </div>
            <div className={styles.technologies}>
              <div className={styles["graph-section"]}>
                {projects.length > 0 ? (
                  <div className={styles["pie-chart-container"]}>
                    <div className={styles["chart-labels"]}>
                      {projectLanguageData().labels.map((label, index) => (
                        <div key={index} className={styles["chart-label"]}>
                          <span
                            className={styles["label-color"]}
                            style={{
                              backgroundColor:
                                projectLanguageData().datasets[0]
                                  .backgroundColor[index],
                            }}
                          ></span>
                          {label}
                        </div>
                      ))}
                    </div>
                    <div className={styles.chart}>
                      <Pie
                        data={projectLanguageData()}
                        options={chartOptions}
                      />
                    </div>
                  </div>
                ) : (
                  <div className={styles["no-stats"]}>
                    Start creating projects to see stats!
                  </div>
                )}
              </div>
              <div className={styles["language-count-list"]}>
                <h4>Project Count</h4>
                <ul>
                  {Object.entries(projectLanguageData().languageCount).map(
                    ([language, count]) => (
                      <li
                        key={language}
                        style={{
                          color:
                            projectLanguageData().languageColors[language] ||
                            "#555",
                        }}
                      >
                        <span className={styles["label-language"]}>
                          {language}
                        </span>
                        <span className={styles["label-language-count"]}>
                          {count}
                        </span>
                      </li>
                    )
                  )}
                </ul>
              </div>
            </div>
          </div>
          <div className={styles["activity-space"]}>
            {hasActivityData ? (
              <>
                <CalendarHeatmap
                  startDate={new Date(new Date().getFullYear(), 0, 0)}
                  endDate={new Date(new Date().getFullYear(), 11, 31)}
                  values={heatmapData}
                  classForValue={getClassForValue}
                  tooltipDataAttrs={(value) =>
                    value
                      ? {
                          "data-tooltip-content": tooltipContent(value),
                        }
                      : { "data-tooltip-content": "No data" }
                  }
                  showWeekdayLabels={true}
                />
                <ReactTooltip
                  anchorSelect="[data-tooltip-content]"
                  place="top"
                  type="dark"
                  effect="solid"
                />
                <h4 style={{ textAlign: "center", marginTop: "10px" }}>
                  Activity Graph
                </h4>
              </>
            ) : (
              <div className={styles["no-activity"]}>
                Start Running Some Codes...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
