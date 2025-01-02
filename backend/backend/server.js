const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const db = require('./db'); // Ensure this points to your db.js file
require('dotenv').config();

const app = express();

// Middleware for CORS - allow requests from frontend
app.use(cors());

// Middleware to parse JSON bodies in requests
app.use(express.json());
const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret-key';


const authenticateToken = (req, res, next) => {
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.split(' ')[1]; // Extract token from Authorization header

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token.' });
    }
    req.user = user; // Attach the user to the request object
    next(); // Pass control to the next middleware/route handler
  });
};


app.post('/loginadmin', (req, res) => {
  const { username, password } = req.body;

  // Hardcoded admin credentials (could be replaced with a DB check)
  const admins = [
    { username: "joshitha", password: "jojo", role: "admin" },
    { username: "thrishal", password: "thrishu", role: "admin" },
    { username: "keerthana", password: "keeru", role: "admin" },
    { username: "dhanush", password: "gaja", role: "admin" },
  ];

  // Check if username and password match any admin
  const admin = admins.find(
    (admin) => admin.username === username && admin.password === password
  );

  if (admin) {
    // Generate a JWT token with a long expiration time (100 years)
    const token = jwt.sign(
      { username: admin.username, role: admin.role },
      JWT_SECRET,
      { expiresIn: '100y' } // Token expires in 100 years
    );
    res.status(200).json({ token });
  } else {
    res.status(401).send('Invalid credentials');
  }
});

// Route to get all fares
app.get('/fare', (req, res) => {
  const query = `
    SELECT trip_type, vehicle_type, amount
    FROM Fare
  `;

  db.execute(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ error: 'Database query failed' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'No fare information found' });
    }

    res.json({ fares: results });
  });
});

// Route to get emergency services based on tollgate name
app.get('/emergency-services/:tollgate_name/:service_type', (req, res) => {
  const tollgateName = req.params.tollgate_name;
  const serviceType = req.params.service_type;

  console.log('Tollgate Name:', tollgateName, 'Service Type:', serviceType);

  // Call the stored procedure with parameters
  const query = `CALL GetEmergencyServices(?, ?)`;

  // Execute the stored procedure
  db.execute(query, [tollgateName, serviceType], (err, results) => {
    if (err) {
      console.error('Error executing stored procedure:', err);
      return res.status(500).json({ error: 'Database query failed' });
    }

    // If no services found
    if (results[0].length === 0) {
      return res.status(404).json({ message: 'No emergency services found for the given tollgate name and service type' });
    }

    // Return the results
    res.json({
      tollgate_name: tollgateName,
      service_type: serviceType,
      emergency_services: results[0]  // The results array is wrapped in a nested array
    });
  });
});
app.post('/add-user', authenticateToken, (req, res) => {
  const {vehicleId, vehicleType, tollgateId, triptype } = req.body;

  if (!vehicleId || !vehicleType || !tollgateId || !triptype) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  
  const query = 'CALL AddTollHistory(?, ?, ?, ?)';


  db.query(query, [vehicleId, vehicleType, tollgateId, triptype], (err, results) => {
    if (err) {
      console.error('Error adding user entry:', err);
      return res.status(500).json({ message: 'Database error while adding user entry.' });
    }
    res.status(201).json({ message: 'User entry added successfully.' });
  });
});

// Route to add a tollgate and associated information
// app.post('/add-tollgate', authenticateToken, (req, res) => {
//   const {
//     tollgateName,  // Matching field names
//     numLanes,
//     state,
//     area,
//     district,
//     fireStationAddress,
//     hospitalAddress,
//     policeStationAddress
//   } = req.body;

//   // Log request body to ensure it's coming through correctly
//   console.log('Request Body:', req.body);

//   // Validate the required fields are present
//   if (!tollgateName || !numLanes || !state || !area || !district) {
//     return res.status(400).json({ error: 'Missing required fields' });
//   }

//   // Log the input parameters before the DB call
//   console.log('Adding Tollgate:', {
//     tollgateName,
//     numLanes,
//     state,
//     area,
//     district,
//     fireStationAddress,
//     hospitalAddress,
//     policeStationAddress
//   });

//   // Ensure proper SQL query formation
//   const query = `CALL AddTollgate(?, ?, ?, ?, ?, ?, ?, ?)`;

//   // Execute the stored procedure
//   db.execute(query, [tollgateName, numLanes, state, area, district, fireStationAddress, hospitalAddress, policeStationAddress], (err, results) => {
//     if (err) {
//       console.error('Error executing stored procedure:', err);
//       return res.status(500).json({ error: 'Database query failed', details: err });
//     }

