import pool from '../db.js';
import { calculateDistance } from '../utils/haversine.js';

export const addSchool = async (req, res) => {
  try {
    const { name, address, latitude, longitude } = req.body;
    if (!name || !address || !latitude || !longitude) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    const query = 'INSERT INTO schools (name, address, latitude, longitude) VALUES ($1, $2, $3, $4) RETURNING *';
    const values = [name, address, latitude, longitude];
    const result = await pool.query(query, values);
    res.status(201).json({ message: 'School added successfully', school: result.rows[0] });
  } catch (error) {
    console.error('Add School Error:', error.message);
    res.status(500).json({ message: 'Failed to add school' });
  }
};

export const listSchools = async (req, res) => {
  try {
    const userLat = parseFloat(req.query.lat);
    const userLng = parseFloat(req.query.lng);
    if (!userLat || !userLng) {
      return res.status(400).json({ message: 'Latitude and Longitude are required.' });
    }

    const result = await pool.query('SELECT * FROM schools');
    const sorted = result.rows.map(school => ({
      ...school,
      distance: calculateDistance(userLat, userLng, school.latitude, school.longitude)
    })).sort((a, b) => a.distance - b.distance);

    res.json(sorted);
  } catch (error) {
    console.error('List Schools Error:', error.message);
    res.status(500).json({ message: 'Failed to retrieve schools' });
  }
};
