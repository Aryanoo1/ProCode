import React, { useState } from "react";
import { FaArrowLeft, FaSearch } from "react-icons/fa";
import styles from "../css/findusers.module.css";
import axios from "axios";

const FindUsers = ({ setUserWindow, isDarkMode }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [noUsersFound, setNoUsersFound] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL;

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(
        `${apiUrl}/api/users?name=${searchTerm}`
      );

      if (response.data.data && response.data.data.length > 0) {
        setUsers(response.data.data);
        setNoUsersFound(false);
        setSearchTerm("");
      } else {
        setUsers([]);
        setNoUsersFound(true);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([""]);
      setNoUsersFound(true);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div
      className={`${styles["main-friends-container"]} ${
        isDarkMode ? styles.dark : ""
      }`}
    >
      <div className={styles["header-container"]}>
        <h3>Find Users</h3>
        <FaArrowLeft
          onClick={() => setUserWindow(true)}
          className={styles["search-bar-button"]}
          title="Go Back"
        />
      </div>
      <form onSubmit={handleSearch} className={styles["search-bar"]}>
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <FaSearch
          onClick={handleSearch}
          className={styles["search-bar-button"]}
          title="Search"
        />
      </form>
      <div className={styles["results"]}>
        {noUsersFound ? (
          <div
            style={{
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <p>No users found.</p>
          </div>
        ) : users.length > 0 ? (
          <div className={styles["result-items"]}>
            {users.map((user) => (
              <div key={user.id} className={styles["list-item"]}>
                <img
                  src={user.image || "https://via.placeholder.com/50"}
                  alt={user.displayName}
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                  }}
                />
                <div className={styles["list-item-info"]}>
                  <span style={{ fontSize: "1.3rem" }}>{user.displayName}</span>
                  <span style={{ fontSize: "0.8rem" }}>@{user.username}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            style={{
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <p>Search Users</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FindUsers;
