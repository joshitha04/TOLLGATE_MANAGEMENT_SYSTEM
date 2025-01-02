import { useState } from 'react';

export default function Home() {
  const [tollgateName, setTollgateName] = useState('');
  const [serviceType, setServiceType] = useState('Police'); // Default service type
  const [services, setServices] = useState(null);
  const [error, setError] = useState(null);

  const serviceTypes = ['Police', 'Hospital', 'Fire Station']; // Add more service types as needed

  // Function to handle the form submission
  const fetchEmergencyServices = async (e) => {
    e.preventDefault();
    setError(null);
    setServices(null);
  
    console.log('Fetching emergency services for:', tollgateName, 'with service type:', serviceType); // Debug log
  
    try {
      // Updated URL format to include serviceType as a path parameter
      const encodedTollgateName = encodeURIComponent(tollgateName);
const encodedServiceType = encodeURIComponent(serviceType);
const res = await fetch(`http://localhost:5000/emergency-services/${encodedTollgateName}/${encodedServiceType}`);

 
  
      if (!res.ok) {
        throw new Error('No emergency services found for this tollgate and service type');
      }
      const data = await res.json();
      console.log('Emergency services data:', data); // Debug log
      setServices(data.emergency_services);
    } catch (err) {
      console.error('Error:', err); // Debug log
      setError(err.message);
    }
  };
  
  return (
    <div style={{ padding: '20px' }}>
      <h1>Tollgate Emergency Services</h1>
      
      <form onSubmit={fetchEmergencyServices}>
        <input
          type="text"
          placeholder="Enter tollgate name"
          value={tollgateName}
          onChange={(e) => setTollgateName(e.target.value)}
          style={{ padding: '10px', margin: '10px' }}
        />

        {/* Service Type Dropdown */}
        <select
          value={serviceType}
          onChange={(e) => setServiceType(e.target.value)}
          style={{ padding: '10px', margin: '10px' }}
        >
          {serviceTypes.map((type, index) => (
            <option key={index} value={type}>
              {type}
            </option>
          ))}
        </select>

        <button type="submit" style={{ padding: '10px' }}>Get Emergency Services</button>
      </form>

      {/* Display the error message */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Display the emergency services if available */}
      {services && services.length > 0 && (
        <ul>
          {services.map((service, index) => (
            <li key={index}>
              <strong>Service Type:</strong> {service.service_type}<br />
              <strong>Address:</strong> {service.service_address}
            </li>
          ))}
        </ul>
      )}

      {/* Display a message if no services are found */}
      {services && services.length === 0 && <p>No emergency services found for this tollgate.</p>}
    </div>
  );
}
