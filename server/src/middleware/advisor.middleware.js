// middleware/advisor.middleware.js

const pool = require("../config/db");

const advisorMiddleware = async (req, res, next) => {
  try {
    const result = await pool.query(
      "SELECT is_staff_advisor FROM faculty WHERE user_id = $1",
      [req.user.id]
    );

    if (result.rowCount === 0) {
      return res.status(403).json({ error: "Faculty record not found." });
    }

    if (!result.rows[0].is_staff_advisor) {
      return res.status(403).json({ error: "Advisor access required." });
    }

    next();
  } catch (err) {
    return res.status(500).json({ error: "Advisor validation failed." });
  }
};

module.exports = advisorMiddleware;