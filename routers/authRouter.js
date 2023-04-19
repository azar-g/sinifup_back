import { Router } from "express";
import authenticatedUser from "../middleware/authentication";
import { register, login } from "../controllers/auth";

const router = Router();
router.post("/register", register);
router.post("/login", login);
// router.patch("/updateUser", authenticatedUser, updateUser);

export default router;
