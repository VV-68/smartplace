const notificationService = require('./notification.service');

exports.getUserNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const notifications = await notificationService.getUserNotifications(userId);
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const notification = await notificationService.markAsRead(id, userId);
    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    await notificationService.markAllAsRead(userId);
    res.status(200).json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.clearAllNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    await notificationService.clearAllNotifications(userId);
    res.status(200).json({ message: 'All notifications cleared' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.notifyAdmins = async (req, res) => {
  try {
    const { message } = req.body;
    const notificationService = require('./notification.service');
    const pool = require('../../config/db');
    const admins = await pool.query(`SELECT user_id FROM users WHERE role = 'admin'`);
    for (const admin of admins.rows) {
      await notificationService.createNotification(admin.user_id, message);
    }
    res.status(200).json({ message: 'Admins notified' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
