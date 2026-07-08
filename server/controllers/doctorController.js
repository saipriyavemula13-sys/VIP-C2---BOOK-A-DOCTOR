const { validationResult } = require('express-validator');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');

const listDoctors = async (req, res) => {
  const query = {};
  if (req.query.specialization) query.specialization = req.query.specialization;
  if (req.query.search) query.name = { $regex: req.query.search, $options: 'i' };
  const doctors = await Doctor.find(query).sort({ createdAt: -1 });
  res.json(doctors);
};

const getDoctor = async (req, res) => {
  const doctor = await Doctor.findById(req.params.id);
  if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
  res.json(doctor);
};

const createDoctorProfile = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const doctor = new Doctor({
    name: req.body.name,
    email: req.body.email,
    specialization: req.body.specialization,
    experience: req.body.experience,
    qualification: req.body.qualification,
    hospital: req.body.hospital,
    consultationFee: req.body.consultationFee,
    availability: req.body.availability || [],
    profileImage: req.file ? `/uploads/${req.file.filename}` : '',
  });
  await doctor.save();
  res.status(201).json(doctor);
};

const updateDoctorProfile = async (req, res) => {
  const doctor = await Doctor.findById(req.params.id);
  if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

  doctor.name = req.body.name || doctor.name;
  doctor.specialization = req.body.specialization || doctor.specialization;
  doctor.experience = req.body.experience || doctor.experience;
  doctor.qualification = req.body.qualification || doctor.qualification;
  doctor.hospital = req.body.hospital || doctor.hospital;
  doctor.consultationFee = req.body.consultationFee || doctor.consultationFee;
  if (req.file) doctor.profileImage = `/uploads/${req.file.filename}`;
  if (req.body.availability) doctor.availability = req.body.availability;

  await doctor.save();
  res.json({ message: 'Doctor profile updated', doctor });
};

const deleteDoctorProfile = async (req, res) => {
  const doctor = await Doctor.findById(req.params.id);
  if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
  await doctor.remove();
  await Appointment.deleteMany({ doctorId: doctor._id });
  res.json({ message: 'Doctor profile deleted' });
};

const doctorDashboard = async (req, res) => {
  const doctor = await Doctor.findOne({ email: req.user.email });
  if (!doctor) return res.status(404).json({ message: 'Doctor profile not found' });

  const appointments = await Appointment.find({ doctorId: doctor._id })
    .sort({ appointmentDate: 1 })
    .populate('patientId', 'name email phone');
  res.json({ doctor, appointments });
};

module.exports = { listDoctors, getDoctor, createDoctorProfile, updateDoctorProfile, deleteDoctorProfile, doctorDashboard };
