const API = "http://localhost:3000/api";
let allPatients = [];
let allDoctors = [];

function setStatus(message, type = "") {
    const status = document.getElementById("status");
    status.textContent = message;
    status.className = `status ${type}`.trim();
}

async function requestJson(path, options = {}) {
    const response = await fetch(`${API}${path}`, options);

    let payload = null;
    try {
        payload = await response.json();
    } catch (_) {
        payload = null;
    }

    if (!response.ok) {
        const message = payload?.error || "Request failed";
        throw new Error(message);
    }

    return payload;
}

function clearForm() {
    document.getElementById("name").value = "";
    document.getElementById("age").value = "";
    document.getElementById("gender").value = "";
    document.getElementById("phone").value = "";
    document.getElementById("address").value = "";
    setStatus("Form cleared");
}

function renderEmpty(listId, message) {
    const list = document.getElementById(listId);
    list.innerHTML = `<li>${message}</li>`;
}

function renderPatients(data) {
    const list = document.getElementById("patients");
    list.innerHTML = "";

    if (!data.length) {
        renderEmpty("patients", "No patients found");
        return;
    }

    data.forEach(p => {
        list.innerHTML += `
            <li class="patient-row">
                <span>${p.name} (${p.age}) - ${p.gender}</span>
                <button class="danger" onclick="deletePatient(${p.patient_id}, '${p.name.replace(/'/g, "\\'")}')">Delete</button>
            </li>
        `;
    });
}

function filterPatients() {
    const query = document.getElementById("searchPatient").value.trim().toLowerCase();
    const filtered = allPatients.filter(p => p.name.toLowerCase().includes(query));
    renderPatients(filtered);
}

function populatePatientSelect() {
    const select = document.getElementById("appointmentPatient");
    if (!select) return;

    select.innerHTML = `<option value="">Select Patient</option>`;
    allPatients.forEach(p => {
        select.innerHTML += `<option value="${p.patient_id}">${p.name}</option>`;
    });
}

function populateDoctorSelect() {
    const select = document.getElementById("appointmentDoctor");
    if (!select) return;

    select.innerHTML = `<option value="">Select Doctor</option>`;
    allDoctors.forEach(d => {
        select.innerHTML += `<option value="${d.doctor_id}">${d.name}</option>`;
    });
}

async function refreshAll() {
    await Promise.all([loadPatients(), loadAppointments()]);
}

async function loadDoctors() {
    try {
        const data = await requestJson("/doctors");
        allDoctors = data;
        populateDoctorSelect();
    } catch (error) {
        setStatus(`Doctors: ${error.message}`, "error");
    }
}

function clearAppointmentForm() {
    document.getElementById("appointmentPatient").value = "";
    document.getElementById("appointmentDoctor").value = "";
    document.getElementById("appointmentDate").value = "";
    setStatus("Appointment form cleared");
}

async function bookAppointment() {
    const data = {
        patient_id: document.getElementById("appointmentPatient").value,
        doctor_id: document.getElementById("appointmentDoctor").value,
        appointment_date: document.getElementById("appointmentDate").value
    };

    try {
        setStatus("Booking appointment...");
        const response = await requestJson("/appointments", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data)
        });
        setStatus(response.message || "Appointment booked", "success");
        clearAppointmentForm();
        await loadAppointments();
    } catch (error) {
        setStatus(error.message, "error");
    }
}

async function deletePatient(patientId, patientName) {
    const confirmed = window.confirm(`Delete patient "${patientName}"?`);
    if (!confirmed) {
        return;
    }

    try {
        setStatus("Deleting patient...");
        const response = await requestJson(`/patients/${patientId}`, { method: "DELETE" });
        setStatus(response.message || "Patient deleted", "success");
        await refreshAll();
    } catch (error) {
        setStatus(error.message, "error");
    }
}

/* ADD PATIENT */
async function addPatient() {
    const data = {
        name: document.getElementById("name").value.trim(),
        age: document.getElementById("age").value.trim(),
        gender: document.getElementById("gender").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        address: document.getElementById("address").value.trim()
    };

    try {
        setStatus("Saving patient...");
        const response = await requestJson("/add-patient", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data)
        });
        clearForm();
        setStatus(response.message || "Patient added successfully", "success");
        await loadPatients();
    } catch (error) {
        setStatus(error.message, "error");
    }
}

/* LOAD PATIENTS */
async function loadPatients() {
    try {
        setStatus("Loading patients...");
        const data = await requestJson("/patients");
        allPatients = data;
        renderPatients(data);
        populatePatientSelect();
        setStatus(`Loaded ${data.length} patient(s)`, "success");
    } catch (error) {
        setStatus(error.message, "error");
        renderEmpty("patients", "Unable to load patients");
    }
}

/* LOAD APPOINTMENTS */
async function loadAppointments() {
    try {
        setStatus("Loading appointments...");
        const data = await requestJson("/appointments");
        const list = document.getElementById("appointments");
        list.innerHTML = "";

        if (!data.length) {
            renderEmpty("appointments", "No appointments found");
            setStatus("No appointments found");
            return;
        }

        data.forEach(a => {
            list.innerHTML += `<li>${a.patient} → ${a.doctor} (${a.appointment_date})</li>`;
        });
        setStatus(`Loaded ${data.length} appointment(s)`, "success");
    } catch (error) {
        setStatus(error.message, "error");
        renderEmpty("appointments", "Unable to load appointments");
    }
}

Promise.all([loadDoctors(), refreshAll()]);