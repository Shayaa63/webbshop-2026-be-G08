import mongoose from "mongoose";

// A notification is created whenever something important happens
// related to a user's trades. It sits in the database until the
// user manually deletes it.
const notificationSchema = new mongoose.Schema(
  {
    // The user who receives this notification
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // The type of event that triggered this notification.
    // Why an enum? So the frontend can show different icons or colors
    // based on the type without having to parse the message text.
    type: {
      type: String,
      required: true,
      enum: [
        "TRADE_REQUEST_RECEIVED", // someone wants to trade with you
        "TRADE_ACCEPTED",         // your trade request was accepted
        "TRADE_REJECTED",         // your trade request was rejected
      ],
    },

    // Human readable message shown to the user
    // e.g. "Anna vill byta sin Monstera mot din Kaktus"
    message: {
      type: String,
      required: true,
      trim: true,
    },

    // Reference to the trade this notification is about.
    // Why store it? So the frontend can link directly to the
    // relevant trade when the user clicks the notification.
    trade: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trade",
      required: true,
    },

    // Whether the user has seen this notification.
    // Used to show unread counts e.g. a red badge with "3" on the
    // notifications button in the UI.
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // createdAt tells us when the notification was sent
  }
);

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;