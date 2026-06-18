import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { fetchAdminAppointments } from '../services/adminService';
import Spinner from '../components/Spinner';

const AdminAppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAppointments = async () => {
      try {
        const { data } = await fetchAdminAppointments();
        setAppointments(data);
      } catch (error) {
        toast.error('Unable to load appointments');
      } finally {
        setLoading(false);
      }
    };
    loadAppointments();
  }, []);

  return (
    <div>
      <h3>All Appointments</h3>
      {loading ? <Spinner /> : (
        <div className="table-responsive mt-3">
          <table className="table table-hover">
            <thead>
              <tr><th>Patient</th><th>Doctor</th><th>Date</th><th>Time</th><th>Status</th></tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment._id}>
                  <td>{appointment.patientId?.name}</td>
                  <td>{appointment.doctorId?.name}</td>
                  <td>{new Date(appointment.appointmentDate).toLocaleDateString()}</td>
                  <td>{appointment.appointmentTime}</td>
                  <td>{appointment.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminAppointmentsPage;
