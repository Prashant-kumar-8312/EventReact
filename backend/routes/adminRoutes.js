import express from "express";
import { getOrganizerDashboardStats , getUpcomingEvents , getRecentBooking  , getOrganizerEventSales } from "../controllers/adminController.js";
import protect from "../middlewares/authMiddleware.js";
import adminOnly from "../middlewares/adminMiddleware.js";

const router = express.Router();


// Admin dashboard
router.get(
  "/stats",
  protect,
  adminOnly,
  getOrganizerDashboardStats
);

router.get(
  "/upcoming-events",
  protect,
  adminOnly,
  getUpcomingEvents
);

router.get(
  "/recent-bookings",
  protect,
  adminOnly,
  getRecentBooking
);

router.get(
  "/event-sales",
  protect,
  adminOnly,
  getOrganizerEventSales
);

export default router;