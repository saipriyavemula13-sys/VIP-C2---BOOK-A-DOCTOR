import api from './api';

const register = (payload) => api.post('/auth/register', payload);
const login = (payload) => api.post('/auth/login', payload);
const getProfile = () => api.get('/auth/profile');
const updateProfile = (payload) => api.put('/auth/profile', payload);
const getLocalToken = () => localStorage.getItem('bookadoctor-token') || '';

export { register, login, getProfile, updateProfile, getLocalToken };
