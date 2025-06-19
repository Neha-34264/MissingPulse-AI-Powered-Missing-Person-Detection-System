const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectToMongo = require("./db");
const authRoutes = require("./routes/auth");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware setup (only once)
app.use(express.json()); // This is enough to parse JSON requests
app.use(bodyParser.urlencoded({ extended: true })); // For URL encoded data
app.use(cors()); // Allow Cross-Origin requests

// Routes
app.use("/api/auth", authRoutes); // Authentication routes
app.use("/api/missingpeople", require("./routes/missing")); // Missing people routes
app.use("/api/foundlocation", require("./routes/location")); // Location routes

// Connect to MongoDB and start the server after successful connection
connectToMongo()
  .then(() => {
    console.log("MongoDB connected");
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("Error during MongoDB connection:", err);
  });