//     // Check if the tollgate was successfully added
//     if (!results || results.affectedRows === 0) {
//       return res.status(400).json({ message: 'Failed to add tollgate' });
//     }
//     else {
      
//     }

//     // Return success message
//     res.json({
//       message: 'Tollgate added successfully',
//       tollgate: {
//         tollgateName,
//         numLanes,
//         state,
//         area,
//         district,
//         emergency_services: {
//           fireStationAddress,
//           hospitalAddress,
//           policeStationAddress
//         }
//       }
//     });
//   });
// });


// View toll history for a specific vehicle
app.get('/view-toll-history/:tollgate_id', authenticateToken, (req, res) => {
  const { tollgate_id } = req.params;  // Updated to use tollgate_id

  const query = 'SELECT * FROM toll_history WHERE tollgate_id = ?';
  db.query(query, [tollgate_id], (err, results) => {  // Updated to use tollgate_id in query
    if (err) {
      console.error('Error fetching toll history:', err);
      return res.status(500).json({ message: 'Database error while fetching toll history.' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'No toll history found for the given Tollgate ID.' });
    }
    res.json({ toll_history: results });
  });
});

// In your server (e.g., `server.js` or a routes file)
app.get('/check-fare', authenticateToken, (req, res) => {
  const { date, tollgateId } = req.query;

  if (!date || !tollgateId) {
    return res.status(400).json({ message: 'Date and Tollgate ID are required.' });
  }

  const query = `CALL GetTollFareData(?, ?);`;

  db.query(query, [tollgateId, date], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching fare data from database.' });
    }

    const vehicles = results[0];
    const totalFare = vehicles.length > 0 ? vehicles[0].total_fare : 0;
    const vehicleCount = vehicles.length;
    console.log(vehicleCount);

    res.status(200).json({
      date,
      tollgateId,
      vehicles,
      totalFare,
      vehicleCount,
    });
  });
});


// Error Handling Middleware


// User Registration Route (hashing the password)
// app.post('/register-user', (req, res) => {
//   const { username, password, email } = req.body;

//   if (!username || !password || !email) {
//     return res.status(400).json({ message: 'Username, password, and email are required.' });
//   }

//   // Hash the password before saving it
//   bcrypt.hash(password, 10, (err, hashedPassword) => {
//     if (err) return res.status(500).json({ message: 'Error hashing the password.' });

//     // Store the user with hashed password in the database
//     const query = 'INSERT INTO users (username, password, email) VALUES (?, ?, ?)';
//     db.query(query, [username, hashedPassword, email], (err, results) => {
//       if (err) return res.status(500).json({ message: 'Database error while registering user.' });
//       res.status(201).json({ message: 'User registered successfully.' });
//     });
//   });
// });

app.post('/register-user', (req, res) => {
  const { username, password, email } = req.body;

  if (!username || !password || !email) {
    return res.status(400).json({ message: 'Username, password, and email are required.' });
  }

  // Hash the password before saving it
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) return res.status(500).json({ message: 'Error hashing the password.' });

    // Store the user with hashed password in the database
    const query = 'INSERT INTO users (username, password, email) VALUES (?, ?, ?)';
    db.query(query, [username, hashedPassword, email], (err, results) => {
      if (err) {
        // Handle error from the trigger if username is invalid
        if (err.sqlState === '45000') {
          return res.status(400).json({ message: err.message });
        }
        return res.status(500).json({ message: 'Database error while registering user.' });
      }
      res.status(201).json({ message: 'User registered successfully.' });
    });
  });
});



// User Login Route (comparing the hashed password)
// app.post('/login-user', (req, res) => {
//   const { username, password } = req.body;

//   if (!username || !password) {
//     return res.status(400).json({ status: 'error', message: 'Username and password are required.' });
//   }

//   db.query('SELECT id, username, password FROM users WHERE username = ?', [username], (err, results) => {
//     if (err) return res.status(500).json({ status: 'error', message: 'Database error while fetching user.' });
//     if (results.length === 0) return res.status(404).json({ status: 'error', message: 'User not found.' });

//     const user = results[0];

//     // Compare the input password with the hashed password stored in the database
//     bcrypt.compare(password, user.password, (err, isMatch) => {
//       if (err) return res.status(500).json({ status: 'error', message: 'Error comparing passwords.' });
//       if (!isMatch) return res.status(401).json({ status: 'error', message: 'Invalid credentials.' });

