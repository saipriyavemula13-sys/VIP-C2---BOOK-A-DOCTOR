import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchDoctors } from '../services/doctorService';
import Spinner from '../components/Spinner';

const DoctorListPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [query, setQuery] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [status, setStatus] = useState('all');
  const [sort, setSort] = useState('experienceDesc');
  const [loading, setLoading] = useState(false);

  const loadDoctors = async () => {
    setLoading(true);
    try {
      const params = {};
      if (query) params.search = query;
      if (specialization) params.specialization = specialization;
      const { data } = await fetchDoctors(params);
      let list = [...data];
      if (status === 'verified') {
        list = list.filter((doctor) => doctor.approved);
      } else if (status === 'pending') {
        list = list.filter((doctor) => !doctor.approved);
      }
      if (sort === 'experienceAsc') {
        list.sort((a, b) => (a.experience || 0) - (b.experience || 0));
      } else if (sort === 'experienceDesc') {
        list.sort((a, b) => (b.experience || 0) - (a.experience || 0));
      } else if (sort === 'nameAsc') {
        list.sort((a, b) => a.name.localeCompare(b.name));
      }
      setDoctors(list);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Load doctors once on mount; updates happen when search/filter actions are triggered manually.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { loadDoctors(); }, []);

  return (
    <div>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4 gap-3">
        <div className="input-group w-100 w-md-50">
          <input value={query} onChange={(e) => setQuery(e.target.value)} className="form-control" placeholder="Search doctors by name" />
          <button className="btn btn-outline-primary" onClick={loadDoctors}>Search</button>
        </div>
        <div className="d-flex flex-column flex-md-row gap-2 w-100 w-md-50">
          <select value={specialization} onChange={(e) => setSpecialization(e.target.value)} className="form-select w-100">
            <option value="">All Specializations</option>
            <option value="Cardiologist">Cardiologist</option>
            <option value="Dentist">Dentist</option>
            <option value="Dermatologist">Dermatologist</option>
            <option value="General Medicine">General Medicine</option>
          </select>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="form-select w-100">
            <option value="all">All Statuses</option>
            <option value="verified">Verified</option>
            <option value="pending">Pending Approval</option>
          </select>
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="form-select w-100">
            <option value="experienceDesc">Sort by experience ↓</option>
            <option value="experienceAsc">Sort by experience ↑</option>
            <option value="nameAsc">Sort by name</option>
          </select>
        </div>
      </div>

      {loading ? <Spinner /> : (
        <div className="row gy-4">
          {doctors.length === 0 && <p>No doctors found yet.</p>}
          {doctors.map((doctor) => (
            <div className="col-md-6" key={doctor._id}>
              <div className="card h-100 shadow-sm doctor-card">
                <div className="card-body d-flex gap-3">
                  <div className="flex-shrink-0">
                    <img src={doctor.profileImage || 'https://via.placeholder.com/100'} alt={doctor.name} className="rounded-circle" width="100" height="100" />
                  </div>
                  <div className="d-flex flex-column justify-content-between w-100">
                    <div>
                      <h5>{doctor.name}</h5>
                      <p className="mb-1"><strong>Specialization:</strong> {doctor.specialization}</p>
                      <p className="mb-1"><strong>Hospital:</strong> {doctor.hospital || 'N/A'}</p>
                      <p className="mb-1"><strong>Experience:</strong> {doctor.experience || 0} years</p>
                    </div>
                    <div className="d-flex flex-wrap align-items-center gap-2 mt-3">
                      <span className={`badge ${doctor.approved ? 'bg-success' : 'bg-warning text-dark'}`}>
                        {doctor.approved ? 'Verified' : 'Pending approval'}
                      </span>
                      <Link className="btn btn-sm btn-outline-primary ms-auto" to={`/doctors/${doctor._id}`}>View Profile</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorListPage;
