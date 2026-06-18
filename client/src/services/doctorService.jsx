import api from './api';

const fetchDoctors = (query = {}) => {
  const params = new URLSearchParams(query).toString();
  return api.get(`/doctors${params ? `?${params}` : ''}`);
};

const getDoctor = (id) => api.get(`/doctors/${id}`);
const createDoctorProfile = (formData) => api.post('/doctors', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
const updateDoctorProfile = (id, formData) => api.put(`/doctors/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });

export { fetchDoctors, getDoctor, createDoctorProfile, updateDoctorProfile };
