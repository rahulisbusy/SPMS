// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

// Routes
const studentRoutes = require("./routes/studentRoutes");
app.use("/api/students", studentRoutes);
const codeforcesRoutes = require("./routes/codeforcesRoutes");
app.use("/api/codeforces", codeforcesRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("MongoDB connected");
  app.listen(process.env.PORT , () =>
    console.log(`Server running on port ${process.env.PORT}`)

  );
  require("./cron/cfSync");
})
.catch((err) => console.error("MongoDB connection error:", err));
