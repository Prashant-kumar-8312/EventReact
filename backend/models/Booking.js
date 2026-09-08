const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: [true, 'Event is required']
  },
  ticketQuantity: {
    type: Number,
    required: [true, 'Ticket quantity is required'],
    min: [1, 'Must book at least 1 ticket']
  },
  totalPrice: {
    type: Number,
    required: [true, 'Total price is required'],
    min: [0, 'Total price cannot be negative']
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  bookingStatus: {
    type: String,
    enum: ['confirmed', 'cancelled', 'completed'],
    default: 'confirmed'
  },
  bookingReference: {
  type: String,
  unique: true,
  required: true,
},
  qrCode: {
    type: String, // stores a URL/base64 string or generated code data for check-in
    default: ''
  },
  usedAt: {
  type: Date,
  default: null
},
  bookingDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true // adds createdAt and updatedAt automatically
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;