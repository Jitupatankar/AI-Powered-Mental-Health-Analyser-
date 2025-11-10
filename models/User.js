const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const moodEntrySchema = new mongoose.Schema({
  mood: { type: Number, required: true, min: 1, max: 10 },
  energy: { type: Number, required: true, min: 1, max: 10 },
  stress: { type: Number, required: true, min: 1, max: 10 },
  description: { type: String },
  timestamp: { type: Date, default: Date.now },
  date: { type: String },
  time: { type: String }
});

const assessmentSchema = new mongoose.Schema({
  type: { 
    type: String, 
    required: true,
    enum: ['big_five_personality', 'depression_screening', 'anxiety_screening', 'stress_evaluation']
  },
  responses: { type: Map, of: mongoose.Schema.Types.Mixed },
  scores: { type: Map, of: mongoose.Schema.Types.Mixed },
  timestamp: { type: Date, default: Date.now },
  date: { type: String },
  status: { type: String, default: 'Completed' }
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  joinDate: {
    type: Date,
    default: Date.now
  },
  moodEntries: [moodEntrySchema],
  assessments: [assessmentSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

// Update the updatedAt timestamp before saving
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
