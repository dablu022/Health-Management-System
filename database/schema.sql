-- Create Database
CREATE DATABASE IF NOT EXISTS health_management_system;
USE health_management_system;

-- Patients Table
CREATE TABLE IF NOT EXISTS Patients (
    patient_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    age INT NOT NULL,
    gender ENUM('Male', 'Female', 'Other') NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Doctors Table
CREATE TABLE IF NOT EXISTS Doctors (
    doctor_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    specialization VARCHAR(255),
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Appointments Table
CREATE TABLE IF NOT EXISTS Appointments (
    appointment_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    doctor_id INT NOT NULL,
    appointment_date DATETIME NOT NULL,
    status ENUM('Scheduled', 'Completed', 'Cancelled') DEFAULT 'Scheduled',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES Patients(patient_id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES Doctors(doctor_id) ON DELETE CASCADE
);

-- Sample Data for Doctors
INSERT INTO Doctors (name, specialization) VALUES 
('Dr. Smith', 'Cardiology'),
('Dr. Johnson', 'Neurology'),
('Dr. Williams', 'Pediatrics'),
('Dr. Brown', 'Orthopedics');

-- Sample Data for Patients (Optional)
-- INSERT INTO Patients (name, age, gender, phone, address) VALUES 
-- ('John Doe', 30, 'Male', '1234567890', '123 Main St'),
-- ('Jane Doe', 25, 'Female', '0987654321', '456 Oak Ave');
