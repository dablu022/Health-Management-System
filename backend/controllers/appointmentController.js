const db = require("../config/db");

exports.bookAppointment = (req, res) => {
    const { patient_id, doctor_id, appointment_date } = req.body;
    const patientId = Number(patient_id);
    const doctorId = Number(doctor_id);

    if (!Number.isInteger(patientId) || !Number.isInteger(doctorId) || !appointment_date) {
        return res.status(400).json({ error: "patient_id, doctor_id and appointment_date are required" });
    }

    const sql = "INSERT INTO Appointments (patient_id, doctor_id, appointment_date) VALUES (?, ?, ?)";
    db.query(sql, [patientId, doctorId, appointment_date], (err, result) => {
        if (err) {
            console.error("Database query failed:", err);
            return res.status(500).json({ error: "Database operation failed" });
        }
        res.status(201).json({ message: "Appointment booked", id: result.insertId });
    });
};

exports.getAppointments = (req, res) => {
    const sql = `
    SELECT p.name AS patient, d.name AS doctor, a.appointment_date
    FROM Appointments a
    JOIN Patients p ON a.patient_id = p.patient_id
    JOIN Doctors d ON a.doctor_id = d.doctor_id
    `;

    db.query(sql, (err, result) => {
        if (err) {
            console.error("Database query failed:", err);
            return res.status(500).json({ error: "Database operation failed" });
        }
        res.json(result);
    });
};
