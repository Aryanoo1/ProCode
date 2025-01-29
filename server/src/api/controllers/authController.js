import bcrypt from "bcrypt";
import User from "../../../models/User.js";
import dotenv from "dotenv";
dotenv.config();

export const authSuccess = (req, res) => {
  if (req.user) {
    res
      .status(200)
      .json({ message: "User logged in", success: true, user: req.user });
  } else {
    res.status(400).json({ message: "Not authorized" });
  }
};

export const logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);

    req.session.destroy((err) => {
      if (err) return next(err);

      res.clearCookie("connect.sid");
      res.redirect(process.env.FRONTEND_URI);
    });
  });
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const image = req.file?.path;

    if (!name || !email || !password || !image) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email is already registered!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      displayName: name,
      email,
      password: hashedPassword,
      image,
    });

    await newUser.save();

    res
      .status(201)
      .json({ message: "User registered successfully!", userId: newUser._id });
  } catch (error) {
    console.error("Error in registration:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password!" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res
        .status(401)
        .json({ message: "Invalid email or password!", success: false });
    }

    req.session.userId = user._id;

    const { password: _, googleId, ...userData } = user.toObject();
    res.status(200).json({
      message: "Login successful!",
      success: true,
      user: userData,
    });
  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const registerUserInfo = async (req, res) => {
  try {
    const { userId, username, user_type, institution, company } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    user.username = username;
    user.user_type = user_type;
    user.institution = institution;
    user.company = company;

    await user.save();

    req.session.userId = userId;

    const { password: _, googleId, ...userData } = user.toObject();

    res.status(200).json({
      message: "User information updated successfully!",
      success: true,
      user: userData,
    });
  } catch (error) {
    console.error("Error in registerUserInfo:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
