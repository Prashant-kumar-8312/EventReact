const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },

    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },

    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "Music",
        "Sports",
        "Technology",
        "Business",
        "Arts",
        "Food",
        "Education",
        "Other",
      ],
      default: "Other",
    },

    venue: {
      type: String,
      required: [true, "Venue name is required"],
      trim: true,
    },

    location: {
      type: String,
      required: [true, "Location/address is required"],
      trim: true,
    },

    date: {
      type: Date,
      required: [true, "Event date is required"],
    },

    time: {
      type: String,
      required: [true, "Event time is required"],
    },

    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
      default: 0,
    },

    capacity: {
      type: Number,
      required: [true, "Capacity is required"],
      min: [1, "Capacity must be at least 1"],
    },

    availableSeats: {
      type: Number,
      required: true,
      min: [0, "Available seats cannot be negative"],
    },

    banner: {
      type: String,
      default: "",
    },

    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Organizer is required"],
    },
  },
  {
    timestamps: true,
  }
);
 

eventSchema.pre("save", async function () {
  // Set available seats when creating a new event
  if (this.isNew && this.availableSeats === undefined) {
    this.availableSeats = this.capacity;
  }

  // Prevent available seats from exceeding capacity
  if (this.availableSeats > this.capacity) {
    throw new Error("Available seats cannot exceed capacity");
  }
});


// Set available seats when creating a new event
// eventSchema.pre("save", function (next) {
//   if (this.isNew && this.availableSeats === undefined) {
//     this.availableSeats = this.capacity;
//   }

//   next();
// });


// // Prevent available seats from exceeding capacity
// eventSchema.pre("save", function (next) {
//   if (this.availableSeats > this.capacity) {
//     return next(
//       new Error("Available seats cannot exceed capacity")
//     );
//   }

//   next();
// });


const Event = mongoose.model("Event", eventSchema);

module.exports = Event;