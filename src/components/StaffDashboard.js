
import React, { useState } from "react";
import axios from "axios";
import "./StaffDashboard.css";

function StaffDashboard() {
  const [activeForm, setActiveForm] = useState(null);
  const [vehicleId, setVehicleId] = useState("");
  const [vehicleType, setVehicleType] = useState(""); // Default value
  const [tollgateId, setTollgateId] = useState("");
  const [triptype, setTollFee] = useState(""); // Default value
  const [tollHistory, setTollHistory] = useState([]);
  const [tollgateSearchId, setTollgateSearchId] = useState("");
  const [checkFareDate, setCheckFareDate] = useState("");
  const [checkFareTollgateId, setCheckFareTollgateId] = useState("");
  const [checkFareResult, setCheckFareResult] = useState(null);
  const [scheduleResult, setScheduleResult] = useState(null);

  const handleAddUser = async () => {
    try {
      if (!vehicleId || !vehicleType || !tollgateId || !triptype) {
        alert("All fields are required.");
        return;
      }

      await axios.post(
        "http://localhost:5000/add-user",
        {
          vehicleId,
          vehicleType,
          tollgateId,
          triptype,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("User entry added successfully.");
    } catch (error) {
      alert("Error adding user entry.");
      console.error(error);
    }
  };

  const handleViewTollHistory = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/view-toll-history/${tollgateSearchId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setTollHistory(response.data.toll_history);
    } catch (error) {
      alert("Error fetching toll history.");
      console.error(error);
    }
  };

  const handleCheckFare = async () => {
    try {
      const response = await axios.get("http://localhost:5000/check-fare", {
        params: {
          tollgateId: checkFareTollgateId,
          date: checkFareDate,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setCheckFareResult(response.data);
    } catch (error) {
      alert("Error fetching fare information.");
      console.error(error);
    }
  };

  const handleViewSchedule = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/tollgate-schedule/${tollgateId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setScheduleResult(response.data);
    } catch (error) {
      alert("Error fetching schedule.");
      console.error(error);
    }
  };

  const cancelForm = () => {
    setActiveForm(null);
    setVehicleId("");
    setVehicleType(""); // Reset to default value
    setTollgateId("");
    setTollFee(""); // Reset to default value
    setTollgateSearchId("");
    setCheckFareDate("");
    setCheckFareTollgateId("");
    setCheckFareResult(null);
    setScheduleResult(null);
  };

  return (
    <div className="dashboard-container">
      <h1>Staff Dashboard</h1>
      <div className="button-group">
        <button onClick={() => setActiveForm("add")}>Add User Entry</button>
        <button onClick={() => setActiveForm("view")}>View Toll History</button>
        <button onClick={() => setActiveForm("checkFare")}>Toll Records</button>
        <button onClick={() => setActiveForm("schedule")}>View Schedule</button>
      </div>

      {activeForm === "add" && (
        <div className="form-container">
          <h2>Add User Entry</h2>
          <input
            type="text"
            placeholder="Vehicle ID"
            value={vehicleId}
            onChange={(e) => setVehicleId(e.target.value)}
            className="input-field"
          />
          <select
  value={vehicleType}
  onChange={(e) => setVehicleType(e.target.value)}
  className="input-field"
>
  <option value="" disabled>
    Vehicle Type
  </option>
  <option value="two-wheeler">two-wheeler</option>
  <option value="four-wheeler">four-wheeler</option>
  <option value="heavy vehicle">heavy vehicle</option>
  <option value="emergency vehicle">emergency vehicle</option>
</select>


          <input
            type="number"
            placeholder="Tollgate ID"
            value={tollgateId}
            onChange={(e) => setTollgateId(e.target.value)}
            className="input-field"
          />
          <select
            value={triptype}
            onChange={(e) => setTollFee(e.target.value)}
            className="input-field"
          >
            <option value ="" disabled>trip type</option>
            <option value="One-way">One-way</option>
            <option value="Round trip">Round trip</option>
          </select>
          <div className="form-buttons">
            <button onClick={handleAddUser} className="submit-button">Submit</button>
            <button onClick={cancelForm} className="cancel-button">Cancel</button>
          </div>
        </div>
      )}

      {activeForm === "view" && (
        <div className="form-container">
          <h2>View Toll History</h2>
          <input
            type="text"
            placeholder="Tollgate ID"
            value={tollgateSearchId}
            onChange={(e) => setTollgateSearchId(e.target.value)}
            className="input-field"
          />
          <div className="form-buttons">
            <button onClick={handleViewTollHistory} className="submit-button">View</button>
            <button onClick={cancelForm} className="cancel-button">Cancel</button>
          </div>
          <div className="toll-history-table">
            {tollHistory.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Tollgate ID</th>
                    <th>Vehicle ID</th>
                    <th>Vehicle Type</th>
                    <th>Fare</th>
                    <th>Date</th>
                    <th>Entry Time</th>
                    <th>Exit Time</th>
                  </tr>
                </thead>
                <tbody>
                  {tollHistory.map((entry, index) => (
                    <tr key={index}>
                      <td>{entry.tollgate_id}</td>
                      <td>{entry.vehicle_id}</td>
                      <td>{entry.vehicle_type}</td>
                      <td>{entry.fare}</td>
                      <td>{entry.date}</td>
                      <td>{entry.entry_time}</td>
                      <td>{entry.exit_time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No history available.</p>
            )}
          </div>
        </div>
      )}

      {activeForm === "checkFare" && (
        <div className="form-container">
          <h2>Check Fare</h2>
          <input
            type="text"
            placeholder="Tollgate ID"
            value={checkFareTollgateId}
            onChange={(e) => setCheckFareTollgateId(e.target.value)}
            className="input-field"
          />
          <input
            type="date"
            placeholder="Date"
            value={checkFareDate}
            onChange={(e) => setCheckFareDate(e.target.value)}
            className="input-field"
          />
          <div className="form-buttons">
            <button onClick={handleCheckFare} className="submit-button">Check</button>
            <button onClick={cancelForm} className="cancel-button">Cancel</button>
          </div>
          {checkFareResult && (
            <div className="check-fare-result">
              <h3>Total Fare Collected: {checkFareResult.totalFare}</h3>
              <h4>Vehicle Count: {checkFareResult.vehicleCount}</h4>
              {checkFareResult.vehicles.length > 0 ? (
                <table>
                  <thead>
                    <tr>
                      <th>Vehicle ID</th>
                      <th>Fare</th>
                    </tr>
                  </thead>
                  <tbody>
                    {checkFareResult.vehicles.map((entry, index) => (
                      <tr key={index}>
                        <td>{entry.vehicle_id}</td>
                        <td>{entry.fare}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No entries available for this date and tollgate.</p>
              )}
            </div>
          )}
        </div>
      )}

      {activeForm === "schedule" && (
        <div className="form-container">
          <h2>View Schedule</h2>
          <input
            type="text"
            placeholder="Tollgate ID"
            value={tollgateId}
            onChange={(e) => setTollgateId(e.target.value)}
            className="input-field"
          />
          <div className="form-buttons">
            <button onClick={handleViewSchedule} className="submit-button">View</button>
            <button onClick={cancelForm} className="cancel-button">Cancel</button>
          </div>
          {scheduleResult && (
  <div className="schedule-result">
    <h3>Schedule Details</h3>
    <table>
      <thead>
        <tr>
          <th>Staff ID</th>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Shift Start Time</th>
          <th>Shift End Time</th>
        </tr>
      </thead>
      <tbody>
        {scheduleResult.map((staff, index) => (
          <tr key={index}>
            <td>{staff.staff_id}</td>
            <td>{staff.first_name}</td>
            <td>{staff.last_name}</td>
            <td>{staff.shift_start_time}</td>
            <td>{staff.shift_end_time}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}

        </div>
      )}
    </div>
  );
}

export default StaffDashboard;
