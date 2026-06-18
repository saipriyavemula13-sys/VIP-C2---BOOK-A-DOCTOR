import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';
import Spinner from '../components/Spinner';

const ManageDoctorsPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadDoctors = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/doctors');
      setDoctors(data);
    } catch (error) {
      toast.error('Unable to load doctors');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadDoctors(); }, []);

  const updateStatus = async (id, action) => {
    try {
      await api.put(`/admin/doctors/${id}/${action}`);
      toast.success(`Doctor ${action}d successfully`);
      loadDoctors();
    } catch (error) {
      toast.error('Action failed');
    }
  };

  return (
    <div>
      <h3>Manage Doctors</h3>
      {loading ? <Spinner /> : (
        <div className="table-responsive mt-3">
          <table className="table table-hover">
            <thead>
              <tr><th>Name</th><th>Specialization</th><th>Approved</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {doctors.map((doctor) => (
                <tr key={doctor._id}>
                  <td>{doctor.name}</td>
                  <td>{doctor.specialization}</td>
                  <td>{doctor.approved ? 'Yes' : 'No'}</td>
                  <td>
                    {!doctor.approved && (
                      <>
                        <button className="btn btn-sm btn-success me-2" onClick={() => updateStatus(doctor._id, 'approve')}>Approve</button>
                        <button className="btn btn-sm btn-danger" onClick={() => updateStatus(doctor._id, 'reject')}>Reject</button>
                      </>
                    )}
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

export default ManageDoctorsPage;
