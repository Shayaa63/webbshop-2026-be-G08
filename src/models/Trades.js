import mongoose from "mongoose";

// A trade represents one user requesting to swap their plant
// for another user's plant. It tracks who wants what, and
// the current status of the negotiation.
const tradeSchema = new mongoose.Schema(
  {
    // The user who initiated the trade request
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // The user who owns the plant being requested
    // (they are the ones who will accept or reject)
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // The plant the requester is OFFERING in the trade
    offeredPlant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plant",
      required: true,
    },

    // The plant the requester WANTS from the receiver
    requestedPlant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plant",
      required: true,
    },

    // --- STATUS ---
    // Tracks where in the process the trade is:
    // "posted"   → requester has sent the request, receiver hasn't seen it yet
    // "pending"  → receiver has seen it but hasn't responded
    // "accepted" → receiver agreed to the trade
    // "rejected" → receiver declined the trade
    status: {
      type: String,
      enum: ["posted", "pending", "accepted", "rejected"],
      default: "posted",
    },

    // Optional message the requester can send with the trade request,
    // e.g. "Hi! I'd love to trade my monstera for your cactus :)"
    //message: {
    //  type: String,
    //  trim: true,
    //},
  },
  {
    timestamps: true, // createdAt tells you when the request was sent
  }
);

const Trade = mongoose.model("Trade", tradeSchema);

export default Trade;