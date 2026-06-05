# Danzup Studio - Dance Training Website

A full-stack web application for Danzup Studio, a professional dance training center offering contemporary, hip hop, Bollywood, jazz/ballet, garba, yoga, and wedding choreography services.

## Features

- **Responsive Website**: Modern, mobile-friendly design with smooth animations
- **Contact Form**: Integrated contact form with email notifications
- **Admin Dashboard**: Backend API for managing inquiries and bookings
- **Email Integration**: Automated email notifications for inquiries
- **Database**: MongoDB for storing contacts and bookings
- **Security**: Helmet.js for security headers, rate limiting, CORS

## Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Email**: Nodemailer with Gmail
- **Security**: Helmet, CORS, Rate Limiting

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- Gmail account for email notifications

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd danzup-studio
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Configuration**

   Copy the example environment file and configure your settings:

   ```bash
   cp .env.example .env
   ```

   Then edit `.env` with your actual values. See `.env.example` for detailed instructions on setting up Gmail App Passwords and MongoDB connection.

4. **Start the server**

   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

5. **Access the website**

   Open your browser and go to: `http://localhost:5000`

## API Endpoints

### Contact

- `POST /api/contact/submit` - Submit contact form

### Bookings

- `POST /api/bookings/create` - Create booking

### Admin

- `GET /api/admin/contacts` - Get all contacts
- `PUT /api/admin/contacts/:id/status` - Update contact status
- `GET /api/admin/stats` - Get dashboard statistics

### Health Check

- `GET /api/health` - Server health check

## Project Structure

```
danzup-studio/
├── index.html              # Main website
├── hero-dancer.jpeg        # Hero image
├── server.js               # Express server
├── package.json            # Dependencies
├── .env                    # Environment variables (create from .env.example)
├── .env.example            # Environment variables template
├── README.md               # This file
├── models/
│   ├── Contact.js          # Contact model
│   ├── Booking.js          # Booking model
│   └── utils/
│       ├── email.js        # Email utility
│       └── routes/
│           └── contact.js  # Contact routes (legacy location)
├── routes/
│   ├── admin.js            # Admin routes
│   ├── bookings.js         # Booking routes
│   └── contact.js          # Contact routes
└── node_modules/           # Dependencies (created by npm install)
```

## Deployment

### Option 1: Local Deployment

1. Follow the setup instructions above
2. Ensure MongoDB is running
3. Start the server with `npm start`
4. Access at `http://localhost:5000`

### Option 2: Cloud Deployment (Heroku/Vercel)

1. **Environment Variables**: Set all `.env` variables in your hosting platform
2. **Build Command**: `npm install`
3. **Start Command**: `npm start`
4. **MongoDB**: Use MongoDB Atlas for cloud database

### Option 3: Docker Deployment

Create a `Dockerfile`:

```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

Build and run:

```bash
docker build -t danzup-studio .
docker run -p 5000:5000 --env-file .env danzup-studio
```

## Features Overview

### Frontend Features

- Responsive navigation with smooth scrolling
- Animated sections with intersection observer
- Contact form with real-time validation
- Gallery with performance images
- Service sections for different dance types

### Backend Features

- RESTful API design
- Email notifications for new inquiries
- Database models for contacts and bookings
- Admin endpoints for management
- Security middleware

## Deployment

### Quick Local Setup

1. **Setup environment:**

   ```bash
   cp .env.example .env
   # Edit .env with your actual values
   ```

2. **Install and start:**

   ```bash
   npm install
   npm start
   ```

3. **Access:** `http://localhost:5000`

### Production Deployment

#### Option 1: Heroku

1. **Create Heroku app:**

   ```bash
   heroku create your-app-name
   ```

2. **Set environment variables:**

   ```bash
   heroku config:set MONGO_URI="your-mongodb-uri"
   heroku config:set EMAIL_USER="your-email@gmail.com"
   heroku config:set EMAIL_PASS="your-app-password"
   heroku config:set ADMIN_EMAIL="admin@danzupstudio.com"
   heroku config:set JWT_SECRET="your-secret-key"
   ```

3. **Deploy:**
   ```bash
   git push heroku main
   ```

#### Option 2: DigitalOcean/VPS

1. **Server setup:**

   ```bash
   # Install Node.js and MongoDB
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs mongodb

   # Clone repository
   git clone your-repo-url
   cd danzup-studio

   # Install dependencies
   npm install

   # Setup environment
   cp .env.example .env
   nano .env  # Edit with your values
   ```

2. **Use PM2 for production:**
   ```bash
   npm install -g pm2
   pm2 start server.js --name "danzup-studio"
   pm2 startup
   pm2 save
   ```

#### Option 3: Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

Build and run:

```bash
docker build -t danzup-studio .
docker run -p 5000:5000 --env-file .env danzup-studio
```

### Environment Checklist

Before deployment, ensure:

- ✅ MongoDB connection string is valid
- ✅ Gmail App Password is configured
- ✅ JWT_SECRET is a long random string
- ✅ ADMIN_EMAIL is set to receive inquiries
- ✅ FRONTEND_URL matches your domain (for CORS)

## Troubleshooting

### Common Issues

1. **Email not sending**
   - Check Gmail App Password is correct
   - Ensure 2FA is enabled on Gmail account
   - Verify EMAIL_USER and EMAIL_PASS in .env

2. **MongoDB connection error**
   - Check MONGO_URI is correct
   - Ensure MongoDB is running (if local)
   - Verify network access to MongoDB Atlas

3. **Port already in use**
   - Change PORT in .env file
   - Kill process using the port: `npx kill-port 5000`

4. **CORS errors**
   - Update FRONTEND_URL in .env to match your domain

### Development

- Use `npm run dev` for development with nodemon
- Check server logs for debugging
- Use browser dev tools for frontend debugging

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Contact

For questions or support, contact: hello@danzupstudio.com
