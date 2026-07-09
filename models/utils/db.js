const fs = require('fs').promises;
const path = require('path');
const mongoose = require('mongoose');
const Contact = require('../Contact');
const Booking = require('../Booking');
const Fee = require('../Fee');

let isMongoConnected = false;
const DATA_DIR = path.join(__dirname, '../../data');
const CONTACTS_FILE = path.join(DATA_DIR, 'contacts.json');
const BOOKINGS_FILE = path.join(DATA_DIR, 'bookings.json');
const FEES_FILE = path.join(DATA_DIR, 'fees.json');

async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });

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

    try {
      await fs.access(FEES_FILE);
    } catch {
      await fs.writeFile(FEES_FILE, JSON.stringify([], null, 2));
    }
  } catch (err) {
    console.error('Error creating data directory:', err);
  }
}

async function readJsonFile(filePath) {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
    return [];
  }
}

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
        serverSelectionTimeoutMS: 5000
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

  async saveContact(contactData) {
    if (isMongoConnected) {
      const contact = new Contact({
        name: contactData.name,
        firstName: contactData.firstName,
        lastName: contactData.lastName,
        phone: contactData.phone,
        email: contactData.email,
        address: contactData.address,
        service: contactData.service,
        message: contactData.message
      });
      return await contact.save();
    } else {
      const contacts = await readJsonFile(CONTACTS_FILE);
      const newContact = {
        _id: 'c_' + Date.now().toString() + Math.random().toString(36).substr(2, 5),
        name: contactData.name,
        firstName: contactData.firstName,
        lastName: contactData.lastName,
        phone: contactData.phone,
        email: contactData.email,
        address: contactData.address,
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
      const index = contacts.findIndex((c) => c._id === id);
      if (index !== -1) {
        contacts[index].status = status;
        contacts[index].updatedAt = new Date().toISOString();
        await writeJsonFile(CONTACTS_FILE, contacts);
        return contacts[index];
      }
      return null;
    }
  },

  async saveBooking(bookingData) {
    if (isMongoConnected) {
      const booking = new Booking({
        name: bookingData.name,
        phone: bookingData.phone,
        email: bookingData.email,
        service: bookingData.service,
        batch: bookingData.batch,
        date: new Date(bookingData.date),
        paid: bookingData.paid,
        status: bookingData.status || 'pending'
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
        status: bookingData.status || 'pending',
        paid: bookingData.paid || false,
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

  async updateBookingStatus(id, status = undefined, paid = undefined) {
    let paidBool = undefined;
    if (paid !== undefined) {
      paidBool = String(paid).toLowerCase() === 'true' || paid === true;
    }

    if (isMongoConnected) {
      const updateFields = {};
      if (status !== undefined) updateFields.status = status;
      if (paidBool !== undefined) updateFields.paid = paidBool;
      return await Booking.findByIdAndUpdate(id, updateFields, { new: true });
    } else {
      const bookings = await readJsonFile(BOOKINGS_FILE);
      const index = bookings.findIndex((b) => b._id === id);
      if (index !== -1) {
        if (status !== undefined) bookings[index].status = status;
        if (paidBool !== undefined) bookings[index].paid = paidBool;
        bookings[index].updatedAt = new Date().toISOString();
        await writeJsonFile(BOOKINGS_FILE, bookings);
        return bookings[index];
      }
      return null;
    }
  },

  async getStats() {
    let contacts = [];
    let bookings = [];
    let fees = [];

    if (isMongoConnected) {
      contacts = await Contact.find();
      bookings = await Booking.find();
      fees = await Fee.find();
    } else {
      contacts = await readJsonFile(CONTACTS_FILE);
      bookings = await readJsonFile(BOOKINGS_FILE);
      fees = await readJsonFile(FEES_FILE);
    }

    const totalContacts = contacts.length;
    const newContacts = contacts.filter((c) => c.status === 'new').length;
    const totalBookings = bookings.length;
    const pendingBookings = bookings.filter((b) => b.status === 'pending').length;
    const confirmedBookings = bookings.filter((b) => b.status === 'confirmed').length;
    const trialBookings = bookings.filter((b) => b.service.toLowerCase().includes('trial')).length;

    let totalCollectedFees = 0;
    let totalPendingFees = 0;
    let overdueFeesCount = 0;
    const today = new Date();

    fees.forEach((f) => {
      totalCollectedFees += parseFloat(f.paidAmount || 0);
      totalPendingFees += Math.max(0, parseFloat(f.totalAmount || 0) - parseFloat(f.paidAmount || 0));
      if (f.status !== 'fully_paid' && f.status !== 'paid' && new Date(f.dueDate) < today) {
        overdueFeesCount++;
      }
    });

    return {
      totalContacts,
      newContacts,
      totalBookings,
      pendingBookings,
      confirmedBookings,
      trialBookings,
      totalCollectedFees,
      totalPendingFees,
      overdueFeesCount
    };
  },

  async saveFee(feeData) {
    const total = parseFloat(feeData.totalAmount);
    const paid = parseFloat(feeData.paidAmount || 0);
    let status = 'unpaid';
    if (paid > 0) {
      status = paid >= total ? 'fully_paid' : 'partially_paid';
    }

    const payments = [];
    if (paid > 0) {
      payments.push({
        amount: paid,
        method: feeData.paymentMethod || 'Cash',
        date: new Date().toISOString(),
        notes: 'Initial Payment'
      });
    }

    if (isMongoConnected) {
      const fee = new Fee({
        studentName: feeData.studentName,
        phone: feeData.phone,
        email: feeData.email,
        service: feeData.service,
        totalAmount: total,
        paidAmount: paid,
        dueDate: new Date(feeData.dueDate),
        status,
        payments,
        notes: feeData.notes || ''
      });
      return await fee.save();
    } else {
      const fees = await readJsonFile(FEES_FILE);
      const newFee = {
        _id: 'f_' + Date.now().toString() + Math.random().toString(36).substr(2, 5),
        studentName: feeData.studentName,
        phone: feeData.phone,
        email: feeData.email,
        service: feeData.service,
        totalAmount: total,
        paidAmount: paid,
        dueDate: new Date(feeData.dueDate).toISOString(),
        status,
        payments,
        notes: feeData.notes || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      fees.push(newFee);
      await writeJsonFile(FEES_FILE, fees);
      return newFee;
    }
  },

  async getFees() {
    if (isMongoConnected) {
      return await Fee.find().sort({ createdAt: -1 });
    } else {
      const fees = await readJsonFile(FEES_FILE);
      return fees.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
  },

  async addPaymentToFee(id, paymentData) {
    const payAmount = parseFloat(paymentData.amount);
    const method = paymentData.method || 'Cash';
    const notes = paymentData.notes || '';

    if (isMongoConnected) {
      const fee = await Fee.findById(id);
      if (!fee) return null;

      fee.payments.push({ amount: payAmount, method, notes, date: new Date() });
      fee.paidAmount += payAmount;

      if (fee.paidAmount >= fee.totalAmount) {
        fee.status = 'fully_paid';
      } else if (fee.paidAmount > 0) {
        fee.status = 'partially_paid';
      } else {
        fee.status = 'unpaid';
      }

      return await fee.save();
    } else {
      const fees = await readJsonFile(FEES_FILE);
      const index = fees.findIndex((f) => f._id === id);
      if (index !== -1) {
        const fee = fees[index];
        fee.payments.push({
          amount: payAmount,
          method,
          notes,
          date: new Date().toISOString()
        });
        fee.paidAmount += payAmount;

        if (fee.paidAmount >= fee.totalAmount) {
          fee.status = 'fully_paid';
        } else if (fee.paidAmount > 0) {
          fee.status = 'partially_paid';
        } else {
          fee.status = 'unpaid';
        }

        fee.updatedAt = new Date().toISOString();
        await writeJsonFile(FEES_FILE, fees);
        return fee;
      }
      return null;
    }
  },

  async deleteFee(id) {
    if (isMongoConnected) {
      return await Fee.findByIdAndDelete(id);
    } else {
      const fees = await readJsonFile(FEES_FILE);
      const index = fees.findIndex((f) => f._id === id);
      if (index !== -1) {
        const deletedFee = fees[index];
        fees.splice(index, 1);
        await writeJsonFile(FEES_FILE, fees);
        return deletedFee;
      }
      return null;
    }
  }
};

module.exports = dbManager;