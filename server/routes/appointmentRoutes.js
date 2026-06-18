const express = require('express');
const { body } = require('express-validator');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const { bookAppointment, getAppointments, updateAppointment, uploadReport, deleteAppointment } = require('../controllers/appointmentController');

const router = express.Router();

router.post(
  '/',
  protect,
  [
    body('doctorId').notEmpty().withMessage('Doctor ID is required'),
    body('appointmentDate').notEmpty().withMessage('Appointment date is required'),
    body('appointmentTime').notEmpty().withMessage('Appointment time is required'),
  ],
  bookAppointment
);
router.get('/', protect, getAppointments);
router.put('/:id', protect, updateAppointment);
router.post('/:id/reports', protect, upload.single('report'), uploadReport);
router.delete('/:id', protect, deleteAppointment);

module.exports = router;
