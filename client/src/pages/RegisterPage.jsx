import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { register } from '../services/authService';

const RegisterPage = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', role: 'patient' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await register(form);
      toast.success('Account registered successfully');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-7">
        <div className="card shadow-sm">
          <div className="card-body">
            <h3 className="card-title mb-4">Register</h3>
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-6"><label className="form-label">Name</label><input type="text" name="name" className="form-control" value={form.name} onChange={handleChange} required /></div>
                <div className="col-md-6"><label className="form-label">Phone</label><input type="tel" name="phone" className="form-control" value={form.phone} onChange={handleChange} /></div>
              </div>
              <div className="mt-3"><label className="form-label">Email</label><input type="email" name="email" className="form-control" value={form.email} onChange={handleChange} required /></div>
              <div className="mt-3"><label className="form-label">Password</label><input type="password" name="password" className="form-control" value={form.password} onChange={handleChange} required /></div>
              <div className="mt-3"><label className="form-label">Role</label><select name="role" className="form-select" value={form.role} onChange={handleChange}><option value="patient">Patient</option><option value="doctor">Doctor</option></select></div>
              <button className="btn btn-primary mt-4" disabled={loading}>{loading ? 'Creating account...' : 'Register'}</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
