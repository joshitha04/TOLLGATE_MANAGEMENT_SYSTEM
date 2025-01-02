import React, { useState } from 'react';
import axios from 'axios';
import './AdminDashboard.css'; 

const AdminDashboard = () => {
  // State for tollgate form
  const [isTollgateFormVisible, setIsTollgateFormVisible] = useState(false);
  const [tollgateName, setTollgateName] = useState('');
  const [numLanes, setNumLanes] = useState(0);

  // State for location (area, district)
  const [area, setArea] = useState('');
  const [district, setDistrict] = useState('');
  const [state, setState] = useState('');

  // State for emergency services
  const [fireStationAddress, setFireStationAddress] = useState('');
  const [hospitalAddress, setHospitalAddress] = useState('');
  const [policeStationAddress, setPoliceStationAddress] = useState('');

  // State for staff form
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [tollgateId, setTollgateId] = useState('');
  const [shiftStartTime, setShiftStartTime] = useState('');
  const [shiftEndTime, setShiftEndTime] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [role, setRole] = useState('');
  const [password, setPassword] = useState('');
  const [isFormVisible, setIsFormVisible] = useState(false); // To toggle staff form visibility
  const [error, setError] = useState(null); // For displaying error messages


  const [isDeleteFormVisible, setIsDeleteFormVisible] = useState(false);
  const [staffIdToDelete, setStaffIdToDelete] = useState('');

  


  // Token validation helper function
  const getToken = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Your session has expired, please log in again.');
      window.location.href = '/login-admin'; // Redirect to login page
      return null;
    }
    return token;
  };
  

  // Handle staff form submission with Authorization header
  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const token = getToken();
    console.log('Token:', token);
    if (!token) return;
  
    const staffData = {
      first_name: firstName,
      last_name: lastName,
      tollgate_id: tollgateId,
      shift_start_time: shiftStartTime,
      shift_end_time: shiftEndTime,
      contact_info: contactInfo,
      role,
      password
    };
  
    try {
      const response = await axios.post('http://localhost:5000/add-staff', staffData, {
        headers: {
          Authorization: `Bearer ${token}`,  // Corrected here
        },
      });
      alert('Staff member added successfully');
      setFirstName('');
      setLastName('');
      setTollgateId('');
      setShiftStartTime('');
      setShiftEndTime('');
      setContactInfo('');
      setRole('');
      setPassword('');
      setIsFormVisible(false);
    } catch (error) {
      console.error('There was an error adding the staff member', error);
      alert('Error adding staff member');
      if (error.response) {
        console.log('Response Data:', error.response.data);
        console.log('Response Status:', error.response.status);
      }
    }
  };

  const handleDeleteStaff = async (event) => {
    event.preventDefault();
  
    const token = getToken();
    if (!token) return;
  
    try {
      const response = await axios.delete(`http://localhost:5000/delete-staff/${staffIdToDelete}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      console.log('Response from server:', response);
      alert('Staff member deleted successfully');
      setStaffIdToDelete('');
      setIsDeleteFormVisible(false);
    } catch (error) {
      console.error('Error deleting staff member:', error);
      console.error('Error details:', error.response?.data);
      alert(error.response?.data?.message || 'Error deleting staff member');
    }
  };
  

  const handleTollgateSubmit = async (e) => {
    e.preventDefault();
  
    const token = getToken();
    if (!token) return;
  
    try {
      const response = await axios.post(
        'http://localhost:5000/add-tollgate',
        {
          tollgateName: tollgateName, // Use matching names
          numLanes: numLanes,
          state,
          area,
          district,
          fireStationAddress, // Matching field names
          hospitalAddress,
          policeStationAddress
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json', // Ensure correct content-type
          },
        }
      );
  
      console.log('Tollgate added:', response.data);
      // Handle the response as needed (e.g., show success message)
    } catch (error) {
      console.error('Error adding tollgate:', error);
      // Handle error (e.g., show error message to user)
    }
  };

  
  

  return (
    <div className="dashboard">
      <h1>Admin Dashboard</h1>

      
      {/* Add Tollgate Form */}
      <section className="form-section">
        
        {isTollgateFormVisible ? (
          <form onSubmit={handleTollgateSubmit} className="form-container">
            <input
              type="text"
              placeholder="Tollgate Name"
              value={tollgateName}
              onChange={(e) => setTollgateName(e.target.value)}
              className="input-field"
            />
            <input
              type="number"
              placeholder="Number of Lanes"
              value={numLanes}
              onChange={(e) => setNumLanes(e.target.value)}
              className="input-field"
            />

            {/* Location Inputs */}
            <h3>Location</h3>
            <input
              type="text"
              placeholder="State"
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="input-field"
            />
            <input
              type="text"
              placeholder="District"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="input-field"
            />
            <input
              type="text"
              placeholder="Area"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="input-field"
            />

            {/* Emergency Services Inputs */}
            <h3>Emergency Services</h3>
            <input
              type="text"
              placeholder="Fire Station Address"
              value={fireStationAddress}
              onChange={(e) => setFireStationAddress(e.target.value)}
              className="input-field"
            />
            <input
              type="text"
              placeholder="Hospital Address"
              value={hospitalAddress}
              onChange={(e) => setHospitalAddress(e.target.value)}
              className="input-field"
            />
            <input
              type="text"
              placeholder="Police Station Address"
              value={policeStationAddress}
              onChange={(e) => setPoliceStationAddress(e.target.value)}
              className="input-field"
            />

            <div className="form-buttons">
              <button type="submit" className="submit-btn">Add Tollgate</button>
              <button type="button" onClick={() => setIsTollgateFormVisible(false)} className="cancel-btn">
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <button onClick={() => setIsTollgateFormVisible(true)} className="action-btn">
            Add Tollgate
          </button>
        )}
      </section>
      




      {/* Add Staff Form */}
      <section className="form-section">
        <button onClick={() => setIsFormVisible(!isFormVisible)} className="action-btn">
          {isFormVisible ? 'Cancel' : 'Add Staff Member'}
        </button>

        {isFormVisible && (
          <div className="form-container">
            <h2>Add Staff Member</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First Name"
                className="input-field"
                required
              />
              <input
                type="text"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last Name"
                className="input-field"
                required
              />
              <input
                type="number"
                id="tollgateId"
                value={tollgateId}
                onChange={(e) => setTollgateId(e.target.value)}
                placeholder="Tollgate ID"
                className="input-field"
                required
              />
              <input
                type="time"
                id="shiftStartTime"
                value={shiftStartTime}
                onChange={(e) => setShiftStartTime(e.target.value)}
                className="input-field"
                required
              />
              <input
                type="time"
                id="shiftEndTime"
                value={shiftEndTime}
                onChange={(e) => setShiftEndTime(e.target.value)}
                className="input-field"
                required
              />
              <input
                type="text"
                id="contactInfo"
                value={contactInfo}
                onChange={(e) => setContactInfo(e.target.value)}
                placeholder="Contact Information"
                className="input-field"
                required
              />
              <input
                type="text"
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Role"
                className="input-field"
                required
              />
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="input-field"
                required
              />

              {error && <p className="error-message">{error}</p>}
              <div className="form-buttons">
                <button type="submit" className="submit-btn">Add Staff</button>
              </div>
            </form>
          </div>
        )}
      </section>

      <section className="form-section">
        <button onClick={() => setIsDeleteFormVisible(!isDeleteFormVisible)} className="action-btn">
          {isDeleteFormVisible ? 'Cancel' : 'Delete Staff Member'}
        </button>

        {isDeleteFormVisible && (
          <div className="form-container">
            <h2>Delete Staff Member</h2>
            <form onSubmit={handleDeleteStaff}>
              <input
                type="text"
                value={staffIdToDelete}
                onChange={(e) => setStaffIdToDelete(e.target.value)}
                placeholder="Enter Staff ID to Delete"
                className="input-field"
                required
              />
              <div className="form-buttons">
                <button type="submit" className="submit-btn">Delete Staff</button>
              </div>
            </form>
          </div>
        )}
      </section>


    </div>
  );
};

export default AdminDashboard;
