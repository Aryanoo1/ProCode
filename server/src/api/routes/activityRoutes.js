import express from "express";
import UserActivity from "../../../models/UserActivity.js";

const router = express.Router();

router.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const activity = await UserActivity.find({ userId });

    if (!activity || activity.length === 0) {
      return res
        .status(404)
        .json({ message: "No activity found for the past year." });
    }

    const result = activity.map((item) => ({
      date: new Date(item.date).toISOString().split("T")[0],
      runs: item.runs,
    }));

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch activity data", error });
  }
});

router.post("/:userId", async (req, res) => {
  const { userId } = req.params;
  const { date, runs } = req.body;

  try {
    const normalizedDate = new Date(date);
    normalizedDate.setUTCHours(0, 0, 0, 0)

    const activity = await UserActivity.findOneAndUpdate(
      { userId, date: normalizedDate },
      { $inc: { runs }, $setOnInsert: { date: normalizedDate } },
      { upsert: true, new: true }
    );

    res.status(200).json(activity);
  } catch (error) {
    res.status(500).json({ message: "Failed to update activity data", error });
  }
});

export default router;
