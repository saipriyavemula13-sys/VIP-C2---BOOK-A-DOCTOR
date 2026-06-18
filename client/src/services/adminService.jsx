import api from './api';

const fetchUsers = () => api.get('/admin/users');
const fetchAdminAppointments = () => api.get('/admin/appointments');
const fetchDoctorApprovals = () => api.get('/admin/doctors');
const approveDoctor = (id) => api.put(`/admin/doctors/${id}/approve`);
const rejectDoctor = (id) => api.put(`/admin/doctors/${id}/reject`);

export { fetchUsers, fetchAdminAppointments, fetchDoctorApprovals, approveDoctor, rejectDoctor };
