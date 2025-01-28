import express from "express";
import cors from "cors";
import session from "express-session";
import MongoStore from "connect-mongo";
import dotenv from "dotenv";
import passport from "./src/middleware/passport.js";
import dbConnect from "./config/db.js";
import router from "./src/api/routes/authRoutes.js";
import codeRoutes from "./src/api/routes/codeRoutes.js";
import projectRoutes from "./src/api/routes/projectRoutes.js";
import userRoutes from "./src/api/routes/userRoutes.js";
import activityRoutes from "./src/api/routes/activityRoutes.js";

dotenv.config();

const app = express();
dbConnect();

app.use(
  cors({
    origin: process.env.FRONTEND_URI,
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

app.use(express.json());

// app.set("trust proxy", 1); // Trust the first proxy
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      touchAfter: 24 * 3600,
    }),
    cookie: {
      secure: process.env.NODE_ENV === "production",  // Secure cookies only in production
      httpOnly: true,
      sameSite: "lax",
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", router);

app.use("/api/code", codeRoutes);

app.use("/api/projects", projectRoutes);

app.use("/api/users", userRoutes);

app.use("/api/activity", activityRoutes);

const PORT = process.env.PORT || 6060;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
