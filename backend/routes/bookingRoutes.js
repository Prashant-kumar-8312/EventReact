import express from "express";

import { createBooking , getMyBookings , getBookingById , cancelBooking, markBookingPaid  , getAllBookings , verifyTicket} from "../controllers/bookingController.js";
 
import protect from "../middlewares/authMiddleware.js";
import adminOnly from "../middlewares/adminMiddleware.js";

const router = express.Router();


// Create booking
router.post("/", protect, createBooking);


// Get logged-in user's bookings
router.get("/my", protect, getMyBookings);


// Get single booking
router.get("/:id", protect, getBookingById);


// Cancel booking
router.delete("/:id", protect, cancelBooking);


// Organizer route 

router.post("/admin/all" , protect, adminOnly ,  getAllBookings);

router.post("/admin/verify" , protect, adminOnly ,  verifyTicket );

router.put("/admin/:id/payment" , protect , adminOnly , markBookingPaid);


export default router;