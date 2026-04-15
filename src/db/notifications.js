import Notification from "../models/Notification.js";

// Creates a new notification.
// Called from the trades route whenever a trade event happens.
export async function createNotification(data) {
  try {
    const notification = new Notification(data);
    await notification.save();
    return notification;
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
}

// Fetches all notifications for a specific user, newest first.
export async function getNotificationsByUser(userId) {
  try {
    const notifications = await Notification.find({ recipient: userId })
      .sort({ createdAt: -1 })
      .populate("trade"); // automatically fetches the full trade object
    return notifications;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }
}

// Marks a single notification as read.
// Called when the user clicks/views a notification.
export async function markAsRead(notificationId) {
  try {
    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true }
    );
    if (!notification) {
      throw new Error("Notification not found");
    }
    return notification;
  } catch (error) {
    console.error("Error marking notification as read:", error);
    throw error;
  }
}

// Deletes a single notification.
export async function deleteNotification(notificationId) {
  try {
    const notification = await Notification.findByIdAndDelete(notificationId);
    if (!notification) {
      throw new Error("Notification not found");
    }
    return notification;
  } catch (error) {
    console.error("Error deleting notification:", error);
    throw error;
  }
}

// Returns the count of unread notifications for a user.
// Useful for showing a badge number in the UI without fetching
// all notifications every time.
export async function getUnreadCount(userId) {
  try {
    return await Notification.countDocuments({
      recipient: userId,
      isRead: false,
    });
  } catch (error) {
    console.error("Error counting unread notifications:", error);
    throw error;
  }
}