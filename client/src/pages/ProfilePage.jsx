import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getProfile, updateProfile } from '../services/authService';
import Spinner from '../components/Spinner';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    specialization: '',
    experience: '',
    qualification: '',
    hospital: '',
    consultationFee: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data } = await getProfile();
        setProfile(data);
        setForm({
          name: data.name || '',
          phone: data.phone || '',
          specialization: data.specialization || '',
          experience: data.experience || '',
          qualification: data.qualification || '',
          hospital: data.hospital || '',
          consultationFee: data.consultationFee || '',
        });
      } catch (error) {
        toast.error('Unable to load profile');
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await updateProfile(form);
      setProfile(data.user);
      setForm({
        name: data.user.name || '',
        phone: data.user.phone || '',
        specialization: data.user.specialization || '',
        experience: data.user.experience || '',
        qualification: data.user.qualification || '',
        hospital: data.user.hospital || '',
        consultationFee: data.user.consultationFee || '',
      });
      toast.success('Profile updated');
    } catch (error) {
      toast.error('Could not update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner />;

  const quickLinks = profile.role === 'patient'
    ? [
        { label: 'My Appointments', to: '/patient/appointments' },
        { label: 'Upload Reports', to: '/patient/reports' },
      ]
    : profile.role === 'doctor'
      ? [
          { label: 'Doctor Appointments', to: '/doctor/appointments' },
          { label: 'Doctor Dashboard', to: '/doctor/dashboard' },
        ]
      : [
          { label: 'Manage Doctors', to: '/admin/doctors' },
          { label: 'Manage Users', to: '/admin/users' },
        ];

  return (
    <div className="row justify-content-center">
      <div className="col-xl-10">
        <div className="card profile-header-card shadow-sm mb-4 p-4">
          <div className="d-flex flex-column flex-md-row align-items-center gap-4">
            <div className="profile-avatar-large">{(profile.name || profile.email || 'U')[0].toUpperCase()}</div>
            <div className="flex-grow-1 text-center text-md-start">
              <h2 className="mb-1">{profile.name || 'User'}</h2>
              <p className="text-muted mb-2">{profile.role === 'doctor' ? 'Doctor Account' : profile.role === 'admin' ? 'Admin Account' : 'Patient Account'}</p>
              <div className="d-flex flex-column flex-sm-row justify-content-center justify-content-md-start gap-2 profile-action-buttons">
                {quickLinks.map((link) => (
                  <Link key={link.to} to={link.to} className="btn btn-primary btn-sm">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="profile-meta text-center text-md-end">
              <p className="mb-1"><strong>Email</strong></p>
              <p className="text-muted mb-3">{profile.email}</p>
              <p className="mb-1"><strong>Role</strong></p>
              <p className="text-muted mb-3">{profile.role}</p>
              <p className="mb-1"><strong>Phone</strong></p>
              <p className="text-muted">{profile.phone || 'Not added'}</p>
            </div>
          </div>
        </div>

        <div className="card shadow-sm p-4">
          <h4>Account details</h4>
          <p className="text-muted">Update your personal information and keep your account details fresh.</p>
          <form onSubmit={handleSubmit} className="profile-edit-form">
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Full name</label>
                <input type="text" className="form-control" name="name" value={form.name} onChange={handleChange} required />
              </div>
              <div className="col-md-6">
                <label className="form-label">Phone</label>
                <input type="tel" className="form-control" name="phone" value={form.phone} onChange={handleChange} />
              </div>
              {profile.role === 'doctor' && (
                <>
                  <div className="col-md-6">
                    <label className="form-label">Specialization</label>
                    <input type="text" className="form-control" name="specialization" value={form.specialization} onChange={handleChange} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Experience (years)</label>
                    <input type="number" min="0" className="form-control" name="experience" value={form.experience} onChange={handleChange} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Qualification</label>
                    <input type="text" className="form-control" name="qualification" value={form.qualification} onChange={handleChange} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Hospital</label>
                    <input type="text" className="form-control" name="hospital" value={form.hospital} onChange={handleChange} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Consultation Fee</label>
                    <input type="number" min="0" className="form-control" name="consultationFee" value={form.consultationFee} onChange={handleChange} />
                  </div>
                </>
              )}
            </div>
            <div className="mt-4">
              <button className="btn btn-primary" disabled={saving}>{saving ? 'Saving changes...' : 'Save changes'}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
