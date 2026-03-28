const express = require('express');
const router = express.Router();
const notificationController = require('./notification.controller');
const verifyToken = require('../../middleware/auth.middleware');;

router.get('/', verifyToken, notificationController.getUserNotifications);
router.patch('/:id/read', verifyToken, notificationController.markAsRead);
router.delete('/clear', verifyToken, notificationController.clearAllNotifications);

router.post('/notifyAdmins', notificationController.notifyAdmins);

module.exports = router;
