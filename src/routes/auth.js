import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";
import {
  register,
  login,
  getMe,
  updateMe,
  updateUserRole
} from "../controllers/authController.js";
import { validateRegister, validateAuthResult } from "../middleware/authValidation.js";

const router = Router();

router.post("/register", validateRegister, validateAuthResult, register);
router.post("/login", login);

router.get("/me", protect, getMe);
router.put("/me", protect, updateMe);

router.patch("/:id/role", protect, adminOnly, updateUserRole);

export default router;