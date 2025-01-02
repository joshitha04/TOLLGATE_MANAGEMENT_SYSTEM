// Navbar.js
import React from "react";
import { useNavigate } from "react-router-dom";
import './Navbar.css';

function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <h2 className="navbar-title" onClick={() => navigate("/")}>Toll Gate Management</h2>
      <div className="navbar-links">
        <a onClick={() => navigate("/")}>Home</a>
        <a onClick={() => navigate("/login-user")}>Login as User</a>
        <a onClick={() => navigate("/login-staff")}>Login as Staff</a>
        <a onClick={() => navigate("/login-admin")}>Login as Admin</a>
      </div>
    </nav>
  );
}

export default Navbar;
