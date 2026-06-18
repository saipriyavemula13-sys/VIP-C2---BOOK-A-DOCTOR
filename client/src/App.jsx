import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DoctorListPage from './pages/DoctorListPage';
import DoctorDetailsPage from './pages/DoctorDetailsPage';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import DoctorAppointmentsPage from './pages/DoctorAppointmentsPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminAppointmentsPage from './pages/AdminAppointmentsPage';
import ManageDoctorsPage from './pages/ManageDoctorsPage';
import ProfilePage from './pages/ProfilePage';
import AppointmentHistoryPage from './pages/AppointmentHistoryPage';
import UploadReportsPage from './pages/UploadReportsPage';
import { useAuth } from './context/AuthContext';
import NavbarComponent from './components/NavbarComponent';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const { user } = useAuth();

  return (
    <>
      <NavbarComponent />
      <div className="container py-4">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />
          <Route path="/register" element={!user ? <RegisterPage /> : <Navigate to="/" />} />
          <Route path="/doctors" element={<DoctorListPage />} />
          <Route path="/doctors/:id" element={<DoctorDetailsPage />} />

          <Route element={<ProtectedRoute />}> 
            <Route path="/patient/dashboard" element={<PatientDashboard />} />
            <Route path="/patient/appointments" element={<AppointmentHistoryPage />} />
            <Route path="/patient/reports" element={<UploadReportsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          <Route element={<ProtectedRoute role="doctor" />}>
            <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
            <Route path="/doctor/appointments" element={<DoctorAppointmentsPage />} />
          </Route>

          <Route element={<ProtectedRoute role="admin" />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/doctors" element={<ManageDoctorsPage />} />
            <Route path="/admin/users" element={<AdminUsersPage />} />
            <Route path="/admin/appointments" element={<AdminAppointmentsPage />} />
          </Route>

          <Route path="*" element={<h2>Page not found</h2>} />
        </Routes>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;
