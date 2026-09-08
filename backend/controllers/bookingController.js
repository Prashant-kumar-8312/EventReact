import Booking from "../models/Booking.js";

import Event from "../models/Event.js";

import mongoose from "mongoose";

import generateBookingReference from "../utils/generateBookingReference.js";

import generateQR from "../utils/generateQR.js";


const MAX_TICKETS_PER_BOOKING = 5;

export const createBooking = async (req, res) => {

    const session = await mongoose.startSession();

    try{

        session.startTransaction();

        const { eventId, ticketQuantity } = req.body;

        if(!eventId || !ticketQuantity) {
            return res.status(400).json({
                message: "Event ID and ticket quantity are required",
            });
        }

        const quantity = Number(ticketQuantity);

        if(!Number.isInteger(ticketQuantity) || ticketQuantity <= 0) {
              
            await session.abortTransaction();

            return res.status(400).json({
                message: "Event ID and ticket quantity are required",
            });

        }

        if(quantity > MAX_TICKETS_PER_BOOKING) {
            await session.abortTransaction();

            return res.status(400).json({
                message: `You can only book up to ${MAX_TICKETS_PER_BOOKING} tickets per booking`,
            });
        }

        const allEvent = await Event.findById(eventId).session(session);

        if(!allEvent){
            await session.abortTransaction();
            return res.status(404).json({
                message: "Event not found",
            });
        }

        const allEventDateTime = new Date (allEvent.date);

        const [hours , minutes] = allEvent.time.split(":");

        allEventDateTime.setHours(  Number( hours) , Number( minutes) , 0 , 0 );

        if(allEventDateTime <= new Date()){
            await session.abortTransaction();
            return res.status(400).json({
                message: "Cannot book tickets for past events",
            });
        }

        // Atomic seat Update

        const event = await Event.findOneAndUpdate({
              _id:eventId,
              availableSeats: {
                 $gte: ticketQuantity,
              },
        },
        {
            $inc : {
                availableSeats: -ticketQuantity,
            },
        },
        {
            new : true,
            session,
        }

    
    
    );

    // Event does not exits or insufficient seats

    if(!event){
          
        await session.abortTransaction();

        const existingEvent = await Event.findById(eventId);

        if(!existingEvent){
             
            return res.status(404).json({
                message: "Event not found",
            });
        }

        return res.status(400).json({
            message: "Insufficient available seats",
        });
    }

    // calculate total price

    const totalPrice = event.price * ticketQuantity;

    // Generate unique booking reference
    const bookingReference = generateBookingReference();

    const qrData = JSON.stringify({
        bookingReference,
        eventId: event._id,
        userId: req.user._id,
        ticketQuantity,
    });

    const qrCode = await generateQR(qrData);

    // create booking inside transaction

  const booking = await Booking.create([{
       bookingReference,
        user: req.user._id,
        event: eventId,
        ticketQuantity,
        totalPrice,
        paymentStatus: "paid",
        bookingStatus: "confirmed",
        qrCode,
    } , ], 
    { 
        session 
    }
 
     );

     // Commit transaction

      await session.commitTransaction();

      const populatedBooking = await Booking.findById(booking[0]._id)
                              .populate("user", "name email")
                              .populate(
                                "event",
                                "title venue location date time price banner"
                              );

                         res.status(201).json({
                            message : "Ticket booked successfully",
                            booking: populatedBooking,
                         });

                        
        

    }catch(error){
          
         // Rollback everything

         await session.abortTransaction();

         console.log("create booking error" , error);

         res.status(500).json({
            message : "Booking failed",
            error : error.message,
         });


    }finally{
        await session.endSession();
    }

};
         
    



 export const getMyBookings = async (req, res) => {

    try{
        const bookings = await Booking.find({ user: req.user._id }).populate("event" , "title date time venue location price banner").sort({ createdAt: -1 });

        res.status(200).json({
            count: bookings.length,
            bookings
        });
    }catch(error){
        console.log("get my bookings error" , error);

        res.status(500).json({
            message: "Failed to fetch bookings",
        });
    }
};

// export const getBookingById = async (req , res ) => {
      
//     try{
//           const booking = await Booking.findById(req.params.id)
//                         .populate("user" , "name email")
//                         .populate("event" , "title description venue location date time price banner");

//                         if(!booking) {
                               
