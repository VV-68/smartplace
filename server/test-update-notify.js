require('dotenv').config();
const pool = require('./src/config/db');
const notificationService = require('./src/modules/notification/notification.service');

async function run() {
  try {
    // 1. Get the last test notification
    const { rows } = await pool.query('SELECT * FROM notifications ORDER BY created_at DESC LIMIT 1');
    if (rows.length === 0) return;
    
    const notification = rows[0];
    console.log('Before update:', notification.read_status);
    
    // 2. Update to read_status = true
    const updated = await notificationService.markAsRead(notification.id, notification.receiver_id);
    console.log('After update:', updated.read_status);
    
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}

run();
