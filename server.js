require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRoutes = require('./src/routes/auth');
const fetchRoutes = require('./src/routes/fetchData');
const profileRoutes = require('./src/routes/profile');

console.log("Starting server initialization...");

const app = express();

console.log("Express app created");

// Middleware
app.use(cors({
  origin: '*'
}));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/fetch", fetchRoutes);
app.use("/api/profile", profileRoutes);


app.get("/api/test", (req, res) => {
  res.status(200).send("test route working");
});

app.get("/", (req, res) => {
  res.send("Hello from the Backend!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

