// MainLayout.js
import React from "react";
import Navbar from "./Navbar"; // Assuming your Navbar component is in the same directory

const MainLayout = ({ children }) => (
  <div>
    <Navbar />
    <div className="main-content">
      {children}
    </div>
  </div>
);

export default MainLayout;
