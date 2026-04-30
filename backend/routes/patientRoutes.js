const express = require("express");
const router = express.Router();
const patientController = require("../controllers/patientController");

router.post("/add-patient", patientController.addPatient);
router.get("/patients", patientController.getPatients);
router.delete("/patients/:id", patientController.deletePatient);

module.exports = router;
