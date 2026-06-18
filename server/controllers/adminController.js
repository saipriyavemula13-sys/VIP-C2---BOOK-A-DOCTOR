const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');

const getDashboardStats = async (req, res) => {
  const totalUsers = await User.countDocuments({ role: 'patient' });
  const totalDoctors = await Doctor.countDocuments();
  const totalAppointments = await Appointment.countDocuments();
  const pendingDoctors = await Doctor.countDocuments({ approved: false });

  res.json({ totalUsers, totalDoctors, totalAppointments, pendingDoctors });
};

const listUsers = async (req, res) => {
  const users = await User.find({ role: 'patient' }).sort({ createdAt: -1 });
  res.json(users);
};

const listDoctorsForAdmin = async (req, res) => {
  const doctors = await Doctor.find().sort({ createdAt: -1 });
  res.json(doctors);
};

const approveDoctor = async (req, res) => {
  const doctor = await Doctor.findById(req.params.id);
  if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
  doctor.approved = true;
  await doctor.save();
  res.json({ message: 'Doctor approved', doctor });
};

const rejectDoctor = async (req, res) => {
  const doctor = await Doctor.findById(req.params.id);
  if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
  doctor.approved = false;
  await doctor.save();
  res.json({ message: 'Doctor rejected', doctor });
};

const manageAppointments = async (req, res) => {
  const appointments = await Appointment.find()
    .populate('patientId', 'name email')
    .populate('doctorId', 'name specialization');
  res.json(appointments);
};

module.exports = { getDashboardStats, listUsers, listDoctorsForAdmin, approveDoctor, rejectDoctor, manageAppointments };
