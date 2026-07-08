const { validationResult } = require('express-validator');
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');

const bookAppointment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const appointment = await Appointment.create({
    patientId: req.user._id,
    doctorId: req.body.doctorId,
    appointmentDate: req.body.appointmentDate,
    appointmentTime: req.body.appointmentTime,
    symptoms: req.body.symptoms,
    uploadedReports: req.body.uploadedReports || [],
    status: 'pending',
  });

  res.status(201).json({ message: 'Appointment requested', appointment });
};

const getAppointments = async (req, res) => {
  const user = req.user;
  let query = {};
  if (user.role === 'patient') query.patientId = user._id;
  if (user.role === 'doctor') {
    const doctor = await Doctor.findOne({ email: user.email });
    if (!doctor) return res.status(404).json({ message: 'Doctor profile not found' });
    query.doctorId = doctor._id;
  }
  if (user.role === 'admin' && req.query.userId) query.patientId = req.query.userId;
  const appointments = await Appointment.find(query)
    .populate('patientId', 'name email phone')
    .populate('doctorId', 'name specialization hospital consultationFee')
    .sort({ appointmentDate: -1 });
  res.json(appointments);
};

const updateAppointment = async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);
  if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

  if (req.user.role === 'patient' && !appointment.patientId.equals(req.user._id)) {
    return res.status(403).json({ message: 'You cannot modify this appointment' });
  }

  if (req.user.role === 'doctor') {
    const doctor = await Doctor.findOne({ email: req.user.email });
    if (!doctor || !appointment.doctorId.equals(doctor._id)) {
      return res.status(403).json({ message: 'You cannot manage this appointment' });
    }
  }

  if (req.body.status) appointment.status = req.body.status;
  if (req.body.appointmentDate && req.user.role === 'patient') appointment.appointmentDate = req.body.appointmentDate;
  if (req.body.appointmentTime && req.user.role === 'patient') appointment.appointmentTime = req.body.appointmentTime;
  if (req.body.prescription && req.user.role === 'doctor') appointment.prescription = req.body.prescription;
  if (req.body.uploadedReports && req.user.role === 'patient') appointment.uploadedReports = req.body.uploadedReports;

  await appointment.save();
  res.json({ message: 'Appointment updated', appointment });
};

const uploadReport = async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);
  if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
  if (!appointment.patientId.equals(req.user._id)) {
    return res.status(403).json({ message: 'You can only upload reports for your appointment' });
  }

  if (!req.file) return res.status(400).json({ message: 'Report file is required' });

  appointment.uploadedReports.push(`/uploads/${req.file.filename}`);
  await appointment.save();
  res.json({ message: 'Report uploaded successfully', appointment });
};

const deleteAppointment = async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);
  if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

  if (req.user.role === 'patient' && !appointment.patientId.equals(req.user._id)) {
    return res.status(403).json({ message: 'You cannot cancel this appointment' });
  }

  await Appointment.findByIdAndDelete(req.params.id);
  res.json({ message: 'Appointment cancelled' });
};

module.exports = { bookAppointment, getAppointments, updateAppointment, uploadReport, deleteAppointment };