//       // Generate JWT token after successful login
//       const token = jwt.sign({ id: user.id, role: 'user' }, process.env.JWT_SECRET, { expiresIn: '1h' });
//       res.json({ status: 'success', token, expiresIn: 3600 }); // Expiration in seconds (1 hour)
//     });
//   });
// });

app.post('/login-user', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ status: 'error', message: 'Username and password are required.' });
  }

  db.query('SELECT id, username, password FROM users WHERE username = ?', [username], (err, results) => {
    if (err) {
      // If the error is due to the trigger (invalid username), handle it specifically
      if (err.sqlState === '45000') {
        return res.status(400).json({ status: 'error', message: err.message });
      }
      return res.status(500).json({ status: 'error', message: 'Database error while fetching user.' });
    }
    if (results.length === 0) return res.status(404).json({ status: 'error', message: 'User not found.' });

    const user = results[0];

    // Compare the input password with the hashed password stored in the database
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) return res.status(500).json({ status: 'error', message: 'Error comparing passwords.' });
      if (!isMatch) return res.status(401).json({ status: 'error', message: 'Invalid credentials.' });

      // Generate JWT token after successful login
      const token = jwt.sign({ id: user.id, role: 'user' }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ status: 'success', token, expiresIn: 3600 }); // Expiration in seconds (1 hour)
    });
  });
});



// 
app.get('/toll-history', (req, res) => {
  const { vehicleId, tollgateId } = req.query;

  // Validate the presence of the vehicleId
  if (!vehicleId) {
      return res.status(400).json({ error: 'Vehicle ID is required' });
  }

  // Base query to fetch toll history for the given vehicle with optional tollgate filter
  let query = `
      SELECT * FROM toll_history
      WHERE vehicle_id = ?
  `;

  // Parameters for the query (vehicleId is always required)
  let params = [vehicleId];

  // If tollgateId is provided, add it to the query and parameters
  if (tollgateId) {
      query += ` AND tollgate_id = ?`;
      params.push(tollgateId);
  }

  db.execute(query, params, (err, results) => {
      if (err) {
          console.error("Database query error:", err);
          return res.status(500).json({ error: 'Database query failed' });
      }

      // If no toll history found
      if (results.length === 0) {
          return res.status(404).json({ message: 'No toll history found for this vehicle and tollgate combination' });
      }

      // Return the results
      res.json({
          vehicle_id: vehicleId,
          toll_history: results,
      });
  });
});



// Staff Login Route (similar process for staff login)
app.post('/login-staff', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  db.query('SELECT staff_id, username, password FROM staff_credential WHERE username = ?', [username], (err, results) => {
    if (err) {
      console.error('Error fetching staff from DB:', err);
      return res.status(500).json({ message: 'Database error while fetching staff.' });
    }

    if (results.length === 0) {
      console.log('Staff not found with username:', username);
      return res.status(404).json({ message: 'Staff not found.' });
    }

    const staff = results[0];

    // Debugging: Log the entered password and the stored hashed password
    console.log('Entered password:', password);
    console.log('Stored hashed password:', staff.password);

    bcrypt.compare(password, staff.password, (err, isMatch) => {
      if (err) {
        console.error('Error comparing passwords:', err);
        return res.status(500).json({ message: 'Error comparing passwords.' });
      }

      console.log('Password comparison result:', isMatch);  // true or false

      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials.' });
      }

      const token = jwt.sign({ id: staff.staff_id, role: 'staff' }, process.env.JWT_SECRET, { expiresIn: '1h' });
      console.log('JWT Token generated:', token);  // Log the generated token

      res.json({ token, expiresIn: 3600 });
    });
  });
});


