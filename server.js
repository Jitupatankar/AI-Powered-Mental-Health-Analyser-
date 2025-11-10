require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const path = require("path");
const User = require("./models/User");

const app = express();
const PORT = process.env.PORT || 5000;

// ==================== MIDDLEWARE ====================
app.use(cors());
app.use(express.json());

// ==================== DATABASE CONNECTION ====================
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
  });

// ==================== JWT AUTH ====================
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-this-in-production";

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Access token required" });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid or expired token" });
    req.user = user;
    next();
  });
};

// ==================== AUTH ROUTES ====================
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ error: "All fields are required" });
    if (password.length < 6)
      return res.status(400).json({ error: "Password must be at least 6 characters long" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ error: "User with this email already exists" });

    const user = new User({ name, email, password, joinDate: new Date() });
    await user.save();

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        joinDate: user.joinDate,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Registration failed. Please try again." });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "Email and password are required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "Invalid email or password" });

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) return res.status(401).json({ error: "Invalid email or password" });

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        joinDate: user.joinDate,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed. Please try again." });
  }
});

app.get("/api/auth/me", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ user });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ error: "Failed to fetch user data" });
  }
});

// ==================== MOOD ROUTES ====================
app.post("/api/mood", authenticateToken, async (req, res) => {
  try {
    const { mood, energy, stress, description } = req.body;
    if (!mood || !energy || !stress)
      return res.status(400).json({ error: "Mood, energy, and stress levels are required" });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const newEntry = {
      mood,
      energy,
      stress,
      description: description || "",
      timestamp: new Date(),
      date: new Date().toLocaleDateString("en-US"),
      time: new Date().toLocaleTimeString("en-US"),
    };

    user.moodEntries.unshift(newEntry);
    await user.save();

    res.status(201).json({ success: true, moodEntry: newEntry });
  } catch (error) {
    console.error("Save mood entry error:", error);
    res.status(500).json({ error: "Failed to save mood entry" });
  }
});

app.get("/api/mood", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ success: true, moodEntries: user.moodEntries });
  } catch (error) {
    console.error("Get mood entries error:", error);
    res.status(500).json({ error: "Failed to fetch mood entries" });
  }
});

// ==================== ASSESSMENT ROUTES (NEW) ====================
app.post("/api/assessment", authenticateToken, async (req, res) => {
  try {
    const { type, responses, scores } = req.body;
    if (!type || !responses)
      return res.status(400).json({ error: "Assessment type and responses are required" });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const newAssessment = {
      type,
      responses,
      scores: scores || {},
      date: new Date(),
      status: "completed",
    };

    user.assessments.unshift(newAssessment);
    await user.save();

    res.status(201).json({ success: true, assessment: newAssessment });
  } catch (error) {
    console.error("Save assessment error:", error);
    res.status(500).json({ error: "Failed to save assessment" });
  }
});

app.get("/api/assessment", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ success: true, assessments: user.assessments });
  } catch (error) {
    console.error("Get assessments error:", error);
    res.status(500).json({ error: "Failed to fetch assessments" });
  }
});

app.get("/api/assessment/type/:type", authenticateToken, async (req, res) => {
  try {
    const { type } = req.params;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const filtered = user.assessments.filter((a) => a.type === type);
    res.json({ success: true, assessments: filtered });
  } catch (error) {
    console.error("Get assessments by type error:", error);
    res.status(500).json({ error: "Failed to fetch assessments by type" });
  }
});

// ==================== USER ROUTES ====================
app.get("/api/user/stats", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentEntries = user.moodEntries.filter((e) => new Date(e.timestamp) >= sevenDaysAgo);
    let stats = {
      moodAverage: 0,
      energyLevel: 0,
      stressLevel: 0,
      totalEntries: user.moodEntries.length,
      totalAssessments: user.assessments.length,
    };

    if (recentEntries.length > 0) {
      const totals = recentEntries.reduce(
        (acc, e) => ({
          mood: acc.mood + e.mood,
          energy: acc.energy + e.energy,
          stress: acc.stress + e.stress,
        }),
        { mood: 0, energy: 0, stress: 0 }
      );
      stats.moodAverage = +(totals.mood / recentEntries.length).toFixed(1);
      stats.energyLevel = +(totals.energy / recentEntries.length).toFixed(1);
      stats.stressLevel = +(totals.stress / recentEntries.length).toFixed(1);
    }

    res.json({ success: true, stats });
  } catch (error) {
    console.error("Get stats error:", error);
    res.status(500).json({ error: "Failed to fetch statistics" });
  }
});

// ==================== API INFO ====================
app.get("/api", (req, res) => {
  res.json({
    message: "Welcome to Psyche Compass API",
    version: "1.0.0",
    endpoints: {
      auth: ["POST /api/auth/register", "POST /api/auth/login", "GET /api/auth/me"],
      mood: ["POST /api/mood", "GET /api/mood"],
      assessment: [
        "POST /api/assessment",
        "GET /api/assessment",
        "GET /api/assessment/type/:type",
      ],
      user: ["GET /api/user/stats"],
    },
  });
});

// ==================== ERROR HANDLER ====================
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// ==================== SERVE FRONTEND (REACT BUILD) ====================
if (process.env.NODE_ENV === "production") {
  const buildPath = path.join(__dirname, "build");
  app.use(express.static(buildPath));

  // React fallback AFTER APIs
  app.get(/.*/, (req, res) => {
    res.sendFile(path.resolve(buildPath, "index.html"));
  });
}

// ==================== START SERVER ====================
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
