import express from "express";
import { upload } from "../middlewares/uploadMiddleware.js";

import {
    createEvent,
    getAllEvents,
    getEventById,
    updateEvent,
    searchEvents ,
    deleteEvent,
    deleteOrganizerEvent,
    getEventsOrganizer,
    getOrganizerEventById,
    updateOrganizerEvent
} from "../controllers/eventControllers.js";

import protect from "../middlewares/authMiddleware.js";

import adminOnly from "../middlewares/adminMiddleware.js";

// import getEventsOrganizer from "../controllers/eventControllers.js";

// import getOrganizerEventById from "../controllers/eventControllers.js";
// import updateOrganizerEvent from "../controllers/eventControllers.js";



const router = express.Router();

router.get("/", getAllEvents);

router.get("/search", searchEvents);

router.get("/my-events", protect, adminOnly , getEventsOrganizer);

router.get("/your-events/:id", protect, adminOnly , getOrganizerEventById);

router.get("/:id", getEventById);       

router.post("/",  protect ,  adminOnly , upload.single("banner"), createEvent);

router.put("/:id",  protect ,  adminOnly , upload.single("banner"), updateOrganizerEvent);

router.delete("/:id",  protect ,  adminOnly , deleteOrganizerEvent);

export default router;