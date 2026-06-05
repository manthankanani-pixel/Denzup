const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    service: { 
        type: String, 
        enum: ['Dance Classes', 'Garba Training', 'Yoga Classes', 'Wedding Choreography', 'Other'],
        required: true 
    },
    message: { type: String, required: true },
    status: { 
        type: String, 
        enum: ['new', 'contacted', 'booked', 'closed'],
        default: 'new'
    }
}, { timestamps: true });

module.exports = mongoose.model('Contact', contactSchema);