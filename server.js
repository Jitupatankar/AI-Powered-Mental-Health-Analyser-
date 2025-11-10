require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB Connected Successfully'))
  .catch(err => {
    console.error('MongoDB Connection Error:', err);
    process.exit(1);
  });

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';

// Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// ============= AUTH ROUTES =============

// Register Route
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
      joinDate: new Date()
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return user data (without password)
    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        joinDate: user.joinDate
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
});

// Login Route
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return user data (without password)
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        joinDate: user.joinDate
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed. Please try again.' });
  }
});

// Get Current User
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to fetch user data' });
  }
});

// ============= MOOD ENTRY ROUTES =============

// Save Mood Entry
app.post('/api/mood', authenticateToken, async (req, res) => {
  try {
    const { mood, energy, stress, description } = req.body;

    // Validation
    if (!mood || !energy || !stress) {
      return res.status(400).json({ error: 'Mood, energy, and stress levels are required' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Create new mood entry
    const newEntry = {
      mood,
      energy,
      stress,
      description: description || '',
      timestamp: new Date(),
      date: new Date().toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' }),
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
    };

    user.moodEntries.unshift(newEntry);
    await user.save();

    res.status(201).json({
      success: true,
      moodEntry: newEntry
    });
  } catch (error) {
    console.error('Save mood entry error:', error);
    res.status(500).json({ error: 'Failed to save mood entry' });
  }
});

// Get All Mood Entries
app.get('/api/mood', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      success: true,
      moodEntries: user.moodEntries
    });
  } catch (error) {
    console.error('Get mood entries error:', error);
    res.status(500).json({ error: 'Failed to fetch mood entries' });
  }
});

// Get Recent Mood Entries (with optional limit parameter)
app.get('/api/mood/recent/:limit', authenticateToken, async (req, res) => {
  try {
    const limit = parseInt(req.params.limit) || 5;
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const recentEntries = user.moodEntries.slice(0, limit);

    res.json({
      success: true,
      moodEntries: recentEntries
    });
  } catch (error) {
    console.error('Get recent mood entries error:', error);
    res.status(500).json({ error: 'Failed to fetch recent mood entries' });
  }
});

// Get Recent Mood Entries (default 5)
app.get('/api/mood/recent', authenticateToken, async (req, res) => {
  try {
    const limit = 5;
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const recentEntries = user.moodEntries.slice(0, limit);

    res.json({
      success: true,
      moodEntries: recentEntries
    });
  } catch (error) {
    console.error('Get recent mood entries error:', error);
    res.status(500).json({ error: 'Failed to fetch recent mood entries' });
  }
});

// ============= ASSESSMENT ROUTES =============

// Save Assessment
app.post('/api/assessment', authenticateToken, async (req, res) => {
  try {
    const { type, responses, scores } = req.body;

    // Validation
    if (!type || !responses) {
      return res.status(400).json({ error: 'Assessment type and responses are required' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Create new assessment
    const newAssessment = {
      type,
      responses,
      scores: scores || null,
      timestamp: new Date(),
      date: new Date().toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' }),
      status: 'Completed'
    };

    user.assessments.unshift(newAssessment);
    await user.save();

    res.status(201).json({
      success: true,
      assessment: newAssessment
    });
  } catch (error) {
    console.error('Save assessment error:', error);
    res.status(500).json({ error: 'Failed to save assessment' });
  }
});

// Get All Assessments
app.get('/api/assessment', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      success: true,
      assessments: user.assessments
    });
  } catch (error) {
    console.error('Get assessments error:', error);
    res.status(500).json({ error: 'Failed to fetch assessments' });
  }
});

// Get Assessments by Type
app.get('/api/assessment/type/:type', authenticateToken, async (req, res) => {
  try {
    const { type } = req.params;
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const assessmentsByType = user.assessments.filter(assessment => assessment.type === type);

    res.json({
      success: true,
      assessments: assessmentsByType
    });
  } catch (error) {
    console.error('Get assessments by type error:', error);
    res.status(500).json({ error: 'Failed to fetch assessments by type' });
  }
});

// ============= USER HISTORY & STATS ROUTES =============

// Get User History (All activities)
app.get('/api/user/history', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      success: true,
      history: {
        moodEntries: user.moodEntries,
        assessments: user.assessments,
        userInfo: {
          name: user.name,
          email: user.email,
          joinDate: user.joinDate
        }
      }
    });
  } catch (error) {
    console.error('Get user history error:', error);
    res.status(500).json({ error: 'Failed to fetch user history' });
  }
});

// Get Dashboard Statistics
app.get('/api/user/stats', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Calculate 7-day averages
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentEntries = user.moodEntries.filter(entry => 
      new Date(entry.timestamp) >= sevenDaysAgo
    );

    let stats = {
      moodAverage: 0,
      energyLevel: 0,
      stressLevel: 0,
      totalEntries: user.moodEntries.length,
      totalAssessments: user.assessments.length
    };

    if (recentEntries.length > 0) {
      const totals = recentEntries.reduce((acc, entry) => ({
        mood: acc.mood + entry.mood,
        energy: acc.energy + entry.energy,
        stress: acc.stress + entry.stress
      }), { mood: 0, energy: 0, stress: 0 });

      stats.moodAverage = +(totals.mood / recentEntries.length).toFixed(1);
      stats.energyLevel = +(totals.energy / recentEntries.length).toFixed(1);
      stats.stressLevel = +(totals.stress / recentEntries.length).toFixed(1);
    }

    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// Delete User Account (Optional - for data management)
app.delete('/api/user/account', authenticateToken, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    res.json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ error: 'Failed to delete account' });
  }
});

// Clear User Data (keep account, clear history)
app.delete('/api/user/data', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.moodEntries = [];
    user.assessments = [];
    await user.save();

    res.json({
      success: true,
      message: 'User data cleared successfully'
    });
  } catch (error) {
    console.error('Clear data error:', error);
    res.status(500).json({ error: 'Failed to clear user data' });
  }
});

// ============= HEALTH CHECK =============

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Psyche Compass API is running',
    timestamp: new Date().toISOString()
  });
});

// Root Route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to Psyche Compass API',
    version: '1.0.0',
    endpoints: {
      auth: [
        'POST /api/auth/register',
        'POST /api/auth/login',
        'GET /api/auth/me'
      ],
      mood: [
        'POST /api/mood',
        'GET /api/mood',
        'GET /api/mood/recent/:limit'
      ],
      assessment: [
        'POST /api/assessment',
        'GET /api/assessment',
        'GET /api/assessment/type/:type'
      ],
      user: [
        'GET /api/user/history',
        'GET /api/user/stats',
        'DELETE /api/user/account',
        'DELETE /api/user/data'
      ]
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API URL: http://localhost:${PORT}`);
});

// Serve frontend in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "build")));
  app.get(/.*/, (req, res) => {
    res.sendFile(path.resolve(__dirname, "build", "index.html"));
  });
}
