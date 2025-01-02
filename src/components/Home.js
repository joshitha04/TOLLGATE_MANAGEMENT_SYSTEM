  // // Home.js
  // import React from "react";
  // import { useNavigate } from "react-router-dom";
  // import './Home.css';

  // function Home() {
  //   const navigate = useNavigate();

  //   return (
  //     <div className="home-container">
  //       <br/><br/><br/>
  //       <h1>Welcome to the Toll Gate Management System</h1>
  //       <div className="button-group">
  //         <button onClick={() => navigate("/emergency-services")}>Emergency Services</button>
  //         <button onClick={() => navigate("/fare")}>Fare</button>
  //         <button onClick={() => navigate("/login-user")}>Login as User</button>
  //         <button onClick={() => navigate("/login-staff")}>Login as Staff</button>
  //         <button onClick={() => navigate("/login-admin")}>Login as Admin</button>
  //       </div>
  //     </div>
  //   );
  // }

  // export default Home;

  // Home.js
  import React from "react";
  import { useNavigate } from "react-router-dom";
  import './Home.css';
  // relative path to src/images


  function Home() {
    const navigate = useNavigate();

    return (
      <div className="home-container">
        <nav className="navbar">
          <h2 className="navbar-title" onClick={() => navigate("/")}>Toll Gate Management</h2>
          <div className="navbar-links">
            <a onClick={() => navigate("/")}>Home</a>
            <a onClick={() => navigate("/login-user")}>Login as User</a>
            <a onClick={() => navigate("/login-staff")}>Login as Staff</a>
            <a onClick={() => navigate("/login-admin")}>Login as Admin</a>
          </div>
        </nav>

        <div className="home-content">
        <img src={'tollgate.jpeg'} alt="Toll Gate" className="home-image" />
        <br/><br/><br/>
          <h1>Welcome to the Toll Gate Management System</h1>
          <div className="button-group">
          <button
            onClick={() => navigate("/emergency-services")}
            style={{
              width: "30%",
              padding: "40px ",
              fontSize: "32px",
              backgroundColor: "#2977ca", // Blue color
              color: "white",
              border: "none",
              borderRadius: "15px",
              cursor: "pointer",
            }}
          >
            Emergency Services
          </button>
          <button
            onClick={() => navigate("/fare")}
            style={{
              width: "30%",
              padding: "40px ",
              fontSize: "32px",
              backgroundColor: "#2977ca", // Blue color
              color: "white",
              border: "none",
              borderRadius: "15px",
              cursor: "pointer",
            }}
          >
            Fare
          </button>
          </div>
        </div>
      </div>
    );
  }

  export default Home;
