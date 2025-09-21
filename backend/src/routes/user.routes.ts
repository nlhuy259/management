import { Router } from "express";
import { getAllUsers, getUserDetail, updateUserProfile, deleteUserById } from "../controllers/user.controller";
import { authenticate, authorizeManager } from "../middlewares/auth.middleware";

const router = Router();

router.get("/",getAllUsers);
router.get("/:id", authenticate, authorizeManager, getUserDetail);
router.put("/:id", authenticate, authorizeManager, updateUserProfile);
router.delete("/:id", authenticate, authorizeManager, deleteUserById);

export default router;
