const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { sequelize } = require("./src/models");

const app = express();

const normalizeOrigin = (origin) => origin.replace(/\/+$/, "");

const parseCorsOrigins = (value) => {
  if (!value) {
    return true;
  }

  const allowedOrigins = value
    .split(",")
    .map((origin) => normalizeOrigin(origin.trim()))
    .filter(Boolean);

  if (!allowedOrigins.length) {
    return true;
  }

  return (origin, callback) => {
    const normalizedOrigin = origin ? normalizeOrigin(origin) : origin;

    if (!normalizedOrigin || allowedOrigins.includes(normalizedOrigin)) {
      return callback(null, true);
    }

    return callback(new Error("CORS origin not allowed"));
  };
};

app.use(
  cors({
    origin: parseCorsOrigins(process.env.CORS_ORIGIN),
    credentials: true,
  })
);
app.use(express.json({ limit: process.env.JSON_LIMIT || "1mb" }));
app.use(express.urlencoded({ extended: true }));

const authRoutes = require("./src/routes/authRoutes");
const patientRoutes = require("./src/routes/patientRoutes");
const primaryAssessmentRoutes = require("./src/routes/primaryAssessmentRoutes");
const doctorNotesRoutes = require("./src/routes/doctorNotesRoutes");
const fileRoutes = require("./src/routes/fileRoutes");
const pointOfCareRoutes = require("./src/routes/pointOfCareRoutes");
const dispositionRoutes = require("./src/routes/dispositionRoutes");
const investigationRoutes = require("./src/routes/investigationRoutes");
const treatmentDetailsRoutes = require("./src/routes/treatmentdetailsRoutes.js");
const vitalsRoutes = require("./src/routes/vitalsRoutes");
const InOutRoutes = require("./src/routes/InOutRoutes.js");
const handoverNotesRoutes = require("./src/routes/handoverNotesRoutes.js");
const consultationRoutes = require("./src/routes/consultationRoutes.js");
const diagnosisRoutes = require("./src/routes/diagnosisRoutes.js");
const encRoutes = require("./src/routes/encRoutes.js");
const doctorWorkflowRoutes = require("./src/routes/doctorWorkflowRoutes");

if (process.env.LOG_REQUESTS === "true") {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.originalUrl}`);
    next();
  });
}

app.get("/", (req, res) => {
  res.status(200).json({ message: "Triage backend is running" });
});

app.get("/api/health", async (req, res) => {
  try {
    await sequelize.authenticate();
    res.status(200).json({ status: "ok" });
  } catch (error) {
    console.error("Health check failed:", error);
    res.status(500).json({ status: "error" });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/patient", patientRoutes);
app.use("/api/primary-assessment", primaryAssessmentRoutes);
app.use("/api/templates", doctorNotesRoutes);
app.use("/api/poc-tests", pointOfCareRoutes);
app.use("/api/disposition", dispositionRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/investigation", investigationRoutes);
app.use("/api/treatment", treatmentDetailsRoutes);
app.use("/api/vitals", vitalsRoutes);
app.use("/api/inout", InOutRoutes);
app.use("/api/handover-notes", handoverNotesRoutes);
app.use("/api/ed-consultation", consultationRoutes);
app.use("/api/diagnosis", diagnosisRoutes);
app.use("/api", doctorWorkflowRoutes);

app.get("/api/test", async (req, res) => {
  res.status(200).json({ message: "API is working" });
});

app.use("/api/enc", encRoutes);

app.use((err, req, res, next) => {
  if (err?.message === "CORS origin not allowed") {
    return res.status(403).json({ error: err.message });
  }

  if (err?.name === "MulterError") {
    return res.status(400).json({ error: err.message });
  }

  if (err) {
    console.error("Unhandled error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }

  next();
});

module.exports = app;
