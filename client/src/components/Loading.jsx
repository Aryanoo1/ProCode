import React from "react";
import { CircularProgress, Box, Typography } from "@mui/material";
import styles from "../css/loading.module.css";

const Loading = ({ isDarkMode }) => {
  return (
    <Box
      className={`${styles.loadingContainer} ${isDarkMode ? styles.dark : ""}`}
    >
      <CircularProgress size={60} thickness={4} />
      <Typography variant="h6" className={styles.loadingText}>
        Loading...
      </Typography>
    </Box>
  );
};

export default Loading;
