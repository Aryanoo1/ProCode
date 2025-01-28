import express from "express";
import passport from "../../middleware/passport.js";
import {
  authSuccess,
  loginUser,
  logout,
  registerUser,
  registerUserInfo,
} from "../controllers/authController.js";
import upload from "../../../config/multer.js";

const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google callback route with custom callback function
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: `${process.env.FRONTEND_URI}/login` }),
  (req, res) => {
    // If authentication is successful, redirect with user info
    // const userString = encodeURIComponent(JSON.stringify(req.user)); // Get the user info from req.user
    res.redirect(`${process.env.FRONTEND_URI}/userinfo?id=${req.user._id}`); // Redirect to /userinfo with user data
  }
);

router.get("/login/success", authSuccess);
router.get("/logout", logout);

router.post("/normal-register", upload.single("image"), registerUser);
router.post("/normal-login", loginUser);
router.post("/register-user-info", registerUserInfo);

export default router;
