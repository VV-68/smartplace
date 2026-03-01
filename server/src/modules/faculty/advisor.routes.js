// modules/faculty/advisor.routes.js

const express = require("express");
const router = express.Router();

const authMiddleware = require("../../middleware/auth.middleware");
const roleMiddleware = require("../../middleware/role.middleware");
const advisorMiddleware = require("../../middleware/advisor.middleware");

const advisorController = require("./advisor.controller");

// Must be faculty + advisor
router.use(authMiddleware);
router.use(roleMiddleware("faculty"));
router.use(advisorMiddleware);

// View own students
router.get("/students", advisorController.getMyStudents);

// View documents of a student (must belong to advisor)
router.get("/students/:id/documents", advisorController.getStudentDocuments);

// Verify document
router.patch("/documents/:id/verify", advisorController.verifyDocument);

// Reject document
router.patch("/documents/:id/reject", advisorController.rejectDocument);

module.exports = router;