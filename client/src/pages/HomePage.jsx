import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => (
  <div>
    <section className="py-5 text-center bg-light rounded-3">
      <div className="container py-5">
        <h1 className="display-5 fw-bold">Book a Doctor</h1>
        <p className="fs-5 mb-4">Your personalized healthcare companion for online appointments, doctor search, and medical report management.</p>
        <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
          <Link to="/doctors" className="btn btn-primary btn-lg px-4">Browse Doctors</Link>
          <Link to="/register" className="btn btn-outline-secondary btn-lg px-4">Get Started</Link>
        </div>
      </div>
    </section>

    <section className="row gx-5 my-5">
      <div className="col-md-4 mb-4">
        <div className="card h-100 shadow-sm home-card">
          <Link to="/doctors" className="card-body text-decoration-none text-dark">
            <h5 className="card-title">Find trusted specialists</h5>
            <p className="card-text">Search doctors by specialization, experience, and hospital. Compare profiles instantly.</p>
          </Link>
        </div>
      </div>
      <div className="col-md-4 mb-4">
        <div className="card h-100 shadow-sm home-card">
          <Link to="/doctors" className="card-body text-decoration-none text-dark">
            <h5 className="card-title">Book appointments online</h5>
            <p className="card-text">Select a slot, schedule a visit, and manage bookings from your dashboard.</p>
          </Link>
        </div>
      </div>
      <div className="col-md-4 mb-4">
        <div className="card h-100 shadow-sm home-card">
          <Link to="/patient/reports" className="card-body text-decoration-none text-dark">
            <h5 className="card-title">Secure report upload</h5>
            <p className="card-text">Upload medical records and prescriptions securely for doctor review.</p>
          </Link>
        </div>
      </div>
    </section>
  </div>
);

export default HomePage;
