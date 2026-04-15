import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getNotificationsByUser,
  markAsRead,
  deleteNotification,
  getUnreadCount,
} from "../db/notifications.js";

const router = Router();

// GET /notifications
// Returns all notifications for the logged in user.
// Protected — must be logged in to fetch your notifications.
router.get("/", protect, async (req, res) => {
  try {
    const notifications = await getNotificationsByUser(req.user.userId);
    res.json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
});

// GET /notifications/unread-count
// Returns just the number of unread notifications.
// Why a separate route? The frontend can poll this frequently
// to update the badge without fetching all notifications every time.
router.get("/unread-count", protect, async (req, res) => {
  try {
    const count = await getUnreadCount(req.user.userId);
    res.json({ count });
  } catch (error) {
    console.error("Error fetching unread count:", error);
    res.status(500).json({ error: "Failed to fetch unread count" });
  }
});

// PUT /notifications/:id/read
// Marks a single notification as read.
router.put("/:id/read", protect, async (req, res) => {
  try {
    const notification = await markAsRead(req.params.id);
    res.json(notification);
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({ error: "Failed to mark notification as read" });
  }
});

// DELETE /notifications/:id
// Deletes a single notification.
// Only the recipient should be able to delete their own notifications.
router.delete("/:id", protect, async (req, res) => {
  try {
    const notification = await deleteNotification(req.params.id);

    // Ownership check — make sure the logged in user owns this notification
    if (notification.recipient.toString() !== req.user.userId.toString()) {
      return res.status(403).json({ error: "Not authorized" });
    }

    res.json({ message: "Notification deleted successfully" });
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({ error: "Failed to delete notification" });
  }
});

export default router;