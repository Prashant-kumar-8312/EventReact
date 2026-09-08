import User from "../models/User.js";
import Event from "../models/Event.js";
import Booking from "../models/Booking.js";
import mongoose from "mongoose";

// export const getDashboardStats = async (req , res ) => {
//        try{
//           const totalUsers = await User.countDocuments();

//           const totalEvents = await Event.countDocuments();

//             const totalBookings = await Booking.countDocuments();

//             const paidBookings = await Booking.find({
//                  paymentStatus: "paid",
//                  bookingStatus: {
//                     $ne: "cancelled",
//                  },
//             });

//             const ticketSold = paidBookings.reduce((total, booking) => total + booking.ticketsBooked, 0);

//             const totalRevenue = paidBookings.reduce((total, booking) => total + booking.totalPrice, 0);

//             res.json({
//                 totalUsers,
//                 totalEvents,
//                 totalBookings,
//                 ticketSold,
//                 totalRevenue
//             });
//        } catch(error){
//         console.error("Error fetching dashboard stats:", error);
//         res.status(500).json({ message: "Failed to fetch dashboard statistics" });
//        }
// };

export const getOrganizerDashboardStats = async (req, res) => {
  try {
    const organizerId = req.user.id;

    // Get only events created by this organizer
    const organizerEvents = await Event.find({
      organizer: organizerId
    }).select("_id");

    const eventIds = organizerEvents.map((event) => event._id);

    // Get only bookings for organizer's events
    const bookings = await Booking.find({
      event: { $in: eventIds },
      paymentStatus: "paid",
      bookingStatus: {
        $ne: "cancelled"
      }
    });

    // Total events created by organizer
    const totalEvents = organizerEvents.length;

    // Total paid bookings
    const totalBookings = bookings.length;

    // Total tickets sold
    const ticketSold = bookings.reduce(
      (total, booking) =>
        total + (booking.ticketQuantity || 0),
      0
    );

    // Total revenue
    const totalRevenue = bookings.reduce(
      (total, booking) =>
        total + (booking.totalPrice || 0),
      0
    );

    res.json({
      totalEvents,
      totalBookings,
      ticketSold,
      totalRevenue
    });

  } catch (error) {
    console.error(
      "Error fetching organizer dashboard stats:",
      error
    );

    res.status(500).json({
      message: "Failed to fetch organizer dashboard statistics"
    });
  }
};

export const getUpcomingEvents = async (req, res) => {
    try {
        const upcomingEvents = await Event.find({ date: { $gte: new Date() } }).sort({ date: 1 }).limit(5);
        res.json({ upcomingEvents });
    } catch (error) {
        console.error("Error fetching upcoming events:", error);
        res.status(500).json({ message: "Failed to fetch upcoming events" });
    }
};

export const getRecentBooking = async (req , res ) => {
       
    try{
        const recentBookings = await Booking.find().sort({ bookingDate: -1 }).limit(5).populate('user', 'name email').populate('event', 'title date').limit(10);

        res.status(200).json({
            recentBookings,
        });

    } catch(error){
        console.error("Error fetching recent bookings:", error);
        res.status(500).json({ message: "Failed to fetch recent bookings" });
    }
}

// export const getEventSales = async (req, res) => {
//     try {
//         const salesData = await Booking.aggregate([
//             {
//                 $match: { paymentStatus: "paid" , bookingStatus :{$ne : "cancelled" , }, },
//             },

//             {
//                 $group: {
//                     _id: "$event",

//                     ticketSold : {
//                         $sum : "$ticketQuantity",
//                     },

//                     revenue : {
//                         $sum: "$totalPrice",
//                     },
//                 },
//             },

//             {
//                 $lookup: {
//                     from: "events",
//                     localField: "_id",      
//                 foreignField: "_id",
//                 as: "eventDetails",
//                 },
//             },
       
//             {
//     $unwind: "$eventDetails",
//         },
           
//         {
//                 $project: {
//                     _id: 0,
                   
//                     eventId: "$_id",
// title: "$eventDetails.title",

//                     ticketSold: 1,

//                     revenue: 1,
//                 },
//             },

//             {
//                 $sort: { ticketSold: -1 },
//             },
        
//         ]);

//         res.status(200).json({
//             salesData,
//         });

//     } catch (error) {
//         console.error("Error fetching event sales data:", error);
//         res.status(500).json({ message: "Failed to fetch event sales data" });
//     }

// };


export const getOrganizerEventSales = async (req, res) => {
  try {
    const organizerId = new mongoose.Types.ObjectId(req.user.id);

    const salesData = await Booking.aggregate([
      {
        $match: {
          paymentStatus: "paid",
          bookingStatus: {
            $ne: "cancelled"
          }
        }
      },

      {
        $lookup: {
          from: "events",
          localField: "event",
          foreignField: "_id",
          as: "eventDetails"
        }
      },

      {
        $unwind: "$eventDetails"
      },

      // Only events created by logged-in organizer
      {
        $match: {
          "eventDetails.organizer": organizerId
        }
      },

      {
        $group: {
          _id: "$event",

          ticketSold: {
            $sum: "$ticketQuantity"
          },

          revenue: {
            $sum: "$totalPrice"
          }
        }
      },

      {
        $project: {
          _id: 0,
          eventId: "$_id",
          title: "$eventDetails.title",
          ticketSold: 1,
          revenue: 1
        }
      },

      {
        $sort: {
          ticketSold: -1
        }
      }
    ]);

    res.status(200).json({
      success: true,
      salesData
    });

  } catch (error) {
    console.error(
      "Error fetching organizer event sales:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch organizer event sales"
    });
  }
};


