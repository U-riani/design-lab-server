require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");

const app = express();

/* ================================
   CORS CONFIG (clean + dynamic)
================================ */

const allowedOrigins = [
  "https://design-lab.ge",
  "https://www.design-lab.ge",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow tools like Postman or server-to-server
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, origin); // reflect exact origin
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Handle preflight explicitly
app.options("*", cors());

/* ================================
   MIDDLEWARES
================================ */

app.use(helmet());
app.use(morgan("combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ================================
   DATABASE
================================ */

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

/* ================================
   ROUTES
================================ */

app.use("/admin", require("./routes/adminRoutes"));
app.use("/api", require("./routes/newsRoutes"));
app.use("/api/aboutUs", require("./routes/aboutUsRoutes"));
app.use("/api/visit", require("./routes/visitRoutes"));
app.use("/api/heros", require("./routes/heroRoutes"));
app.use("/api/partners", require("./routes/partnersRoutes"));
app.use("/api/designers", require("./routes/designersRoutes"));
app.use("/api/payment", require("./routes/paymentRoutes"));

/* ================================
   HEALTH CHECK
================================ */

app.get("/", (req, res) => {
  res.json({ message: "Server is running" });
});

/* ================================
   ERROR HANDLER
================================ */

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || "Internal Server Error" });
});

/* ================================
   START SERVER
================================ */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

process.on("SIGTERM", () => {
  console.log("Server terminating");
});