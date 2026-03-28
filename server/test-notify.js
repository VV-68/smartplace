require('dotenv').config();
const notificationService = require('./src/modules/notification/notification.service');
const pool = require('./src/config/db');

async function run() {
  try {
    const { rows } = await pool.query('SELECT user_id FROM users LIMIT 1');
    if (rows.length === 0) {
      console.log('No users found.');
      return;
    }
    const receiver_id = rows[0].user_id;

    await notificationService.createNotification(receiver_id, 'Test notification for unread count badge');
    console.log('Test notification inserted successfully for user:', receiver_id);
  } catch (err) {
    console.error(err);
  } finally {
    process.exit();
  }
}

run();
