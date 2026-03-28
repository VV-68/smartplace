const supabaseAdmin = require('../../config/supabaseAdmin');

class NotificationService {
  async createNotification(receiver_id, message) {
    if (!receiver_id || !message) {
      throw new Error('receiver_id and message are required');
    }

    const { data, error } = await supabaseAdmin
      .from('notifications')
      .insert([{ receiver_id, message }])
      .select()
      .single();

    if (error) {
      console.error('Error creating notification:', error);
      throw new Error('Failed to create notification');
    }

    return data;
  }

  async getUserNotifications(receiver_id) {
    const { data, error } = await supabaseAdmin
      .from('notifications')
      .select('*')
      .eq('receiver_id', receiver_id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching notifications:', error);
      throw new Error('Failed to fetch notifications');
    }

    return data;
  }

  async markAsRead(notificationId, receiver_id) {
    const { data, error } = await supabaseAdmin
      .from('notifications')
      .update({ read_status: true })
      .eq('id', notificationId)
      .eq('receiver_id', receiver_id)
      .select()
      .single();

    if (error) {
      console.error('Error marking notification as read:', error);
      throw new Error('Failed to mark notification as read');
    }

    return data;
  }

  async clearAllNotifications(receiver_id) {
    const { data, error } = await supabaseAdmin
      .from('notifications')
      .delete()
      .eq('receiver_id', receiver_id);

    if (error) {
      console.error('Error clearing notifications:', error);
      throw new Error('Failed to clear notifications');
    }

    return { message: 'Notifications cleared successfully' };
  }
}

module.exports = new NotificationService();
