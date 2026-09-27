const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

const env = require("./config/env");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const eventRoutes = require("./routes/eventRoutes");
const trackRoutes = require("./routes/trackRoutes");
const prizeRoutes = require("./routes/prizeRoutes");
const teamRoutes = require("./routes/teamRoutes");
const projectRoutes = require("./routes/projectRoutes");
const judgeRoutes = require("./routes/judgeRoutes");
const rubricRoutes = require("./routes/rubricRoutes");
const scoreRoutes = require("./routes/scoreRoutes");
const normalizationRoutes = require("./routes/normalizationRoutes");
const commentRoutes = require("./routes/commentRoutes");
const voteRoutes = require("./routes/voteRoutes");
const auditRoutes = require("./routes/auditRoutes");
const certificateRoutes = require("./routes/certificateRoutes");

// NEW - Certificate PDF Download
const certificateDownloadRoutes = require("./routes/certificateDownloadRoutes");

const app = express();

/* =========================
   DATABASE
========================= */

connectDB();

/* =========================
   MIDDLEWARE
========================= */

app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  })
);

app.use(
  express.json({
    limit: "10mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(cookieParser());

/* =========================
   STATIC FILES
========================= */

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

/* =========================
   ROOT ROUTE
========================= */

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "DOGFOOD API is running",
  });
});

/* =========================
   HEALTH CHECK
========================= */

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "DOGFOOD backend is healthy",
    timestamp: new Date().toISOString(),
  });
});

/* =========================
   API ROUTES
========================= */

/* Module 1 - Authentication */
app.use("/api/auth", authRoutes);

/* Module 2 - User Management */
app.use("/api/users", userRoutes);

/* Module 3 - Event Management */
app.use("/api/events", eventRoutes);

/* Module 4 - Tracks */
app.use("/api/tracks", trackRoutes);

/* Module 4 - Prizes */
app.use("/api/prizes", prizeRoutes);

/* Module 5 - Teams */
app.use("/api/teams", teamRoutes);

/* Module 6 - Projects */
app.use("/api/projects", projectRoutes);

/* Module 7 - Judges */
app.use("/api/judges", judgeRoutes);

/* Module 8 - Rubrics */
app.use("/api/rubrics", rubricRoutes);

/* Module 9 - Scores */
app.use("/api/scores", scoreRoutes);

/* Module 10 - Score Normalization */
app.use("/api/normalization", normalizationRoutes);

/* Module 11 - Comments */
app.use("/api/comments", commentRoutes);

/* Module 12 - Voting */
app.use("/api/votes", voteRoutes);

/* Module 13 - Audit Logs */
app.use("/api/audit", auditRoutes);

/* Module 14 - Certificates */
app.use("/api/certificates", certificateRoutes);

/* Module 15 - Certificate PDF Download */
app.use(
  "/api/certificate-downloads",
  certificateDownloadRoutes
);

/* =========================
   404 ROUTE
========================= */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

/* =========================
   GLOBAL ERROR HANDLER
========================= */

app.use((err, req, res, next) => {
  console.error("=================================");
  console.error("DOGFOOD BACKEND ERROR");
  console.error("=================================");
  console.error(err);

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    ...(env.NODE_ENV === "development" && {
      stack: err.stack,
    }),
  });
});

/* =========================
   SERVER
========================= */

const PORT = env.PORT || 5000;

app.listen(PORT, () => {
  console.log("=================================");
  console.log("DOGFOOD BACKEND");
  console.log("=================================");
  console.log(`Server running on port ${PORT}`);
  console.log(`API: http://localhost:${PORT}`);
  console.log(`Health: http://localhost:${PORT}/api/health`);
  console.log("Certificate PDF Download:");
  console.log(
    `http://localhost:${PORT}/api/certificate-downloads/:certificateId/download`
  );
  console.log("=================================");
});