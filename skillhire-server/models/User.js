const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
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
    required: function() {
      return !this.googleId && !this.githubId;
    },
    minlength: 6
  },
  userType: {
    type: String,
    enum: ['candidate', 'recruiter', 'admin'],
    default: 'candidate'
  },
  profile: {
    bio: String,
    skills: [String],
    experience: [{
      company: String,
      position: String,
      startDate: Date,
      endDate: Date,
      current: Boolean,
      description: String
    }],
    education: [{
      institution: String,
      degree: String,
      field: String,
      startDate: Date,
      endDate: Date,
      current: Boolean
    }],
    resume: {
      filename: String,
      originalName: String,
      path: String,
      uploadedAt: Date
    },
    profilePicture: String,
    location: String,
    phone: String,
    website: String,
    linkedin: String,
    github: String
  },
  company: {
    name: String,
    website: String,
    description: String,
    industry: String,
    size: String,
    location: String
  },
  googleId: String,
  githubId: String,
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: Date,
  preferences: {
    jobAlerts: {
      enabled: { type: Boolean, default: true },
      frequency: { type: String, enum: ['daily', 'weekly', 'monthly'], default: 'weekly' },
      keywords: [String],
      location: String
    },
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      sms: { type: Boolean, default: false }
    }
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Get full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Remove password from JSON output
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

module.exports = mongoose.model('User', userSchema);
