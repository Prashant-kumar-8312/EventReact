import Event from "../models/Event.js";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";

export const createEvent = async (req , res ) => {
      
    try{
        const {title , description , category , venue , location , date , time , price , capacity  } = req.body;

        console.log("event create" , req.body);
        
        if(!title || !description || !category || !venue || !location || !date || !time || price === undefined || !capacity) {
            return res.status(400).json({ message: "Please fill all required fields" });
        }

        let banner = "";

        if(req.file) {
          const result = await uploadToCloudinary(
              req.file.buffer
          );
          banner = result.secure_url;
        }   

        const event = await Event.create({
              title , 
              description ,
                category ,
                venue ,
                location ,
                date ,
                time ,
                price ,
                capacity ,
                availableSeats : capacity,
                banner , 
                organizer: req.user._id,
        
             
        });

        

        res.status(201).json({
            message: "Event created successfully",
            event
        });
    }catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
}

export const getAllEvents = async (req , res ) => {
       
    try{

        const events = await Event.find()
          .populate("organizer", "name email")
          .sort({ date: 1 });
          
        res.status(200).json({
             count: events.length,
             events
        });
    
    } 
    catch(error){
          console.log(error);

          res.status(500).json({
            message: "Server error"
          });
    
          
    }
};

export const getEventById = async (req , res ) => {
      
      try{
          
          const event = await Event.findById(req.params.id).populate("organizer", "name email");
          
          if(!event) {
              return res.status(404).json({
                  message: "Event not found"
              });
          }

            res.status(200).json({
                event
            });

      }catch(error){
          console.log(error);

          res.status(500).json({
            message: "Server error"
          });
      }
};

export const updateEvent = async (req , res ) => {
      
     try {
          
        const event = await Event.findById(req.params.id);

        if(!event) {
            return res.status(404).json({
                message: "Event not found"
            });
        }

        const {title , description , category , venue , location , date , time , price , capacity , availableSeats , banner } = req.body;

        event.title = title || event.title;
        event.description = description || event.description;
        event.category = category || event.category;
        event.venue = venue || event.venue;
        event.location = location || event.location;
        event.date = date || event.date;
        event.time = time || event.time;
        event.price = price || event.price;

        // event.capacity = capacity || event.capacity;
        // event.availableSeats = availableSeats || event.availableSeats;

       // event.banner = banner || event.banner;

          if (capacity !== undefined) {
      const bookedSeats =
        event.capacity - event.availableSeats;

      // New capacity cannot be less than seats already booked
      if (capacity < bookedSeats) {
        return res.status(400).json({
          message: `Capacity cannot be less than ${bookedSeats} already booked seats`,
        });
      }

      event.capacity = capacity;

      // Recalculate available seats
      event.availableSeats = capacity - bookedSeats;
    }


    if(req.file){
       
       const result = await uploadToCloudinary(
            req.file.buffer
       );
       event.banner = result.secure_url;
    }

        await event.save();

        res.status(200).json({
            message: "Event updated successfully",
            event
        });
     }catch(error){
          console.log(error);
          res.status(500).json({
            message: "Server error"
          });
     }
};

export const deleteEvent = async (req , res ) => {
      
    try{
        const event = await Event.findById(req.params.id);

        if(!event){
             return res.status(404).json({
                message: "Event not found"
             });
        }

        await event.deleteOne();

        res.status(200).json({
            message: "Event deleted successfully"
        });
    }catch(error){
        console.log(error);
        res.status(500).json({
            message: "Server error"
        });
    }

};



 export  const searchEvents = async (req, res) => {
  try {
    const {
      search,
      category,
      location,
      minPrice,
      maxPrice,
      date,
      sort = "date",
      page = 1,
      limit = 10,
    } = req.query;

    // =========================
    // BUILD FILTER
    // =========================

    const filter = {};

    // Search by title or description
    if (search) {
      filter.$or = [
        {
          title: {
            $regex: search,
            $options: "i",
          },
        },
        {
          description: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    // Category filter
    if (category) {
      filter.category = category;
    }

    // Location filter
    if (location) {
      filter.location = {
        $regex: location,
        $options: "i",
      };
    }

    // Price filter
    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};

      if (minPrice !== undefined) {
        filter.price.$gte = Number(minPrice);
      }

      if (maxPrice !== undefined) {
        filter.price.$lte = Number(maxPrice);
      }
    }

    // Date filter
    if (date === "upcoming") {
      filter.date = {
        $gte: new Date(),
      };
    }

    // =========================
    // PAGINATION
    // =========================

    const currentPage = Math.max(Number(page), 1);
    const perPage = Math.max(Number(limit), 1);

    const skip = (currentPage - 1) * perPage;

    // =========================
    // SORTING
    // =========================

    let sortOption = {};

    switch (sort) {
      case "price_asc":
        sortOption = {
          price: 1,
        };
        break;

      case "price_desc":
        sortOption = {
          price: -1,
        };
        break;

      case "date_asc":
        sortOption = {
          date: 1,
        };
        break;

      case "date_desc":
        sortOption = {
          date: -1,
        };
        break;

      case "newest":
        sortOption = {
          createdAt: -1,
        };
        break;

      default:
        sortOption = {
          date: 1,
        };
    }

    // =========================
    // GET EVENTS
    // =========================

    const events = await Event.find(filter)
      .populate("organizer", "name email")
      .sort(sortOption)
      .skip(skip)
      .limit(perPage);

    // =========================
    // TOTAL COUNT
    // =========================

    const totalEvents = await Event.countDocuments(filter);

    const totalPages = Math.ceil(
      totalEvents / perPage
    );

    // =========================
    // RESPONSE
    // =========================

    res.status(200).json({
      events,

      pagination: {
        currentPage,
        perPage,
        totalEvents,
        totalPages,

        hasNextPage:
          currentPage < totalPages,

        hasPreviousPage:
          currentPage > 1,
      },
    });
  } catch (error) {
    console.error(
      "Search events error:",
      error
    );

    res.status(500).json({
      message: "Failed to search events",
    });
  }
};

export const getEventsOrganizer = async (req, res) => {
  try {
    const events = await Event.find({
      organizer: req.user._id,
    }).sort({ createdAt: -1 });

  //  console.log("Organizer events fetched:", events);

    res.status(200).json({
      success: true,
      events,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



export const getOrganizerEventById = async (req, res) => {
  try {
    console.log("fetch admin event" , req.params.id);
    const event = await Event.findById(req.params.id)
      .populate( "organizer" , "name email");

      console.log("admin id " , event);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    res.status(200).json({
      success: true,
      event,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateOrganizerEvent = async (req, res) => {
  try {
    const event = await Event.findOne({
      _id: req.params.id,
      organizer: req.user._id,
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found or you are not authorized",
      });
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Event updated successfully",
      event: updatedEvent,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



export const deleteOrganizerEvent = async (req, res) => {
  try {
    const event = await Event.findOne({
      _id: req.params.id,
      organizer: req.user._id,
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found or you are not authorized",
      });
    }

    await Event.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



