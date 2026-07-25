import express from "express";
import {
  getAbout,
  updateAbout,
  getFeatureCards,
  getFeatureCardsAdmin,
  addFeatureCard,
  updateFeatureCard,
  deleteFeatureCard,
} from "../controllers/aboutController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAbout);
router.put("/", protect, adminOnly, updateAbout);

// Feature cards (e.g. Problem Solving, Web Development, ...).
// NOTE: "/feature-cards/admin" must be registered before
// "/feature-cards/:cardId" or Express will treat "admin" as a :cardId.
router.get("/feature-cards", getFeatureCards);
router.get("/feature-cards/admin", protect, adminOnly, getFeatureCardsAdmin);
router.post("/feature-cards", protect, adminOnly, addFeatureCard);
router.put("/feature-cards/:cardId", protect, adminOnly, updateFeatureCard);
router.delete("/feature-cards/:cardId", protect, adminOnly, deleteFeatureCard);

export default router;
