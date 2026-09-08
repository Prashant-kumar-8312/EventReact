import express from "express";
import "dotenv/config";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";

import eventRoutes from "./routes/eventRoutes.js";

import bookingRoutes from "./routes/bookingRoutes.js";

import adminRoutes from "./routes/adminRoutes.js";

import Booking from "./models/Booking.js";
import Event from "./models/Event.js";
 import connectDB from "./config/db.js";

connectDB();

// console.log("booking delete");

// await Booking.deleteMany({});

// await Event.deleteMany({});
// console.log("data deleted");

const app = express();

app.use(cors());

app.use(express.json());

console.log("ENV TEST");
console.log("CLOUD:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("KEY:", process.env.CLOUDINARY_API_KEY);
console.log("SECRET:", process.env.CLOUDINARY_API_SECRET);

app.get("/", (req, res) => {
    res.json({
        message: "API Running"
    });
});

app.use("/api/auth", authRoutes);

app.use("/api/events", eventRoutes);

app.use("/api/bookings" , bookingRoutes);

app.use("/api/dashboard" , adminRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});

