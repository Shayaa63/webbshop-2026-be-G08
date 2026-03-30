import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,   // no two users can share an email
      trim: true,
      lowercase: true, // stores "Byron@mail.com" as "byron@mail.com" so casing never causes login issues
    },

    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // auto adds createdAt and updatedAt
  }
);
/* DATA MODEL RELATIONSHIPS
User
 │
 ├──owns──► Plant (owner → User._id)
 │
 └──trades─► Trade
               ├── requester → User._id
               ├── receiver  → User._id
               ├── offeredPlant   → Plant._id
               └── requestedPlant → Plant._id
*/

// --- PRE-SAVE HOOK ---
// Runs automatically before saving. Hashes the password if it was just
// set or changed. "isModified" prevents re-hashing an already hashed
// password when other fields like name or email are updated.
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// --- INSTANCE METHOD ---
// Lets you call user.comparePassword("plaintext") from the auth controller.
// bcrypt.compare hashes the plain input and checks it against the stored hash.
userSchema.methods.comparePassword = function (plainPassword) {
  return bcrypt.compare(plainPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;