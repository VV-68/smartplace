require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

// Use the environment variable from .env file
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.get('/', async (req, res) => {
  try {
    const dbResult = await pool.query('SELECT NOW()');
    res.send(`Backend is running! DB Time: ${dbResult.rows[0].now}`);
  } catch (err) {
    res.status(500).send('Database connection failed: ' + err.message);
  }
});

app.listen(port, () => {
  console.log(`Backend listening at http://localhost:${port}`);
});
