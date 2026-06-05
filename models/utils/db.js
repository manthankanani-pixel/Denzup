const fs = require('fs').promises;
const path = require('path');
const mongoose = require('mongoose');
const Contact = require('../Contact');
const Booking = require('../Booking');

let isMongoConnected = false;
const DATA_DIR = path.join(__dirname, '../../data');
const CONTACTS_FILE = path.join(DATA_DIR, 'contacts.json');
const BOOKINGS_FILE = path.join(DATA_DIR, 'bookings.json');

// Helper to ensure data directory exists for JSON fallback
async function ensureDataDir() {
    try {
        await fs.mkdir(DATA_DIR, { recursive: true });
        
        // Initialize files if they don't exist
        try {
            await fs.access(CONTACTS_FILE);
        } catch {
            await fs.writeFile(CONTACTS_FILE, JSON.stringify([], null, 2));
        }

        try {
            await fs.access(BOOKINGS_FILE);
        } catch {
            await fs.writeFile(BOOKINGS_FILE, JSON.stringify([], null, 2));
        }
    } catch (err) {
        console.error('Error creating data directory:', err);
    }
}

// Read JSON files helper
async function readJsonFile(filePath) {
    try {
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error(`Error reading ${filePath}:`, err);
        return [];
    }
}

// Write JSON files helper
async function writeJsonFile(filePath, data) {
    try {
        await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    } catch (err) {
        console.error(`Error writing to ${filePath}:`, err);
    }
}

const dbManager = {
    async init() {
        const mongoUri = process.env.MONGO_URI;
        const isPlaceholder = !mongoUri || mongoUri.includes('username:password') || mongoUri.includes('cluster.mongodb.net');

        if (isPlaceholder) {
            console.warn('⚠️ MONGO_URI is unset or has placeholder values. Falling back to local JSON file database...');
            await ensureDataDir();
            isMongoConnected = false;
            return;
        }

        try {
            mongoose.set('strictQuery', false);
            await mongoose.connect(mongoUri, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                serverSelectionTimeoutMS: 5000 // Timeout after 5s
            });
            console.log('✅ Connected to MongoDB successfully.');
            isMongoConnected = true;
        } catch (err) {
            console.error('❌ MongoDB connection failed. Falling back to local JSON file database...', err.message);
            await ensureDataDir();
            isMongoConnected = false;
        }
    },

    isMongo() {
        return isMongoConnected;
    },

    // Contacts CRUD
    async saveContact(contactData) {
        if (isMongoConnected) {
            const contact = new Contact({
                name: contactData.name,
                phone: contactData.phone,
                email: contactData.email,
                service: contactData.service,
                message: contactData.message
            });
            return await contact.save();
        } else {
            const contacts = await readJsonFile(CONTACTS_FILE);
            const newContact = {
                _id: 'c_' + Date.now().toString() + Math.random().toString(36).substr(2, 5),
                name: contactData.name,
                phone: contactData.phone,
                email: contactData.email,
                service: contactData.service || 'Other',
                message: contactData.message,
                status: 'new',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            contacts.push(newContact);
            await writeJsonFile(CONTACTS_FILE, contacts);
            return newContact;
        }
    },

    async getContacts() {
        if (isMongoConnected) {
            return await Contact.find().sort({ createdAt: -1 });
        } else {
            const contacts = await readJsonFile(CONTACTS_FILE);
            return contacts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }
    },

    async updateContactStatus(id, status) {
        if (isMongoConnected) {
            return await Contact.findByIdAndUpdate(id, { status }, { new: true });
        } else {
            const contacts = await readJsonFile(CONTACTS_FILE);
            const index = contacts.findIndex(c => c._id === id);
            if (index !== -1) {
                contacts[index].status = status;
                contacts[index].updatedAt = new Date().toISOString();
                await writeJsonFile(CONTACTS_FILE, contacts);
                return contacts[index];
            }
            return null;
        }
    },

    // Bookings CRUD
    async saveBooking(bookingData) {
        if (isMongoConnected) {
            const booking = new Booking({
                name: bookingData.name,
                phone: bookingData.phone,
                email: bookingData.email,
                service: bookingData.service,
                batch: bookingData.batch,
                date: new Date(bookingData.date)
            });
            return await booking.save();
        } else {
            const bookings = await readJsonFile(BOOKINGS_FILE);
            const newBooking = {
                _id: 'b_' + Date.now().toString() + Math.random().toString(36).substr(2, 5),
                name: bookingData.name,
                phone: bookingData.phone,
                email: bookingData.email,
                service: bookingData.service,
                batch: bookingData.batch,
                date: new Date(bookingData.date).toISOString(),
                status: 'pending',
                paid: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            bookings.push(newBooking);
            await writeJsonFile(BOOKINGS_FILE, bookings);
            return newBooking;
        }
    },

    async getBookings() {
        if (isMongoConnected) {
            return await Booking.find().sort({ createdAt: -1 });
        } else {
            const bookings = await readJsonFile(BOOKINGS_FILE);
            return bookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }
    },

    async updateBookingStatus(id, status, paid = undefined) {
        if (isMongoConnected) {
            const updateFields = { status };
            if (paid !== undefined) updateFields.paid = paid;
            return await Booking.findByIdAndUpdate(id, updateFields, { new: true });
        } else {
            const bookings = await readJsonFile(BOOKINGS_FILE);
            const index = bookings.findIndex(b => b._id === id);
            if (index !== -1) {
                bookings[index].status = status;
                if (paid !== undefined) bookings[index].paid = paid;
                bookings[index].updatedAt = new Date().toISOString();
                await writeJsonFile(BOOKINGS_FILE, bookings);
                return bookings[index];
            }
            return null;
        }
    },

    // Statistics
    async getStats() {
        let contacts = [];
        let bookings = [];

        if (isMongoConnected) {
            contacts = await Contact.find();
            bookings = await Booking.find();
        } else {
            contacts = await readJsonFile(CONTACTS_FILE);
            bookings = await readJsonFile(BOOKINGS_FILE);
        }

        const totalContacts = contacts.length;
        const newContacts = contacts.filter(c => c.status === 'new').length;
        const totalBookings = bookings.length;
        const pendingBookings = bookings.filter(b => b.status === 'pending').length;
        const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;

        return {
            totalContacts,
            newContacts,
            totalBookings,
            pendingBookings,
            confirmedBookings
        };
    }
};

module.exports = dbManager;
