const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    name: { type: String, required: true },
    firstName: { type: String },
    lastName: { type: String },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String },
    service: { type: String, required: true },
    message: { type: String, required: true },
    status: { 
        type: String, 
        enum: ['new', 'contacted', 'booked', 'closed'],
        default: 'new'
    }
}, { timestamps: true });

module.exports = mongoose.model('Contact', contactSchema);