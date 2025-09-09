const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  candidate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recruiter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'shortlisted', 'interviewed', 'rejected', 'accepted', 'withdrawn'],
    default: 'pending'
  },
  coverLetter: {
    type: String,
    maxlength: 2000
  },
  resume: {
    filename: String,
    originalName: String,
    path: String,
    uploadedAt: Date
  },
  documents: [{
    filename: String,
    originalName: String,
    path: String,
    type: String,
    uploadedAt: Date
  }],
  aiMatchScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  matchFactors: [{
    factor: String,
    score: Number,
    weight: Number
  }],
  notes: [{
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    content: String,
    addedAt: {
      type: Date,
      default: Date.now
    },
    isPrivate: {
      type: Boolean,
      default: false
    }
  }],
  interviewSchedule: [{
    scheduledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    scheduledAt: Date,
    duration: Number, // in minutes
    type: {
      type: String,
      enum: ['phone', 'video', 'in-person', 'technical', 'hr']
    },
    location: String,
    meetingLink: String,
    status: {
      type: String,
      enum: ['scheduled', 'completed', 'cancelled', 'rescheduled'],
      default: 'scheduled'
    },
    feedback: String,
    rating: {
      type: Number,
      min: 1,
      max: 5
    }
  }],
  timeline: [{
    action: String,
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    details: String
  }],
  communication: [{
    type: {
      type: String,
      enum: ['email', 'message', 'call', 'meeting']
    },
    content: String,
    sentBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    sentAt: {
      type: Date,
      default: Date.now
    },
    isRead: {
      type: Boolean,
      default: false
    }
  }]
}, {
  timestamps: true
});

// Indexes for efficient querying
applicationSchema.index({ job: 1, candidate: 1 }, { unique: true });
applicationSchema.index({ candidate: 1, status: 1 });
applicationSchema.index({ recruiter: 1, status: 1 });
applicationSchema.index({ status: 1, createdAt: -1 });
applicationSchema.index({ aiMatchScore: -1 });

// Pre-save middleware to add timeline entry
applicationSchema.pre('save', function(next) {
  if (this.isNew) {
    this.timeline.push({
      action: 'Application submitted',
      performedBy: this.candidate,
      details: 'Application was submitted for the job'
    });
  }
  next();
});

// Method to update status with timeline entry
applicationSchema.methods.updateStatus = function(newStatus, performedBy, details) {
  this.status = newStatus;
  this.timeline.push({
    action: `Status changed to ${newStatus}`,
    performedBy,
    details: details || `Application status updated to ${newStatus}`
  });
  return this.save();
};

// Method to add communication
applicationSchema.methods.addCommunication = function(type, content, sentBy) {
  this.communication.push({
    type,
    content,
    sentBy,
    sentAt: new Date()
  });
  return this.save();
};

// Method to schedule interview
applicationSchema.methods.scheduleInterview = function(interviewData) {
  this.interviewSchedule.push({
    ...interviewData,
    scheduledAt: new Date(interviewData.scheduledAt)
  });
  
  this.timeline.push({
    action: 'Interview scheduled',
    performedBy: interviewData.scheduledBy,
    details: `Interview scheduled for ${interviewData.scheduledAt}`
  });
  
  return this.save();
};

// Virtual for days since application
applicationSchema.virtual('daysSinceApplication').get(function() {
  const now = new Date();
  const diffTime = Math.abs(now - this.createdAt);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

module.exports = mongoose.model('Application', applicationSchema);
