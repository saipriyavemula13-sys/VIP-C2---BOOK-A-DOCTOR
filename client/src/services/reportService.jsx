import api from './api';

const uploadReport = (appointmentId, formData) => api.post(`/appointments/${appointmentId}/reports`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });

export { uploadReport };
