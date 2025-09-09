const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  company: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    logo: String,
    website: String,
    description: String,
    industry: String,
    size: String,
    location: String
  },
  location: {
    type: {
      type: String,
      enum: ['remote', 'on-site', 'hybrid'],
      default: 'on-site'
    },
    address: String,
    city: String,
    state: String,
    country: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  employmentType: {
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'internship', 'freelance'],
    default: 'full-time'
  },
  experienceLevel: {
    type: String,
    enum: ['entry', 'mid', 'senior', 'executive'],
    default: 'mid'
  },
  salary: {
    min: Number,
    max: Number,
    currency: {
      type: String,
      default: 'USD'
    },
    period: {
      type: String,
      enum: ['hourly', 'monthly', 'yearly'],
      default: 'yearly'
    },
    negotiable: {
      type: Boolean,
      default: false
    }
  },
  skills: [{
    name: String,
    required: Boolean,
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'expert'],
      default: 'intermediate'
    }
  }],
  requirements: [String],
  benefits: [String],
  responsibilities: [String],
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'paused', 'closed', 'filled'],
    default: 'active'
  },
  applicationDeadline: Date,
  startDate: Date,
  applicationCount: {
    type: Number,
    default: 0
  },
  viewCount: {
    type: Number,
    default: 0
  },
  featured: {
    type: Boolean,
    default: false
  },
  tags: [String],
  aiMatchScore: {
    type: Number,
    min: 0,
    max: 100
  }
}, {
  timestamps: true
});

// Index for search functionality
jobSchema.index({
  title: 'text',
  description: 'text',
  'company.name': 'text',
  skills: 'text',
  tags: 'text'
});

// Index for filtering
jobSchema.index({ status: 1, employmentType: 1, experienceLevel: 1 });
jobSchema.index({ 'location.city': 1, 'location.state': 1 });
jobSchema.index({ postedBy: 1 });
jobSchema.index({ createdAt: -1 });

// Virtual for formatted salary
jobSchema.virtual('formattedSalary').get(function() {
  if (!this.salary.min && !this.salary.max) return 'Not specified';
  
  const formatNumber = (num) => {
    if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `$${(num / 1000).toFixed(0)}K`;
    return `$${num}`;
  };
  
  if (this.salary.min && this.salary.max) {
    return `${formatNumber(this.salary.min)} - ${formatNumber(this.salary.max)}`;
  } else if (this.salary.min) {
    return `${formatNumber(this.salary.min)}+`;
  } else if (this.salary.max) {
    return `Up to ${formatNumber(this.salary.max)}`;
  }
  
  return 'Not specified';
});

// Method to increment view count
jobSchema.methods.incrementViewCount = function() {
  this.viewCount += 1;
  return this.save();
};

// Method to increment application count
jobSchema.methods.incrementApplicationCount = function() {
  this.applicationCount += 1;
  return this.save();
};

module.exports = mongoose.model('Job', jobSchema);