//                               return res.status(404).json({
//                                 message: "Booking not found",
//                               });
//                         }

//                         // User can only view their own booking

//                         if(booking.user._id.toString() != req.user._id.toString() && req.user.role !== "Organizer"){
//                               return res.status(403).json({
//                                  message: "Not authorized to view this booking",
//                               });
//                         }

//                         res.status(200).json({
//                             booking,
//                         });

                        

                        
//     }catch(error){ 
          
//         console.log("Get booking error" , error);

//         res.status(500).json({
//             message: "Failed to fetch booking",
//         });
//     }
// }

export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.user._id,
    })
      .populate(
        "event",
        "title description category venue location date time price banner"
      )
      .populate(
        "user",
        "name email"
      );

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    res.status(200).json(booking);

  } catch (error) {
    console.error("Get booking error:", error);

    res.status(500).json({
      message: "Failed to fetch booking",
    });
  }
};

export const cancelBooking = async (req , res) => {
      
    try{
         const booking = await Booking.findById(req.params.id);

         if(!booking){
             return res.status(404).json({
                message : "Booking not found",
             });
         }

         if(booking.user.toString() !== req.user._id.toString() && req.user.role !== "Organizer"){
                return res.status(403).json({
                    message: "Not authorized to cancel this booking",
                });
         }

         if (booking.bookingStatus === "cancelled"){
            return res.status(400).json({
                message: "Booking is already cancelled",
            });
         }

         const event = await Event.findById(booking.event);

         if(!event){
            return res.status(404).json({
                message: "Event not found",
            });
         }

         event.availableSeats = event.availableSeats + booking.ticketQuantity;

         if(event.availableSeats > event.capacity){
             event.availableSeats = event.capacity;
         }

         await event.save();

         booking.bookingStatus = "cancelled";

         await booking.save();

         res.status(200).json({
            message: "Booking cancelled successfully",
            booking,
         });

    }
    catch(error){
         
        console.log("Cancel booking error" , error);

        res.status(500).json({
             message: "Failed to cancel booking",
        })
    }
};


 export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email")
      .populate(
        "event",
        "title venue location date time price"
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error("Get all bookings error:", error);

    res.status(500).json({
      message: "Failed to fetch bookings",
    });
  }
};

export const verifyTicket = async (req, res) => {
  try {
    const { bookingReference } = req.body;

    if (!bookingReference) {
      return res.status(400).json({
        message: "Booking reference is required",
      });
    }

    const booking = await Booking.findOne({
      bookingReference,
    })
      .populate("user", "name email")
      .populate(
        "event",
        "title venue location date time"
      );

    if (!booking) {
      return res.status(404).json({
        valid: false,
        message: "Invalid ticket",
      });
    }

    // Check if cancelled
    if (booking.bookingStatus === "cancelled") {
      return res.status(400).json({
        valid: false,
        message: "This ticket has been cancelled",
      });
    }

    // Check if already used
    if (booking.bookingStatus === "completed") {
      return res.status(400).json({
        valid: false,
        message: "This ticket has already been used",
        booking,
      });
    }

    // Check payment
    if (booking.paymentStatus !== "paid") {
      return res.status(400).json({
        valid: false,
        message: "Payment has not been completed",
      });
    }

    if (!booking.usedAt) {
  booking.usedAt = new Date();
  await booking.save();
}

    // Mark ticket as used
    booking.bookingStatus = "completed";

    await booking.save();

    res.status(200).json({
      valid: true,
      message: "Ticket verified successfully",
      booking,
    });
  } catch (error) {
    console.error("Verify ticket error:", error);

    res.status(500).json({
      valid: false,
      message: "Failed to verify ticket",
    });
  }
};

export const markBookingPaid = async (req, res) => {
    try{
        const booking = await Booking.findById(req.params.id);

        if(!booking){
            return res.status(404).json({
                message: "Booking not found",
            });
        }

        if(booking.bookingStatus === "cancelled"){
            return res.status(400).json({
                message: "Cannot mark a cancelled booking as paid",
            });
        }

        booking.paymentStatus = "paid";

        await booking.save();

        res.status(200).json({
            message: "Booking marked as paid successfully",
            booking,
        });

    }catch (error){
            console.log("Mark paid error" , error);

            res.status(500).json({
                message: "Failed to update payment",
            });
    }

    };

