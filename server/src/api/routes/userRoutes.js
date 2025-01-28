import express from "express";
import { getUsers, userDetails } from "../controllers/userController.js";

const router = express.Router();

router.get("/", getUsers);
router.get("/user-details", userDetails);
export default router;
