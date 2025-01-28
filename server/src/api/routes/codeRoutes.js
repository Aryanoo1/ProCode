import express from "express";
import { saveProject, runCode } from "../controllers/codeController.js";

const router = express.Router();

router.post("/save", saveProject);
router.post("/run", runCode);

export default router;
