const express = require('express');
const Contact = require('../models/Contact');
const { sendEmail } = require('../utils/email');
const router = express.Router();

// Submit contact form
router.post('/submit', async (req, res) => {
    try {
        const { name, phone, email, service, message } = req.body;

        // Create contact
        const contact = new Contact({
            name, phone, email, service, message
        });
        await contact.save();

        // Send email notification to admin
        const adminEmailHtml = `
            <h2>New Inquiry from Danzup Studio</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Service:</strong> ${service}</p>
            <p><strong>Message:</strong> ${message}</p>
            <p><em>Inquiry ID: ${contact._id}</em></p>
        `;

        await sendEmail(process.env.ADMIN_EMAIL, '🆕 New Danzup Studio Inquiry', adminEmailHtml);

        // Send confirmation to user
        const userEmailHtml = `
            <h2>Thank You for Contacting Danzup Studio! 🎉</h2>
            <p>Hi ${name},</p>
            <p>We've received your inquiry for <strong>${service}</strong>. Our team will contact you within 24 hours.</p>
            <p><strong>Your details:</strong></p>
            <ul>
                <li>Phone: ${phone}</li>
                <li>Email: ${email}</li>
            </ul>
            <p>Best regards,<br>Danzup Studio Team</p>
        `;

        await sendEmail(email, 'Thank You - Danzup Studio', userEmailHtml);

        res.json({
            success: true,
            message: 'Inquiry submitted successfully! We\'ll contact you soon.',
            contactId: contact._id
        });

    } catch (error) {
        console.error('Contact error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error. Please try again.'
        });
    }
});

module.exports = router;