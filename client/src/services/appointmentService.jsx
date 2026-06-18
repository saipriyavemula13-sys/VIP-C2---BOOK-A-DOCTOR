import api from './api';

const bookAppointment = (payload) => api.post('/appointments', payload);
const getAppointments = () => api.get('/appointments');
const updateAppointment = (id, payload) => api.put(`/appointments/${id}`, payload);
const cancelAppointment = (id) => api.delete(`/appointments/${id}`);

export { bookAppointment, getAppointments, updateAppointment, cancelAppointment };
