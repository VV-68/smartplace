const express = require("express");
const router = express.Router();

const facultyRoutes = require("../modules/faculty/faculty.routes");
const advisorRoutes = require("../modules/faculty/advisor.routes");
const studentRoutes = require("../modules/student/student.routes");
const documentRoutes = require("../modules/student/documents.routes"); 
const adminRoutes = require("../modules/admin/admin.routes");
const companyRoutes = require("../modules/company/company.routes");
const alumniRoutes = require("../modules/alumni/alumni.routes");
const notificationRoutes = require("../modules/notification/notification.routes"); // Added Notification Routes

router.use("/faculty", facultyRoutes);
router.use("/advisor", advisorRoutes);
router.use("/student", studentRoutes);
router.use("/student", documentRoutes); 
router.use("/admin", adminRoutes);
router.use("/company", companyRoutes);
router.use("/alumni", alumniRoutes);
router.use("/notifications", notificationRoutes); // Added Notification Endpoints

module.exports = router;