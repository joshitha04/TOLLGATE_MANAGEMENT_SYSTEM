import { useState, useEffect } from 'react';

export default function Fare() {
  const [fares, setFares] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to fetch fare data
  const fetchFareData = async () => {
    setError(null);
    setLoading(true);
    setFares(null);
    
    console.log('Fetching fare data...'); // Debug log
    
    try {
      const res = await fetch('http://localhost:5000/fare');
      
      if (!res.ok) {
        throw new Error('Failed to retrieve fare data');
      }
      
      const data = await res.json();
      console.log('Fare data:', data); // Debug log
      setFares(data.fares); // Make sure this matches the response key
    } catch (err) {
      console.error('Error:', err); // Debug log
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch fare data on component mount
  useEffect(() => {
    fetchFareData();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Fare Information</h1>

      {/* Display loading message */}
      {loading && <p>Loading fares...</p>}

      {/* Display error message if there is an error */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Display the fare data if available */}
      {fares && fares.length > 0 && (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid black', padding: '8px' }}>Trip Type</th>
              <th style={{ border: '1px solid black', padding: '8px' }}>Vehicle Type</th>
              <th style={{ border: '1px solid black', padding: '8px' }}>Fare Amount</th>
              
            </tr>
          </thead>
          <tbody>
            {fares.map((fare, index) => (
              <tr key={index}>
                <td style={{ border: '1px solid black', padding: '8px' }}>{fare.trip_type}</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>{fare.vehicle_type}</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>{fare.amount}</td>
                
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Display a message if no fares are found */}
      {fares && fares.length === 0 && <p>No fare information available.</p>}
    </div>
  );
}
