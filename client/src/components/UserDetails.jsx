import React from "react";
import { FaUsersViewfinder } from "react-icons/fa6";
import styles from "../css/userdetails.module.css";
import Cookies from "js-cookie";

const UserDetails = ({ setUserWindow, isDarkMode }) => {
  const userString = Cookies.get("sessionData");
  let user = null;
  try {
    user = userString ? JSON.parse(userString) : null;
  } catch (error) {
    console.error("Error parsing user data:", error);
  }

  if (!user) {
    return null;
  }

  const { displayName, username, user_type, company, institution, image } =
    user;

  return (
    <div className={`${styles.userDetails} ${isDarkMode ? styles.dark : ""}`}>
      <div className={styles["findIconContainer"]}>
        <FaUsersViewfinder
          className={styles["findIcon"]}
          onClick={() => setUserWindow(false)}
          title="Find Users"
        />
      </div>
      <div className={styles.imageContainer}>
        {image ? (
          <img
            src={image || "/placeholder.svg"}
            alt={displayName}
            className={styles.userImage}
          />
        ) : (
          <div className={styles.placeholderImage}>
            {displayName?.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      <div className={styles.userInfo}>
        <h2 className={styles.name}>{displayName || "Name Not Available"}</h2>
        <p className={styles.username}>@{username || "username"}</p>
        <p className={styles.profession}>
          {!user_type
            ? "Profession Not Available"
            : user_type === "working_professional"
            ? "Professional"
            : "Student"}
        </p>
        {company ? (
          <p className={styles.company}>{company}</p>
        ) : institution ? (
          <p className={styles.institution}>{institution}</p>
        ) : null}
      </div>
    </div>
  );
};

export default UserDetails;
