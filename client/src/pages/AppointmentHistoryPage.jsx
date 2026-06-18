import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getAppointments, cancelAppointment, updateAppointment } from '../services/appointmentService';
import Spinner from '../components/Spinner';

const AppointmentHistoryPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({ appointmentDate: '', appointmentTime: '' });

  const loadAppointments = async () => {
    setLoading(true);
    try {
      const { data } = await getAppointments();
      setAppointments(data);
    } catch (error) {
      toast.error('Unable to load appointments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadAppointments(); }, []);

  const handleCancel = async (id) => {
    try {
      await cancelAppointment(id);
      toast.success('Appointment cancelled');
      loadAppointments();
    } catch (error) {
      toast.error('Could not cancel appointment');
    }
  };

  const handleEditChange = (e) => {
    setEditValues({ ...editValues, [e.target.name]: e.target.value });
  };

  const startEdit = (appointment) => {
    setEditingId(appointment._id);
    setEditValues({ appointmentDate: appointment.appointmentDate.slice(0, 10), appointmentTime: appointment.appointmentTime });
  };

  const saveEdit = async (id) => {
    try {
      await updateAppointment(id, { appointmentDate: editValues.appointmentDate, appointmentTime: editValues.appointmentTime });
      toast.success('Appointment updated');
      setEditingId(null);
      loadAppointments();
    } catch (error) {
      toast.error('Could not update appointment');
    }
  };

  const filteredAppointments = appointments.filter((appointment) => {
    if (statusFilter === 'all') return true;
    return appointment.status === statusFilter;
  });

  return (
    <div>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4 gap-3">
        <div>
          <h3>Appointment History</h3>
          <p className="text-muted">Track your booking statuses and manage pending appointments.</p>
        </div>
        <div className="d-flex gap-2">
          <select className="form-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>
      {loading ? <Spinner /> : (
        <div className="table-responsive">
          <table className="table table-hover mt-3">
            <thead>
              <tr>
                <th>Doctor</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.length === 0 && <tr><td colSpan="5">No appointments found.</td></tr>}
              {filteredAppointments.map((appointment) => (
                <React.Fragment key={appointment._id}>
                  <tr>
                    <td>{appointment.doctorId?.name || 'Doctor'}</td>
                    <td>{new Date(appointment.appointmentDate).toLocaleDateString()}</td>
                    <td>{appointment.appointmentTime}</td>
                    <td><span className={`badge ${appointment.status === 'completed' ? 'bg-success' : appointment.status === 'pending' ? 'bg-warning text-dark' : appointment.status === 'confirmed' ? 'bg-primary' : 'bg-secondary'}`}>{appointment.status}</span></td>
                    <td>
                      {appointment.status !== 'cancelled' && appointment.status !== 'completed' && (
                        <>
                          <button className="btn btn-sm btn-danger me-2" onClick={() => handleCancel(appointment._id)}>Cancel</button>
                          {appointment.status === 'pending' && (
                            <button className="btn btn-sm btn-outline-primary" onClick={() => startEdit(appointment)}>Reschedule</button>
                          )}
                        </>
                      )}
                    </td>
                  </tr>
                  {editingId === appointment._id && (
                    <tr>
                      <td colSpan="5">
                        <div className="row g-3 align-items-end">
                          <div className="col-md-4">
                            <label className="form-label">New date</label>
                            <input type="date" name="appointmentDate" className="form-control" value={editValues.appointmentDate} onChange={handleEditChange} />
                          </div>
                          <div className="col-md-4">
                            <label className="form-label">New time</label>
                            <input type="time" name="appointmentTime" className="form-control" value={editValues.appointmentTime} onChange={handleEditChange} />
                          </div>
                          <div className="col-md-4 d-flex gap-2">
                            <button className="btn btn-sm btn-primary" onClick={() => saveEdit(appointment._id)}>Save</button>
                            <button className="btn btn-sm btn-secondary" onClick={() => setEditingId(null)}>Cancel</button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AppointmentHistoryPage;
