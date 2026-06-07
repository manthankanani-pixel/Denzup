const mongoose = require('mongoose');

const feePaymentSchema = new mongoose.Schema({
    amount: { type: Number, required: true },
    method: { type: String, enum: ['UPI', 'Cash', 'Card', 'Bank Transfer'], required: true },
    date: { type: Date, default: Date.now },
    notes: { type: String }
});

const feeSchema = new mongoose.Schema({
    studentName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    service: { type: String, required: true },
    totalAmount: { type: Number, required: true },
    paidAmount: { type: Number, default: 0 },
    dueDate: { type: Date, required: true },
    status: {
        type: String,
        enum: ['unpaid', 'partially_paid', 'fully_paid'],
        default: 'unpaid'
    },
    payments: [feePaymentSchema],
    notes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Fee', feeSchema);
