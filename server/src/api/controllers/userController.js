import User from "../../../models/User.js";

export const getUsers = async (req, res) => {
  try {
    const { name } = req.query;

    if (!name) {
      return res.status(400).json({ error: "User name is required." });
    }

    const users = await User.find({ displayName: name });

    if (!users) {
      res.status(200).json({
        message: "No users found with the given name",
        data: [],
      });
    } else {
      return res.status(200).json({
        message: "Users found",
        data: users,
      });
    }
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ error: "Failed to fetch projects." });
  }
};
