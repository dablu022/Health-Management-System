const db = require("../config/db");

exports.getDoctors = (req, res) => {
    db.query("SELECT doctor_id, name FROM Doctors ORDER BY name", (err, result) => {
        if (err) {
            console.error("Database query failed:", err);
            return res.status(500).json({ error: "Database operation failed" });
        }
        res.json(result);
    });
};
