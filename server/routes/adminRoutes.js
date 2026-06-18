const express = require('express');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const { getDashboardStats, listUsers, listDoctorsForAdmin, approveDoctor, rejectDoctor, manageAppointments } = require('../controllers/adminController');

const router = express.Router();

router.use(protect, authorizeRoles('admin'));
router.get('/stats', getDashboardStats);
router.get('/users', listUsers);
router.get('/doctors', listDoctorsForAdmin);
router.put('/doctors/:id/approve', approveDoctor);
router.put('/doctors/:id/reject', rejectDoctor);
router.get('/appointments', manageAppointments);

module.exports = router;
