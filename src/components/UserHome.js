import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserHome.css'; // Import the CSS file

const UserHome = () => {
    const [vehicleId, setVehicleId] = useState('');
    const [tollgateId, setTollgateId] = useState('');
    const [tollHistory, setTollHistory] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        console.log(tollHistory);
    }, [tollHistory]);

    const fetchTollHistory = async () => {
        console.log("Button clicked");

        if (!vehicleId) {
            setError('Vehicle ID is required');
            return;
        }

        try {
            setError('');
            setTollHistory([]);

            const params = { vehicleId };
            if (tollgateId) {
                params.tollgateId = tollgateId;
            }

            const response = await axios.get('http://localhost:5000/toll-history', { params });

            console.log('API Response:', response.data);

            if (response.data && response.data.toll_history && response.data.toll_history.length > 0) {
                setTollHistory(response.data.toll_history);
            } else {
                setError('No toll history found for this vehicle and tollgate combination.');
            }
        } catch (err) {
            console.error("API Error:", err);
            setError('Failed to retrieve toll history. Please check the Vehicle ID and Tollgate ID.');
        }
    };

    return (
        <div className="userhome-container">
            <h1 className="userhome-header">Welcome to User Home!</h1>
            <p className="userhome-subheader">Enter Vehicle ID and Tollgate ID to view toll history:</p>

            <input
                type="text"
                value={vehicleId}
                onChange={(e) => setVehicleId(e.target.value)}
                placeholder="Enter Vehicle ID"
                className="userhome-input"
            />
            <input
                type="text"
                value={tollgateId}
                onChange={(e) => setTollgateId(e.target.value)}
                placeholder="Enter Tollgate ID"
                className="userhome-input"
            />
            <button onClick={fetchTollHistory} className="userhome-button">Get Toll History</button>

            {error && <p className="userhome-error">{error}</p>}

            {tollHistory.length > 0 ? (
                <div className="userhome-history-container">
                    <h3 className="userhome-history-header">
                        Toll History for Vehicle ID: {vehicleId} at Tollgate: {tollgateId}
                    </h3>
                    <table className="userhome-table">
                        <thead>
                            <tr>
                                <th className="userhome-table-header">Date</th>
                                <th className="userhome-table-header">Tollgate ID</th>
                                <th className="userhome-table-header">Vehicle Type</th>
                                <th className="userhome-table-header">Fare</th>
                                <th className="userhome-table-header">Entry Time</th>
                                <th className="userhome-table-header">Exit Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tollHistory.map((record, index) => (
                                <tr key={index} className="userhome-table-row">
                                    <td className="userhome-table-cell">{record.date}</td>
                                    <td className="userhome-table-cell">{record.tollgate_id}</td>
                                    <td className="userhome-table-cell">{record.vehicle_type}</td>
                                    <td className="userhome-table-cell">{record.fare}</td>
                                    <td className="userhome-table-cell">{record.entry_time}</td>
                                    <td className="userhome-table-cell">{record.exit_time}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="userhome-subheader">No toll history available for the selected vehicle and tollgate.</p>
            )}
        </div>
    );
};

export default UserHome;
