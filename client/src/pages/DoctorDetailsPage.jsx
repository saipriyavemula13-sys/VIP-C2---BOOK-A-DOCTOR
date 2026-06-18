import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getDoctor } from '../services/doctorService';
import api from '../services/api';
import Spinner from '../components/Spinner';

const DoctorDetailsPage = () => {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [appointment, setAppointment] = useState({ appointmentDate: '', appointmentTime: '', symptoms: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadDoctor = async () => {
      try {
        const { data } = await getDoctor(id);
        setDoctor(data);
      } catch (error) {
        toast.error('Doctor profile could not be loaded');
      } finally {
        setLoading(false);
      }
    };
    loadDoctor();
  }, [id]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setAppointment((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      await api.post('/appointments', { ...appointment, doctorId: id });
      toast.success('Appointment requested successfully');
      setAppointment({ appointmentDate: '', appointmentTime: '', symptoms: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not book appointment');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner />;
  if (!doctor) return <p>Doctor not found.</p>;

  return (
    <div className="row gy-4">
      <div className="col-lg-7">
        <div className="card doctor-profile-card shadow-sm p-4">
          <div className="d-flex flex-column flex-md-row align-items-center gap-4 mb-4">
            <img src={doctor.profileImage || 'https://via.placeholder.com/140'} alt={doctor.name} className="doctor-avatar rounded-circle" />
            <div>
              <h2 className="mb-1">Dr. {doctor.name}</h2>
              <p className="text-primary mb-2">{doctor.specialization || 'General Medicine'}</p>
              <div className="doctor-badges mb-2">
                <span className="badge bg-success">{doctor.approved ? 'Approved' : 'Pending'}</span>
                <span className="badge bg-secondary">{doctor.experience || 0} yrs exp</span>
              </div>
              <p className="mb-1"><strong>Hospital:</strong> {doctor.hospital || 'N/A'}</p>
              <p className="mb-0"><strong>Fee:</strong> ${doctor.consultationFee || 0}</p>
            </div>
          </div>

          <div className="row gy-3 doctor-detail-grid">
            <div className="col-sm-6">
              <div className="doctor-detail-item">
                <span className="detail-label">Qualification</span>
                <p>{doctor.qualification || 'Not provided'}</p>
              </div>
            </div>
            <div className="col-sm-6">
              <div className="doctor-detail-item">
                <span className="detail-label">Approved</span>
                <p>{doctor.approved ? 'Yes' : 'Pending'}</p>
              </div>
            </div>
            <div className="col-sm-6">
              <div className="doctor-detail-item">
                <span className="detail-label">Experience</span>
                <p>{doctor.experience || 0} years</p>
              </div>
            </div>
            <div className="col-sm-6">
              <div className="doctor-detail-item">
                <span className="detail-label">Available slots</span>
                <p>{doctor.availability?.length ? doctor.availability.length : 'Not set'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="col-lg-5">
        <div className="card appointment-card shadow-sm p-4">
          <h4 className="mb-3">Book Appointment</h4>
          <p className="text-muted">Request a visit with Dr. {doctor.name}. We’ll notify you once the doctor confirms the booking.</p>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Date</label>
              <input type="date" name="appointmentDate" className="form-control" value={appointment.appointmentDate} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Time</label>
              <input type="time" name="appointmentTime" className="form-control" value={appointment.appointmentTime} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Symptoms</label>
              <textarea name="symptoms" className="form-control" value={appointment.symptoms} onChange={handleChange} rows="4" required />
            </div>
            <button className="btn btn-primary w-100" disabled={saving}>{saving ? 'Requesting...' : 'Request Appointment'}</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetailsPage;
