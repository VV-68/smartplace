// middleware/role.middleware.js

const pool = require("../config/db");

const roleMiddleware = (requiredRole) => {
  return async (req, res, next) => {
    try {
      const result = await pool.query(
        "SELECT role FROM users WHERE user_id = $1",
        [req.user.id]
      );

      if (result.rowCount === 0) {
        return res.status(403).json({ error: "User not found." });
      }

      const userRole = result.rows[0].role;

      if (userRole !== requiredRole) {
        return res.status(403).json({ error: "Access denied." });
      }

      next();
    } catch (err) {
      return res.status(500).json({ error: "Role validation failed." });
    }
  };
};

module.exports = roleMiddleware;