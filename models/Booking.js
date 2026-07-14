const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Name is required'],
    trim: true,
    minlength: [3, 'Name must be at least 3 characters'],
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  phone: { 
    type: String, 
    required: [true, 'Phone number is required'],
    trim: true,
    match: [/^\d{10}$/, 'Phone number must be exactly 10 digits']
  },
  email: { 
    type: String, 
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address']
  },
  service: { 
    type: String, 
    required: [true, 'Service is required'],
    trim: true,
    minlength: [1, 'Service name cannot be empty']
  },
  batch: { 
    type: String, 
    required: [true, 'Batch is required'],
    trim: true,
    minlength: [1, 'Batch name cannot be empty']
  },
  date: { 
    type: Date, 
    required: [true, 'Date is required'],
    validate: {
      validator: function(v) {
        // Prevent booking dates in the past (ignoring time)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return v >= today;
      },
      message: 'Booking date cannot be in the past'
    }
  },
  status: {
    type: String,
    enum: {
      values: ['pending', 'confirmed', 'cancelled'],
      message: '{VALUE} is not a valid status'
    },
    default: 'pending',
    trim: true
  },
  paid: { 
    type: Boolean, 
    default: false 
  },
  age: {
    type: Number,
    min: [1, 'Age must be at least 1'],
    max: [120, 'Age cannot exceed 120']
  },
  time: {
    type: String,
    trim: true,
    match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Time must be in HH:MM format']
  },
  gender: {
    type: String,
    trim: true,
    enum: {
      values: ['Male', 'Female', 'Other'],
      message: '{VALUE} is not a valid gender'
    }
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);