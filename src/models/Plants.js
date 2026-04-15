import mongoose from "mongoose";

const plantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    species: {
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
      enum: [1, 2, 3],
    },
    location: {
      address: {
        type: String,
        trim: true,
      },
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false
    },
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