import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";

function LoginUser() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // To show error messages
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Clear previous error message

    try {
      const response = await axios.post("http://localhost:5000/login-user", {
        username,
        password,
      });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token); // Save token to localStorage
        localStorage.setItem("isAuthenticated", "true"); // Set authenticated flag
        localStorage.setItem("role", "user"); // Set the user role
        navigate("/user-home"); // Redirect to user home page
      } else {
        setErrorMessage("Login failed: No token returned"); // Handle case when no token is returned
      }
    } catch (error) {
      console.error("Login failed:", error);
      setErrorMessage("Invalid credentials, please try again"); // Display error message
    }
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      background: "linear-gradient(135deg, #a6c8ff 0%, #e0f3ff 100%)",
      padding: "20px",
      boxSizing: "border-box",
      fontFamily: "'Arial', sans-serif",
      color: "white"
    }}>
      <h1 style={{
        fontSize: "2.5rem",
        color: "white",
        marginBottom: "20px",
        textShadow: "2px 2px 5px rgba(0, 0, 0, 0.2)",
        fontWeight: "bold"
      }}>Login as User</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{
            margin: "10px 0",
            padding: "12px 15px",
            fontSize: "16px",
            width: "100%",
            maxWidth: "350px",
            borderRadius: "25px",
            border: "1px solid #ccc",
            backgroundColor: "white",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            transition: "all 0.3s ease-in-out"
          }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            margin: "10px 0",
            padding: "12px 15px",
            fontSize: "16px",
            width: "100%",
            maxWidth: "350px",
            borderRadius: "25px",
            border: "1px solid #ccc",
            backgroundColor: "white",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            transition: "all 0.3s ease-in-out"
          }}
        />
        <div style={{ marginTop: "15px", textAlign: "center" }}>
          <button
            type="submit"
            style={{
              padding: "12px 30px",
              fontSize: "16px",
              cursor: "pointer",
              backgroundColor: "#2e79c9",
              color: "white",
              border: "none",
              borderRadius: "25px",
              transition: "background-color 0.3s ease",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              marginTop: "15px"
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = "#18869c"}
            onMouseOut={(e) => e.target.style.backgroundColor = "#2e79c9"}
          >
            Login
          </button>
        </div>
      </form>
      {errorMessage && <p style={{
        color: "red",
        fontSize: "14px",
        marginTop: "10px"
      }}>{errorMessage}</p>}

      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <span style={{
          fontSize: "16px",
          fontWeight: "600",
          marginRight: "5px"
        }}>Don't have an account?</span>
        <Link
          to="/register-user"
          style={{
            fontSize: "20px",
            fontWeight: "700",
            color: "#2773dd",
            textDecoration: "none",
            transition: "color 0.3s ease"
          }}
          onMouseOver={(e) => e.target.style.color = "#45a049"}
          onMouseOut={(e) => e.target.style.color = "#2773dd"}
        >
          Register here
        </Link>
      </div>
    </div>
  );
}

export default LoginUser;
