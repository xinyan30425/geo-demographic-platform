const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');  // Import CORS
const app = express();
const port = 3001;

// Use CORS middleware
app.use(cors());

// Set up the PostgreSQL client
const pool = new Pool({
  user: 'xinyanliu',
  host: 'localhost',
  database: 'mydatabase',
  password: 'password',  // Replace with your actual PostgreSQL password
  port: 5434,
});

// API endpoint to get GeoJSON data
app.get('/geojson', async (req, res) => {
  try {
    const result = await pool.query('SELECT geoid10, ST_AsGeoJSON(geom) as geometry FROM puma_newengland');
    const geoJson = {
      type: "FeatureCollection",
      features: result.rows.map(row => ({
        type: "Feature",
        properties: { GEOID10: row.geoid10 },
        geometry: JSON.parse(row.geometry)
      }))
    };
    res.json(geoJson);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// API endpoint to get CSV data
app.get('/csvdata', async (req, res) => {
  try {
    const result = await pool.query('SELECT geoid, affected_population, total_population, percentage FROM alzheimer_data');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


// GeoJSON Data: http://localhost:3001/geojson
// CSV Data: http://localhost:3001/csvdata