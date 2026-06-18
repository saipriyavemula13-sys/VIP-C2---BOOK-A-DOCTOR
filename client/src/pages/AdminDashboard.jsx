import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';
import Spinner from '../components/Spinner';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const { data } = await api.get('/admin/stats');
        setStats(data);
      } catch (error) {
        toast.error('Unable to load admin statistics');
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  if (loading) return <Spinner />;

  return (
    <div>
      <h3>Admin Dashboard</h3>
      <div className="row gy-4 mt-3">
        <div className="col-md-3"><div className="card p-4 shadow-sm"><h5>Total Patients</h5><p className="display-6">{stats.totalUsers}</p></div></div>
        <div className="col-md-3"><div className="card p-4 shadow-sm"><h5>Total Doctors</h5><p className="display-6">{stats.totalDoctors}</p></div></div>
        <div className="col-md-3"><div className="card p-4 shadow-sm"><h5>Total Appointments</h5><p className="display-6">{stats.totalAppointments}</p></div></div>
        <div className="col-md-3"><div className="card p-4 shadow-sm"><h5>Pending Doctors</h5><p className="display-6">{stats.pendingDoctors}</p></div></div>
      </div>
      <div className="mt-4 d-flex gap-2 flex-wrap">
        <Link to="/admin/doctors" className="btn btn-outline-primary">Manage Doctors</Link>
        <Link to="/admin/users" className="btn btn-outline-secondary">Manage Users</Link>
        <Link to="/admin/appointments" className="btn btn-outline-secondary">Manage Appointments</Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
