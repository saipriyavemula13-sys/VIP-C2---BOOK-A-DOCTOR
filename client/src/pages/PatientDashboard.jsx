import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAppointments } from '../services/appointmentService';
import Spinner from '../components/Spinner';

const PatientDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadAppointments = async () => {
      setLoading(true);
      try {
        const { data } = await getAppointments();
        setAppointments(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadAppointments();
  }, []);

  const stats = useMemo(() => {
    const upcoming = appointments.filter((item) => item.status === 'pending' || item.status === 'confirmed').length;
    const completed = appointments.filter((item) => item.status === 'completed').length;
    const reports = appointments.reduce((count, item) => count + (item.uploadedReports?.length || 0), 0);
    return { upcoming, completed, reports };
  }, [appointments]);

  if (loading) return <Spinner />;

  return (
    <div className="row gy-4">
      <div className="col-12">
        <div className="card shadow-sm p-4 mb-4 patient-welcome-card">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
            <div>
              <h4 className="mb-1">Welcome, {user?.name}</h4>
              <p className="text-muted mb-0">Your health dashboard shows your upcoming bookings, reports, and recent activity.</p>
            </div>
            <div className="d-flex gap-2 flex-wrap">
              <Link className="btn btn-primary btn-sm" to="/doctors">Browse Doctors</Link>
              <Link className="btn btn-outline-secondary btn-sm" to="/patient/reports">Upload Reports</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="col-lg-4">
        <div className="card shadow-sm p-4 patient-metric-card">
          <h6 className="text-uppercase text-muted">Upcoming</h6>
          <p className="stat-number mb-1">{stats.upcoming}</p>
          <p className="text-muted mb-0">appointments scheduled</p>
        </div>
      </div>
      <div className="col-lg-4">
        <div className="card shadow-sm p-4 patient-metric-card">
          <h6 className="text-uppercase text-muted">Completed</h6>
          <p className="stat-number mb-1">{stats.completed}</p>
          <p className="text-muted mb-0">visits recorded</p>
        </div>
      </div>
      <div className="col-lg-4">
        <div className="card shadow-sm p-4 patient-metric-card">
          <h6 className="text-uppercase text-muted">Reports</h6>
          <p className="stat-number mb-1">{stats.reports}</p>
          <p className="text-muted mb-0">files uploaded</p>
        </div>
      </div>

      <div className="col-xl-7">
        <div className="card shadow-sm p-4">
          <h5 className="mb-3">Patient actions</h5>
          <div className="d-grid gap-3">
            <Link className="btn btn-primary" to="/doctors">Find doctors</Link>
            <Link className="btn btn-outline-secondary" to="/patient/appointments">View appointment history</Link>
            <Link className="btn btn-outline-secondary" to="/patient/reports">Upload reports</Link>
          </div>
        </div>
      </div>

      <div className="col-xl-5">
        <div className="card shadow-sm p-4">
          <h5 className="mb-3">Quick actions</h5>
          <div className="list-group list-group-flush">
            <Link to="/doctors" className="list-group-item list-group-item-action">
              Book an appointment
            </Link>
            <Link to="/patient/reports" className="list-group-item list-group-item-action">
              Upload reports from your profile
            </Link>
            <Link to="/patient/appointments" className="list-group-item list-group-item-action">
              Track appointment status
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
