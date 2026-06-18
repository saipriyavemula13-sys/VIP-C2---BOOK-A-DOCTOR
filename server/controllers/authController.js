const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const Doctor = require('../models/Doctor');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

const registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { name, email, password, phone, role } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) return res.status(400).json({ message: 'Email already registered' });

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashedPassword, phone, role });

  if (role === 'doctor') {
    await Doctor.create({
      name,
      email,
      phone,
      specialization: req.body.specialization || 'General Medicine',
      qualification: req.body.qualification || '',
      hospital: req.body.hospital || '',
      consultationFee: req.body.consultationFee || 0,
    });
  }

  res.status(201).json({
    message: 'Registration successful',
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const normalizedEmail = email ? email.trim().toLowerCase() : '';
  const user = await User.findOne({ email: normalizedEmail });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

  res.json({
    token: generateToken(user._id),
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
};

const getProfile = async (req, res) => {
  const user = await User.findById(req.user._id).select('-password').lean();
  if (!user) return res.status(404).json({ message: 'User not found' });

  if (user.role === 'doctor') {
    const doctor = await Doctor.findOne({ email: user.email }).lean();
    if (doctor) {
      return res.json({
        ...user,
        specialization: doctor.specialization,
        experience: doctor.experience,
        qualification: doctor.qualification,
        hospital: doctor.hospital,
        consultationFee: doctor.consultationFee,
        approved: doctor.approved,
        profileImage: doctor.profileImage,
        phone: doctor.phone || user.phone,
      });
    }
  }

  res.json(user);
};

const updateProfile = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  const { name, phone, specialization, experience, qualification, hospital, consultationFee } = req.body;
  user.name = name || user.name;
  user.phone = phone || user.phone;
  await user.save();

  let mergedProfile = user.toObject();

  if (user.role === 'doctor') {
    const doctor = await Doctor.findOne({ email: user.email });
    if (doctor) {
      doctor.name = name || doctor.name;
      doctor.phone = phone || doctor.phone;
      doctor.specialization = specialization || doctor.specialization;
      doctor.experience = experience || doctor.experience;
      doctor.qualification = qualification || doctor.qualification;
      doctor.hospital = hospital || doctor.hospital;
      doctor.consultationFee = consultationFee || doctor.consultationFee;
      await doctor.save();

      mergedProfile = {
        ...mergedProfile,
        specialization: doctor.specialization,
        experience: doctor.experience,
        qualification: doctor.qualification,
        hospital: doctor.hospital,
        consultationFee: doctor.consultationFee,
        approved: doctor.approved,
        profileImage: doctor.profileImage,
      };
    }
  }

  res.json({ message: 'Profile updated', user: mergedProfile });
};

module.exports = { registerUser, loginUser, getProfile, updateProfile };