// Route to add a new staff member
app.post('/add-staff', authenticateToken, (req, res) => {
  const {
    first_name,
    last_name,
    tollgate_id,
    shift_start_time,
    shift_end_time,
    contact_info,
    role,
    password
  } = req.body;

  // Validate that all required fields are provided
  if (!first_name || !last_name || !tollgate_id || !shift_start_time || !shift_end_time || !contact_info || !role || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  // Insert the staff details first into the staff table
  const staffQuery = `
    INSERT INTO staff (first_name, last_name, tollgate_id, shift_start_time, shift_end_time, contact_info) 
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(staffQuery, [
    first_name,
    last_name,
    tollgate_id,
    shift_start_time,
    shift_end_time,
    contact_info
  ], (err, results) => {
    if (err) {
      console.error('Error adding staff details:', err);
      return res.status(500).json({ message: 'Error adding staff details to the database.' });
    }

    const staff_id = results.insertId; // Get the staff_id from the inserted record

    // Now, create the username as first_name@tollgate_id
    const username = `${first_name}@${tollgate_id}`;

    console.log('Generated username:', username);  // Debugging: Log generated username

    // Hash the password before saving it
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        console.error('Error hashing password during registration:', err);
        return res.status(500).json({ message: 'Error hashing the password.' });
      }

      console.log('Hashed password during registration:', hashedPassword);  // Log the hashed password

      // Insert the username, hashed password, and role into the staff_credential table
      const staffCredentialQuery = `
        INSERT INTO staff_credential (staff_id, username, password, role) 
        VALUES (?, ?, ?, ?)
      `;

      db.query(staffCredentialQuery, [staff_id, username, hashedPassword, role], (err, results) => {
        if (err) {
          console.error('Error adding staff credential:', err);
          return res.status(500).json({ message: 'Error adding staff credential to the database.' });
        }

        // Respond with success message
        res.status(201).json({ message: 'Staff member and credential added successfully.' });
      });
    });
  });
});

app.delete('/delete-staff/:id', authenticateToken, (req, res) => {
  console.log(`Received request to delete staff with ID: ${req.params.id}`);
  const { id } = req.params;
  console.log(id);

  const deleteStaffQuery = 'DELETE FROM staff WHERE staff_id = ?';

  db.query(deleteStaffQuery, [id], (err, results) => {
    if (err) {
      console.error('Error deleting staff member:', err);
      return res.status(500).json({ message: 'Database error while deleting the staff member' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Staff member not found' });
    }

    res.status(200).json({ message: 'Staff member deleted successfully' });
  });
});



// Route to add a tollgate and associated information
app.post('/add-tollgate', authenticateToken, (req, res) => {
  const {
    tollgateName,
    numLanes,
    state,
    area,
    district,
    fireStationAddress,
    hospitalAddress,
    policeStationAddress
  } = req.body;

  // Log request body to ensure it is coming through correctly
  //console.log('Request Body:', req.body);

  // Validate the required fields are present
  if (!tollgateName || !numLanes || !state || !area || !district) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Log the input parameters before the DB call
  // console.log('Adding Tollgate:', {
  //   tollgateName,
  //   numLanes,
  //   state,
  //   area,
  //   district,
  //   fireStationAddress,
  //   hospitalAddress,
  //   policeStationAddress
  // });

  // Ensure proper SQL query formation
  const query = `CALL AddTollgate(?, ?, ?, ?, ?, ?, ?, ?)`;

  // Execute the stored procedure
  db.execute(query, [tollgateName, numLanes, state, area, district, fireStationAddress, hospitalAddress, policeStationAddress], (err, results) => {
    if (err) {
      console.error('Error executing stored procedure:', err);
      return res.status(500).json({ error: 'Database query failed', details: err });
    }

    // Check if the tollgate was successfully added
    if (!results || results.affectedRows === 0) {
      return res.status(400).json({ message: 'Failed to add tollgate' });
    }

    // Return success message
    console.log(`✅ Alert: Tollgate '${tollgateName}' has been added successfully!`);
    res.json({
      status: 'success',
      message: 'Tollgate added successfully',
      tollgate: {
        tollgateName,
        numLanes,
        state,
        area,
        district,
        emergency_services: {
          fireStationAddress,
          hospitalAddress,
          policeStationAddress
        }
      }
    });
  });
});

app.get('/tollgate-schedule/:tollgateId', (req, res) => {
  const { tollgateId } = req.params; // Get tollgateId from the route params

  if (!tollgateId) {
    return res.status(400).json({ message: 'Tollgate ID is required.' });
  }

  // Query to fetch the schedule for the provided tollgateId
  const query = `
    SELECT s.staff_id, s.first_name, s.last_name, s.shift_start_time, s.shift_end_time
    FROM staff s
    WHERE s.tollgate_id = ?;  
  `;
  
  db.query(query, [tollgateId], (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ message: 'Database error while fetching schedule.' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'No schedule found for the given tollgate ID.' });
    }

    // Log the results to the server console
    console.log("Schedule fetched for tollgate ID:", tollgateId);
    console.log(results); // This will print the schedule data

    // Return the fetched schedule
    res.json(results);
  });
});


// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
