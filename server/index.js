require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const { createClient } = require("@supabase/supabase-js");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY,
);

// Use the environment variable from .env file
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Middleware to protect routes
const authenticateUser = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Get token from "Bearer <token>"

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  // Ask Supabase if this token is valid
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);

  if (error || !user) {
    return res.status(401).json({ error: "Invalid token" });
  }

  // Attach user to request and move to the next function
  req.user = user;
  next();
};

app.get("/", async (req, res) => {
  try {
    const dbResult = await pool.query("SELECT NOW()");
    res.send(`Backend is running! DB Time: ${dbResult.rows[0].now}`);
  } catch (err) {
    console.error("Database Error:", err);
    res.status(500).json({
      error: "Database connection failed",
      message: err.message,
      code: err.code,
      detail: err.detail,
    });
  }
});

app.get("/db", authenticateUser, async (req, res) => {
  console.log(`User ${req.user.email} is accessing data`);
  try {
    const dbr = await pool.query("select fname, lname from users");
    res.json(dbr.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("DB Connection failed: " + err.message);
  }
});

app.listen(port, () => {
  console.log(`Backend listening at http://localhost:${port}`);
});
