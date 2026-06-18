import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getAppointments } from '../services/appointmentService';
import { uploadReport } from '../services/reportService';
import Spinner from '../components/Spinner';

const UploadReportsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadAppointments = async () => {
      setLoading(true);
      try {
        const { data } = await getAppointments();
        setAppointments(data.filter((appointment) => appointment.status !== 'cancelled'));
      } catch (error) {
        toast.error('Unable to load appointments');
      } finally {
        setLoading(false);
      }
    };
    loadAppointments();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedAppointment || !file) {
      toast.error('Please select an appointment and attach a file');
      return;
    }

    const formData = new FormData();
    formData.append('report', file);
    setSubmitting(true);

    try {
      await uploadReport(selectedAppointment, formData);
      toast.success('Report uploaded successfully');
      setSelectedAppointment('');
      setFile(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to upload report');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-lg-8">
        <div className="card shadow-sm p-4">
          <h3>Upload Medical Report</h3>
          <p className="text-muted">Choose an appointment and upload a PDF or image for doctor review.</p>
          {loading ? <Spinner /> : (
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Appointment</label>
                <select className="form-select" value={selectedAppointment} onChange={(e) => setSelectedAppointment(e.target.value)} required>
                  <option value="">Select an appointment</option>
                  {appointments.map((appointment) => (
                    <option key={appointment._id} value={appointment._id}>
                      {appointment.doctorId?.name} • {new Date(appointment.appointmentDate).toLocaleDateString()} • {appointment.appointmentTime} ({appointment.status})
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Report File</label>
                <input type="file" className="form-control" onChange={(e) => setFile(e.target.files[0])} accept="application/pdf,image/*" required />
              </div>
              <button className="btn btn-primary" disabled={submitting}>{submitting ? 'Uploading...' : 'Upload Report'}</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadReportsPage;
