require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes de base
app.use("/api/auth", require("./routes/r_auth"));
app.use("/api/users", require("./routes/r_users"));
app.use("/api/jobs", require("./routes/r_jobs"));
app.use("/api/applications", require("./routes/r_applications"));
app.use("/api/companies", require("./routes/r_companies"));

app.listen(PORT, () => {
  console.log(`🚀 Backend lancé sur http://localhost:${PORT}`);
});

const path = require("path");

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Servir le build React
app.use(express.static(path.join(__dirname, "../frontend/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
});
