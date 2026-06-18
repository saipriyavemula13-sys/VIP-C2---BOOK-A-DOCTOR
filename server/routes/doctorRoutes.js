const express = require('express');
const { body } = require('express-validator');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const {
  listDoctors,
  getDoctor,
  createDoctorProfile,
  updateDoctorProfile,
  deleteDoctorProfile,
  doctorDashboard,
} = require('../controllers/doctorController');

const router = express.Router();

router.get('/', listDoctors);
router.get('/dashboard/me', protect, authorizeRoles('doctor'), doctorDashboard);
router.get('/:id', getDoctor);
router.post(
  '/',
  protect,
  authorizeRoles('doctor', 'admin'),
  upload.single('profileImage'),
  [
    body('name').notEmpty().withMessage('Doctor name is required'),
    body('specialization').notEmpty().withMessage('Specialization is required'),
  ],
  createDoctorProfile
);
router.put('/:id', protect, authorizeRoles('doctor', 'admin'), upload.single('profileImage'), updateDoctorProfile);
router.delete('/:id', protect, authorizeRoles('admin'), deleteDoctorProfile);

module.exports = router;
