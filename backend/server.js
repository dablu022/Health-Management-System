require("dotenv").config();
const express = require("express");
const cors = require("cors");
const patientRoutes = require("./routes/patientRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// JSON Error Handling
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
        return res.status(400).json({ error: "Invalid JSON payload" });
    }
    next(err);
});

// Routes
app.use("/api", patientRoutes);
app.use("/api", doctorRoutes);
app.use("/api", appointmentRoutes);

// Root route for API health check
app.get("/", (req, res) => {
    res.json({ message: "Health Management System API is running" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});