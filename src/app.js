import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from './components/Home';
import Fare from './components/Fare';
import LoginUser from './components/LoginUser';
import LoginStaff from './components/LoginStaff';
import LoginAdmin from './components/LoginAdmin';
import UserHome from './components/UserHome';
import MainLayout from "./components/MainLayout";
import RegisterUser from './components/RegisterUser';
import EmergencyServices from './components/EmergencyServices';
import AdminDashboard from './components/AdminDashboard';
import StaffDashboard from './components/StaffDashboard';  // Import StaffDashboard

import './App.css';

// Check if the user is authenticated by checking the authentication status in localStorage
const isAuthenticated = () => {
  return localStorage.getItem("isAuthenticated") === "true";
};

// Get the role of the authenticated user
const getRole = () => {
  return localStorage.getItem("role");
};

// PrivateRoute component to protect routes
const PrivateRoute = ({ children, redirectTo, allowedRoles }) => {
  const role = getRole();
  if (!isAuthenticated()) {
    return <Navigate to={redirectTo} />;
  }
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/" />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <MainLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login-user" element={<LoginUser />} />
        <Route path="/login-staff" element={<LoginStaff />} />
        <Route path="/login-admin" element={<LoginAdmin />} />
        <Route path="/register-user" element={<RegisterUser />} />
        <Route path="/emergency-services" element={<EmergencyServices />} />
        <Route path="/fare" element={<Fare />} />
        
        {/* Protected User Route */}
        <Route path="/user-home" element={
          <PrivateRoute redirectTo="/login-user" allowedRoles={['user']}>
            <UserHome />
          </PrivateRoute>
        } />
        
       
        <Route path="/staff-dashboard" element={
          <PrivateRoute redirectTo="/login-staff" allowedRoles={['staff']}>
            <StaffDashboard />
          </PrivateRoute>
        } />

        {/* Protected Admin Route */}
        <Route path="/admin-dashboard" element={
          <PrivateRoute redirectTo="/login-admin" allowedRoles={['admin']}>
            <AdminDashboard />
          </PrivateRoute>
        } />
      </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;
