import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import Spinner from '../components/Spinner';

const DoctorDashboard = () => {
  const [doctor, setDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const { data } = await api.get('/doctors/dashboard/me');
        setDoctor(data.doctor);
        setAppointments(data.appointments || []);
      } catch (error) {
        toast.error('Unable to load doctor dashboard');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const stats = useMemo(() => {
    const upcoming = appointments.filter((appointment) => appointment.status === 'confirmed' || appointment.status === 'pending').length;
    const completed = appointments.filter((appointment) => appointment.status === 'completed').length;
    const pending = appointments.filter((appointment) => appointment.status === 'pending').length;
    return { upcoming, completed, pending };
  }, [appointments]);

  const nextAppointment = useMemo(() => {
    const upcomingAppointments = appointments
      .filter((item) => item.status === 'confirmed' || item.status === 'pending')
      .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate));
    return upcomingAppointments[0];
  }, [appointments]);

  if (loading) return <Spinner />;

  return (
    <div className="dashboard-container">
      <div className="dashboard-hero card shadow-sm p-4 mb-4">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
          <div>
            <h2>Good day, Dr. {doctor?.name || 'Doctor'}</h2>
            <p className="text-muted mb-2">Your latest appointment summary and doctor insights appear below.</p>
            <div className="d-flex flex-wrap gap-2">
              <Link to="/doctor/appointments" className="btn btn-primary btn-sm">Manage Appointments</Link>
              <Link to="/profile" className="btn btn-outline-secondary btn-sm">Edit Profile</Link>
            </div>
          </div>
          <div className="dashboard-hero-meta text-end">
            <p className="mb-1"><strong>Approved:</strong> {doctor?.approved ? 'Yes' : 'No'}</p>
            <p className="mb-0"><strong>Specialization:</strong> {doctor?.specialization || 'General Medicine'}</p>
          </div>
        </div>
      </div>

      <div className="dashboard-stats row gy-3 mb-4">
        <div className="col-md-4">
          <Link to="/doctor/appointments" className="dashboard-stat card shadow-sm p-3 dashboard-stat-link text-decoration-none text-dark">
            <div className="stat-label">Upcoming</div>
            <div className="stat-value">{stats.upcoming}</div>
            <div className="text-muted">appointments in your schedule</div>
          </Link>
        </div>
        <div className="col-md-4">
          <Link to="/doctor/appointments" className="dashboard-stat card shadow-sm p-3 dashboard-stat-link text-decoration-none text-dark">
            <div className="stat-label">Completed</div>
            <div className="stat-value">{stats.completed}</div>
            <div className="text-muted">appointments finished</div>
          </Link>
        </div>
        <div className="col-md-4">
          <Link to="/doctor/appointments" className="dashboard-stat card shadow-sm p-3 dashboard-stat-link text-decoration-none text-dark">
            <div className="stat-label">Pending</div>
            <div className="stat-value">{stats.pending}</div>
            <div className="text-muted">requests awaiting review</div>
          </Link>
        </div>
      </div>

      <div className="row gy-4">
        <div className="col-lg-7">
          <div className="card shadow-sm p-4 dashboard-card">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h4 className="mb-1">Next appointment</h4>
                <p className="text-muted mb-0">Stay on top of your next patient visit.</p>
              </div>
              <Link to="/doctor/appointments" className="btn btn-link btn-sm">View all</Link>
            </div>
            {nextAppointment ? (
              <div className="next-appointment-details p-3 rounded-3 bg-light">
                <p className="mb-1"><strong>Patient:</strong> {nextAppointment.patientId?.name || 'N/A'}</p>
                <p className="mb-1"><strong>Date:</strong> {new Date(nextAppointment.appointmentDate).toLocaleDateString()}</p>
                <p className="mb-1"><strong>Time:</strong> {nextAppointment.appointmentTime}</p>
                <p className="mb-0"><strong>Status:</strong> {nextAppointment.status}</p>
              </div>
            ) : (
              <div className="dashboard-empty p-3 rounded-3 bg-light">
                <p className="mb-0">No upcoming appointments yet. Keep your calendar open and accept new requests.</p>
              </div>
            )}
          </div>

          <div className="card shadow-sm p-4 dashboard-card">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h4 className="mb-1">Recent appointments</h4>
                <p className="text-muted mb-0">Your latest patient bookings at a glance.</p>
              </div>
            </div>
            {appointments.length === 0 ? (
              <p>No appointments scheduled yet.</p>
            ) : (
              <div className="table-responsive dashboard-table">
                <table className="table table-borderless align-middle mb-0">
                  <thead>
                    <tr>
                      <th>Patient</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.slice(0, 5).map((item) => (
                      <tr key={item._id}>
                        <td>{item.patientId?.name || 'Unknown'}</td>
                        <td>{new Date(item.appointmentDate).toLocaleDateString()}</td>
                        <td>{item.appointmentTime}</td>
                        <td><span className={`badge ${item.status === 'completed' ? 'bg-success' : item.status === 'pending' ? 'bg-warning text-dark' : 'bg-secondary'}`}>{item.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div className="col-lg-5">
          <div className="card shadow-sm p-4 dashboard-card">
            <h4 className="mb-3">Doctor profile</h4>
            <div className="profile-summary-card p-3 rounded-3 bg-light">
              <p className="mb-2"><strong>Name:</strong> {doctor?.name}</p>
              <p className="mb-2"><strong>Hospital:</strong> {doctor?.hospital || 'Not specified'}</p>
              <p className="mb-2"><strong>Experience:</strong> {doctor?.experience || 0} years</p>
              <p className="mb-2"><strong>Email:</strong> {doctor?.email || 'Not available'}</p>
              <p className="mb-0"><strong>Specialization:</strong> {doctor?.specialization || 'General Medicine'}</p>
            </div>
          </div>
          <div className="card shadow-sm p-4 dashboard-card">
            <h4 className="mb-3">Quick actions</h4>
            <div className="d-grid gap-2">
              <Link to="/doctor/appointments" className="btn btn-outline-primary btn-sm">Manage appointments</Link>
              <Link to="/profile" className="btn btn-outline-secondary btn-sm">Update profile</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
