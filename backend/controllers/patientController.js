const db = require("../config/db");

const sendDbError = (res, err) => {
    console.error("Database query failed:", err);
    if (err && err.code === "ER_ROW_IS_REFERENCED_2") {
        return res.status(409).json({ error: "Cannot delete patient with existing appointments" });
    }
    return res.status(500).json({ error: "Database operation failed" });
};

exports.addPatient = (req, res) => {
    const { name, age, gender, phone, address } = req.body;
    if (!name || !age || !gender || !phone || !address) {
        return res.status(400).json({ error: "All fields are required" });
    }

    const sql = "INSERT INTO Patients (name, age, gender, phone, address) VALUES (?, ?, ?, ?, ?)";
    db.query(sql, [name, age, gender, phone, address], (err, result) => {
        if (err) return sendDbError(res, err);
        res.status(201).json({ message: "Patient Added", id: result.insertId });
    });
};

exports.getPatients = (req, res) => {
    db.query("SELECT * FROM Patients", (err, result) => {
        if (err) return sendDbError(res, err);
        res.json(result);
    });
};

exports.deletePatient = (req, res) => {
    const patientId = Number(req.params.id);
    if (!Number.isInteger(patientId) || patientId <= 0) {
        return res.status(400).json({ error: "Invalid patient id" });
    }

    db.query("DELETE FROM Patients WHERE patient_id = ?", [patientId], (err, result) => {
        if (err) return sendDbError(res, err);
        if (!result.affectedRows) {
            return res.status(404).json({ error: "Patient not found" });
        }
        res.json({ message: "Patient deleted" });
    });
};
