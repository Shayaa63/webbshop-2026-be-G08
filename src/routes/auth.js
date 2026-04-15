import { protect } from "../middleware/authMiddleware.js";
import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { validateRegister, validateAuthResult } from "../middleware/authValidation.js";
import { createUser, findUserByEmail } from "../db/users.js";
import User from "../models/User.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

const router = Router();

router.post(
  "/register",
  validateRegister,
  validateAuthResult,
  async (req, res) => {
    try {
      const { name, email, password } = req.body;

      const existingUser = await findUserByEmail(email);
      if (existingUser) {
        return res.status(409).json({ error: "Email already registered" });
      }
      const user = await createUser({
        name,
        email,
        password,
      });
      res.status(201).json({
        id: user._id,
        name: user.name,
        email: user.email,
      });
    } catch (error) {
  console.error("REGISTER ERROR:", error);
  res.status(500).json({ error: error.message });
}
  }
);

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token: token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
  console.error("LOGIN ERROR:", error);
  res.status(500).json({ error: error.message });
}
});

router.get("/me", protect, (req, res) => {
  res.json({
    message: "Du är inloggad 🔥",
    user: req.user,
  });
});

router.put("/me", protect, async (req, res) => {
  const user = await User.findById(req.user.userId);

  if (req.body.email) user.email = req.body.email;
  if (req.body.password) user.password = req.body.password;

  await user.save();

  res.json({ message: "User updated" });
});

router.patch("/:id/role", protect, adminOnly, async (req, res) => {
  const user = await User.findById(req.params.id);
  user.role = req.body.role; // "admin" eller "user"
  await user.save();
  res.json({ message: "Role updated", user });
});

export default router;