import express from "express";
import { delteProject, getProjects } from "../controllers/projectController.js";

const router = express.Router();

router.get("/", getProjects);

router.delete("/delete", delteProject);
export default router;
