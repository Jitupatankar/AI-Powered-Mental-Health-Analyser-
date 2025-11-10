# Psyche Compass - Backend Setup Guide

## Overview
Your Psyche Compass application now has a complete backend with MongoDB integration. This guide will help you set up and run the application.

## What's Been Set Up

### 1. **Server (server.js)**
   - Express server running on port 5000
   - MongoDB connection
   - JWT-based authentication
   - Complete REST API for all features

### 2. **MongoDB Model (models/User.js)**
   - User authentication with password hashing
   - Mood entries storage
   - Assessment history
   - All user activities tracked

### 3. **Updated Frontend**
   - AuthContext now uses API calls
   - dataStorage.js uses API instead of localStorage
   - All user data synced with database

## Setup Instructions

### Step 1: Configure MongoDB

1. Open the `.env` file in your project root
2. Replace `your_mongodb_connection_string_here` with your actual MongoDB URI

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/psyche-compass?retryWrites=true&w=majority
```

**Where to get MongoDB URI:**
- If you have MongoDB Atlas: Copy connection string from your cluster
- If you have local MongoDB: Use `mongodb://localhost:27017/psyche-compass`

3. (Optional) Update JWT_SECRET to a secure random string:
```env
JWT_SECRET=your_secure_random_string_here_at_least_32_characters_long
```

### Step 2: Start the Backend Server

Open a terminal and run:

```bash
npm run server
```

You should see:
```
Server is running on port 5000
MongoDB Connected Successfully
```

### Step 3: Start the Frontend

Open a **second terminal** and run:

```bash
npm start
```

The React app will start on port 3000.

## API Routes Documentation

### Authentication Routes

#### Register User
```
POST /api/auth/register
Body: { name, email, password }
Response: { success, token, user }
```

#### Login User
```
POST /api/auth/login
Body: { email, password }
Response: { success, token, user }
```

#### Get Current User
```
GET /api/auth/me
Headers: { Authorization: "Bearer <token>" }
Response: { user }
```

### Mood Entry Routes

#### Save Mood Entry
```
POST /api/mood
Headers: { Authorization: "Bearer <token>" }
Body: { mood, energy, stress, description }
Response: { success, moodEntry }
```

#### Get All Mood Entries
```
GET /api/mood
Headers: { Authorization: "Bearer <token>" }
Response: { success, moodEntries }
```

#### Get Recent Mood Entries
```
GET /api/mood/recent/:limit
Headers: { Authorization: "Bearer <token>" }
Response: { success, moodEntries }
```

### Assessment Routes

#### Save Assessment
```
POST /api/assessment
Headers: { Authorization: "Bearer <token>" }
Body: { type, responses, scores }
Response: { success, assessment }
```

#### Get All Assessments
```
GET /api/assessment
Headers: { Authorization: "Bearer <token>" }
Response: { success, assessments }
```

#### Get Assessments by Type
```
GET /api/assessment/type/:type
Headers: { Authorization: "Bearer <token>" }
Response: { success, assessments }
```

### User History & Stats Routes

#### Get User History (All Activities)
```
GET /api/user/history
Headers: { Authorization: "Bearer <token>" }
Response: { 
  success, 
  history: { moodEntries, assessments, userInfo }
}
```

#### Get Dashboard Statistics
```
GET /api/user/stats
Headers: { Authorization: "Bearer <token>" }
Response: { 
  success, 
  stats: { moodAverage, energyLevel, stressLevel, totalEntries, totalAssessments }
}
```

#### Clear User Data
```
DELETE /api/user/data
Headers: { Authorization: "Bearer <token>" }
Response: { success, message }
```

#### Delete Account
```
DELETE /api/user/account
Headers: { Authorization: "Bearer <token>" }
Response: { success, message }
```

## Features Implemented

### ✅ User Authentication
- Secure registration and login
- Password hashing with bcrypt
- JWT token-based authentication
- Token stored in localStorage

### ✅ User Data Storage
- All mood entries saved to MongoDB
- All assessments saved to database
- Complete history tracking
- User profile information

### ✅ User History
- View all past mood entries
- View all completed assessments
- Dashboard statistics (7-day averages)
- Export functionality

### ✅ Security Features
- Password hashing before storage
- JWT token authentication
- Protected API routes
- CORS enabled for frontend

## Testing the Setup

1. **Register a new user:**
   - Go to http://localhost:3000/login
   - Click "Sign Up"
   - Create a new account

2. **Login:**
   - Use your credentials to log in
   - You'll be redirected to the dashboard

3. **Add mood entries:**
   - Go to the Mood Tracker
   - Add some mood data
   - Check if it appears in your history

4. **Take assessments:**
   - Complete a personality or screening assessment
   - Verify it's saved in your history

5. **View history:**
   - Dashboard should show statistics
   - All data should persist after logout/login

## Troubleshooting

### MongoDB Connection Issues
- **Error:** "MongoDB Connection Error"
- **Solution:** Check your MONGO_URI in .env file
- Ensure your IP is whitelisted in MongoDB Atlas
- Verify your database user has proper permissions

### Port Already in Use
- **Error:** "Port 5000 is already in use"
- **Solution:** Change PORT in .env to another port (e.g., 5001)
- Or kill the process using port 5000

### CORS Errors
- **Error:** "CORS policy blocked"
- **Solution:** Ensure server.js has `app.use(cors())`
- Frontend proxy is set to `http://localhost:5000` in package.json

### Authentication Issues
- **Error:** "Invalid or expired token"
- **Solution:** Clear localStorage and log in again
- Check if JWT_SECRET matches between sessions

## File Structure

```
Myproject/
├── models/
│   └── User.js              # MongoDB User model
├── src/
│   ├── contexts/
│   │   └── AuthContext.js   # Auth with API calls
│   ├── utils/
│   │   └── dataStorage.js   # Data operations with API
│   └── ...
├── server.js                # Express server
├── .env                     # Environment variables
├── package.json
└── SETUP.md                 # This file
```

## Next Steps

1. **Test everything thoroughly** - Register, login, add data
2. **Customize as needed** - Add more features or modify existing ones
3. **Deploy** - When ready, deploy to production (Heroku, AWS, etc.)

## Notes

- The frontend still uses localStorage for the auth token (this is normal)
- All user data (mood entries, assessments) is now stored in MongoDB
- User can see their complete history even after logging out and back in
- Each user's data is completely separate and private

## Support

If you encounter any issues:
1. Check the browser console for errors
2. Check the server terminal for backend errors
3. Verify MongoDB connection
4. Ensure all dependencies are installed (`npm install`)

---

**Your application is now fully set up with MongoDB backend! 🎉**
