import React from "react"
import styles from "../css/projectlist.module.css"

const ProjectList = ({ projects, onDelete, onOpen, isDarkMode }) => {
  return (
    <ul className={`${styles["list-group"]} ${isDarkMode ? styles["dark"] : ""}`}>
      {projects.map((project) => (
        <li key={project._id} className={styles["list-group-item"]}>
          <div className={styles["project-info"]}>
            <span className={styles["project-name"]}>{project.name}</span>
            <span className={styles["text-muted"]}>{project.language}</span>
          </div>
          <div className={styles.actions}>
            <button className={styles.viewcode} onClick={() => onOpen(project)}>
              View
            </button>
            <button className={styles.delete} onClick={() => onDelete(project._id)}>
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  )
}

export default ProjectList

