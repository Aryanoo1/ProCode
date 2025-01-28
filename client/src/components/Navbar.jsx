import React from "react";
import { Avatar } from "@mui/material";
import styles from "../css/navbar.module.css";
import { RiLogoutCircleLine } from "react-icons/ri";
import { MdOutlineLightMode, MdOutlineDarkMode } from "react-icons/md";
import Cookies from "js-cookie";

const Navbar = ({ toggleTheme, isDarkMode, userName, userImage }) => {
  const apiUrl = import.meta.env.VITE_API_URL;

  const onLogout = () => {
    Cookies.remove("sessionData", { path: "/" });
    Cookies.remove("sessionId", { path: "/" });
    localStorage.clear();
    window.open(`${apiUrl}/auth/logout`, "_self");
  };

  return (
    <div
      className={`${styles["navbar-box"]} ${isDarkMode ? styles["dark"] : ""}`}
    >
      <div className={styles["left-section"]}>
        <Avatar
          alt={userName}
          src={userImage}
          className={`${styles["avatar"]}`}
        />
        <span className={styles["user-name"]}>@{userName}</span>
      </div>

      <div className={styles["center-section"]}>
        <h3 className={styles["app-title"]}>ProCode</h3>
      </div>

      <div className={styles["right-section"]}>
        <button onClick={toggleTheme} className={styles["theme-toggle"]}>
          {isDarkMode ? (
            <MdOutlineLightMode
              className={styles["theme-icon"]}
              title="Change to Light Mode"
            />
          ) : (
            <MdOutlineDarkMode
              className={styles["theme-icon"]}
              title="Change to Dark Mode"
            />
          )}
        </button>
        <RiLogoutCircleLine
          onClick={onLogout}
          className={styles["logout-icon"]}
          title="Logout"
        />
      </div>
    </div>
  );
};

export default Navbar;
