import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NavbarComponent = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <Link className="navbar-brand" to="/">Book a Doctor</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item"><NavLink className="nav-link" to="/">Home</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/doctors">Doctors</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/about">About</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/contact">Contact</NavLink></li>
          </ul>
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            {!user && (
              <>
                <li className="nav-item"><NavLink className="nav-link" to="/login">Login</NavLink></li>
                <li className="nav-item"><NavLink className="nav-link" to="/register">Register</NavLink></li>
              </>
            )}
            {user && (
              <>
                {user.role === 'patient' && <li className="nav-item"><NavLink className="nav-link" to="/patient/dashboard">Patient</NavLink></li>}
                {user.role === 'doctor' && <li className="nav-item"><NavLink className="nav-link" to="/doctor/dashboard">Doctor</NavLink></li>}
                {user.role === 'admin' && <li className="nav-item"><NavLink className="nav-link" to="/admin/dashboard">Admin</NavLink></li>}
                <li className="nav-item"><NavLink className="nav-link" to="/profile">Profile</NavLink></li>
                <li className="nav-item"><button className="btn btn-outline-light btn-sm ms-2" onClick={handleLogout}>Logout</button></li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavbarComponent;
