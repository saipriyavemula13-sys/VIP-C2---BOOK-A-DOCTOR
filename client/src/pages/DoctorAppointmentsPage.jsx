import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';
import Spinner from '../components/Spinner';

const DoctorAppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAppointments = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/appointments');
      setAppointments(data);
    } catch (error) {
      toast.error('Unable to load appointments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadAppointments(); }, []);

  const handleStatus = async (id, status) => {
    try {
      await api.put(`/appointments/${id}`, { status });
      toast.success('Appointment updated');
      loadAppointments();
    } catch (error) {
      toast.error('Could not update appointment');
    }
  };

  return (
    <div>
      <h3>Doctor Appointments</h3>
      {loading ? <Spinner /> : (
        <div className="table-responsive mt-3">
          <table className="table table-hover">
            <thead>
              <tr><th>Patient</th><th>Date</th><th>Time</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment._id}>
                  <td>{appointment.patientId?.name}</td>
                  <td>{new Date(appointment.appointmentDate).toLocaleDateString()}</td>
                  <td>{appointment.appointmentTime}</td>
                  <td>{appointment.status}</td>
                  <td>
                    <button className="btn btn-sm btn-success me-2" onClick={() => handleStatus(appointment._id, 'confirmed')}>Confirm</button>
                    <button className="btn btn-sm btn-warning me-2" onClick={() => handleStatus(appointment._id, 'completed')} disabled={appointment.status !== 'confirmed'}>Complete</button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleStatus(appointment._id, 'rejected')}>Reject</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DoctorAppointmentsPage;
