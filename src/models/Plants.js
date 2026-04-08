import mongoose from "mongoose";

const plantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    imageUrl: {
      type: String,
      required: true,
      trim: true,

    },

    lightLevel: {
      type: Number,
      required: true,
      enum: [1, 2, 3], // 1 = Low, 2 = Medium, 3 = High
    },

    // --- LOCATION ---
    // We store both so the frontend team has what they need:
    // coordinates → Leaflet uses these to place the pin on the map
    // address     → Nominatim reverse geocodes the coordinates into this,
    //               the UI displays it as a readable street name/address
    location: {
      address: {
        type: String, // e.g. "Drottninggatan 10, Stockholm"
        trim: true,
      },
    },

    // --- OWNER ---
    // Stores the ID of the User who listed this plant.
    // Why an ObjectId ref and not just a name string?
    // Because with ref: "User" you can call .populate("owner") later
    // to automatically fetch the full user object in a single query,
    // instead of making two separate database calls.
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false
    },

    // Whether the plant is still available for trading.
    // Set to false once a trade is accepted so it stops showing up
    // as available on the map and in listings.
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Plant = mongoose.model("Plant", plantSchema);

export default Plant;