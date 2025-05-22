import connection from "../db.js";
import { calculateDistance } from "../utils/haversine.js";

export const addSchool = (req, res) => {
  const { name, address, latitude, longitude } = req.body;


  if (!name || !address || !latitude || !longitude) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  const sql = 'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)';
  const values = [name, address, latitude, longitude];

  connection.query(sql, values, (err, result) => {
    if (err) {
      console.error('DB Insert Error:', err.message);
      return res.status(500).json({ message: 'Failed to add school' });
    }
    res.status(201).json({ message: 'School added successfully', schoolId: result.insertId });
  });
};


export const listSchools = (req, res) => {
  const userLat = parseFloat(req.query.lat);
  const userLng = parseFloat(req.query.lng);

  if (!userLat || !userLng) {
    return res.status(400).json({ message: 'Latitude and Longitude are required as query params.' });
  }

  const sql = 'SELECT * FROM schools';

  connection.query(sql, (err, results) => {
    if (err) {
      console.error('DB Fetch Error:', err.message);
      return res.status(500).json({ message: 'Failed to retrieve schools' });
    }

    const sorted = results
      .map(school => ({
        ...school,
        distance: calculateDistance(userLat, userLng, school.latitude, school.longitude)
      }))
      .sort((a, b) => a.distance - b.distance);

    res.json(sorted);
  });
};