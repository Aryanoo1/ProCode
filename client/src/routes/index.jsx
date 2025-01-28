import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import CodeEditorPage from "../pages/CodeEditorPage";
import Register from "../pages/Register";
import UserInfo from "../pages/UserInfo";
import LandingPage from "../pages/LandingPage";

const AppRoutes = () => {
  const location = useLocation();
  const dashboardState = location.state;

  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode");
    if (savedDarkMode !== null) {
      setIsDarkMode(JSON.parse(savedDarkMode));
    }
  }, []);

  const toggleTheme = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem("darkMode", JSON.stringify(newDarkMode));
  };

  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/userinfo" element={<UserInfo />} />
      </Routes>
      <div className={isDarkMode ? "dark" : ""}>
        <Routes>
          <Route
            path="/dashboard"
            element={
              <Dashboard
                isDarkMode={isDarkMode}
                toggleTheme={toggleTheme}
                initialNewSave={dashboardState?.newSave}
              />
            }
          />
          <Route
            path="/project"
            element={
              <CodeEditorPage
                isDarkMode={isDarkMode}
                toggleTheme={toggleTheme}
              />
            }
          />
        </Routes>
      </div>
    </>
  );
};

export default AppRoutes;
