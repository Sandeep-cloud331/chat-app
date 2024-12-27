import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getMeassages, getUsersForSidebar, sendMessage } from "../controllers/meassage.controller.js";

const router = express.Router();

router.get("/users",protectRoute,getUsersForSidebar);
router.get("/:id",protectRoute,getMeassages);

router.post("/send/:id", protectRoute,sendMessage)

export default router;