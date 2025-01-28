import React, { useState } from "react"
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, MenuItem, Select, Typography } from "@mui/material"
import { styled } from "@mui/material/styles"
import styles from "../css/newprojectmodal.module.css"

const StyledSelect = styled(Select)(({ theme }) => ({
  "&.MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: theme.palette.mode === "dark" ? "#4a5568" : theme.palette.grey[300],
    },
    "&:hover fieldset": {
      borderColor: theme.palette.mode === "dark" ? "#718096" : theme.palette.grey[400],
    },
    "&.Mui-focused fieldset": {
      borderColor: theme.palette.mode === "dark" ? "#4299e1" : theme.palette.primary.main,
    },
  },
}))

const NewProjectModal = ({ open, onClose, onCreate, isDarkMode }) => {
  const [language, setLanguage] = useState("")

  const handleCreate = () => {
    if (language) {
      onCreate(language)
      onClose()
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      className={`${styles.dialog} ${isDarkMode ? styles.dark : ""}`}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        elevation: 0,
        className: styles.dialogPaper,
      }}
    >
      <DialogTitle className={styles.dialogTitle}>
        <Typography variant="h6" component="h2">
          <div className={styles.heading}>Create New Project</div>
        </Typography>
      </DialogTitle>
      <DialogContent className={styles.dialogContent}>
        <StyledSelect
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          displayEmpty
          fullWidth
          className={styles.select}
          variant="outlined"
        >
          <MenuItem value="" disabled className={styles.menuItemPlaceholder}>
            <Typography variant="body2">Select Language</Typography>
          </MenuItem>
          <MenuItem value="Java" className={styles.menuItem}>
            Java
          </MenuItem>
          <MenuItem value="C++" className={styles.menuItem}>
            C++
          </MenuItem>
          <MenuItem value="C" className={styles.menuItem}>
            C
          </MenuItem>
          <MenuItem value="Python" className={styles.menuItem}>
            Python
          </MenuItem>
          <MenuItem value="Web" className={styles.menuItem}>
            Web (HTML, CSS, JavaScript)
          </MenuItem>
        </StyledSelect>
      </DialogContent>
      <DialogActions className={styles.dialogActions}>
        <div className={styles.actions}>
          <Button onClick={onClose} className={styles.cancelButton}>
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            variant="contained"
            disabled={!language}
            className={styles.createButton}
            disableElevation
          >
            Create
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  )
}

export default NewProjectModal

