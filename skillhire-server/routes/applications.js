const express = require('express');
const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/applications
// @desc    Apply for a job
// @access  Private/Candidate
router.post('/', auth, authorize('candidate'), async (req, res) => {
  try {
    const { jobId, coverLetter, resume } = req.body;

    // Check if job exists and is active
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.status !== 'active') {
      return res.status(400).json({ message: 'Job is not accepting applications' });
    }

    // Check if user has already applied
    const existingApplication = await Application.findOne({
      job: jobId,
      candidate: req.user._id
    });

    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }

    // Create application
    const application = new Application({
      job: jobId,
      candidate: req.user._id,
      recruiter: job.postedBy,
      coverLetter,
      resume: resume || req.user.profile.resume
    });

    await application.save();

    // Increment application count for job
    await job.incrementApplicationCount();

    // Populate application data
    await application.populate([
      { path: 'job', select: 'title company location' },
      { path: 'candidate', select: 'firstName lastName email profile' },
      { path: 'recruiter', select: 'firstName lastName email company' }
    ]);

    res.status(201).json({
      message: 'Application submitted successfully',
      application
    });
  } catch (error) {
    console.error('Apply for job error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/applications/my-applications
// @desc    Get user's applications
// @access  Private/Candidate
router.get('/my-applications', auth, authorize('candidate'), async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    const query = { candidate: req.user._id };
    if (status) {
      query.status = status;
    }

    const applications = await Application.find(query)
      .populate('job', 'title company location employmentType salary createdAt')
      .populate('recruiter', 'firstName lastName company')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Application.countDocuments(query);

    res.json({
      applications,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    console.error('Get my applications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/applications/job/:jobId
// @desc    Get applications for a specific job
// @access  Private/Recruiter
router.get('/job/:jobId', auth, authorize('recruiter', 'admin'), async (req, res) => {
  try {
    const { page = 1, limit = 10, status, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    // Check if user owns the job
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.postedBy.toString() !== req.user._id.toString() && req.user.userType !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view these applications' });
    }

    const query = { job: req.params.jobId };
    if (status) {
      query.status = status;
    }

    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const applications = await Application.find(query)
      .populate('candidate', 'firstName lastName email profile')
      .populate('job', 'title company')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Application.countDocuments(query);

    res.json({
      applications,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    console.error('Get job applications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/applications/:id
// @desc    Get application by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('candidate', 'firstName lastName email profile')
      .populate('job', 'title company location')
      .populate('recruiter', 'firstName lastName email company');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Check if user has access to this application
    const isOwner = application.candidate._id.toString() === req.user._id.toString();
    const isRecruiter = application.recruiter._id.toString() === req.user._id.toString();
    const isAdmin = req.user.userType === 'admin';

    if (!isOwner && !isRecruiter && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to view this application' });
    }

    res.json({ application });
  } catch (error) {
    console.error('Get application error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/applications/:id/status
// @desc    Update application status
// @access  Private/Recruiter
router.put('/:id/status', auth, authorize('recruiter', 'admin'), async (req, res) => {
  try {
    const { status, notes } = req.body;

    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Check if user has access to this application
    const job = await Job.findById(application.job);
    if (job.postedBy.toString() !== req.user._id.toString() && req.user.userType !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this application' });
    }

    // Update status with timeline entry
    await application.updateStatus(status, req.user._id, notes);

    // Add note if provided
    if (notes) {
      application.notes.push({
        addedBy: req.user._id,
        content: notes,
        isPrivate: false
      });
      await application.save();
    }

    await application.populate([
      { path: 'candidate', select: 'firstName lastName email' },
      { path: 'job', select: 'title company' }
    ]);

    res.json({
      message: 'Application status updated successfully',
      application
    });
  } catch (error) {
    console.error('Update application status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/applications/:id/notes
// @desc    Add note to application
// @access  Private
router.post('/:id/notes', auth, async (req, res) => {
  try {
    const { content, isPrivate = false } = req.body;

    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Check if user has access to this application
    const isOwner = application.candidate.toString() === req.user._id.toString();
    const isRecruiter = application.recruiter.toString() === req.user._id.toString();
    const isAdmin = req.user.userType === 'admin';

    if (!isOwner && !isRecruiter && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to add notes to this application' });
    }

    application.notes.push({
      addedBy: req.user._id,
      content,
      isPrivate
    });

    await application.save();

    res.json({
      message: 'Note added successfully',
      application
    });
  } catch (error) {
    console.error('Add note error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/applications/:id/interview
// @desc    Schedule interview
// @access  Private/Recruiter
router.post('/:id/interview', auth, authorize('recruiter', 'admin'), async (req, res) => {
  try {
    const interviewData = {
      ...req.body,
      scheduledBy: req.user._id
    };

    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Check if user has access to this application
    const job = await Job.findById(application.job);
    if (job.postedBy.toString() !== req.user._id.toString() && req.user.userType !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to schedule interview for this application' });
    }

    await application.scheduleInterview(interviewData);

    res.json({
      message: 'Interview scheduled successfully',
      application
    });
  } catch (error) {
    console.error('Schedule interview error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/applications/dashboard/stats
// @desc    Get application statistics
// @access  Private
router.get('/dashboard/stats', auth, async (req, res) => {
  try {
    let stats = {};

    if (req.user.userType === 'candidate') {
      // Candidate stats
      const totalApplications = await Application.countDocuments({ candidate: req.user._id });
      const pendingApplications = await Application.countDocuments({ 
        candidate: req.user._id, 
        status: 'pending' 
      });
      const shortlistedApplications = await Application.countDocuments({ 
        candidate: req.user._id, 
        status: 'shortlisted' 
      });
      const interviewedApplications = await Application.countDocuments({ 
        candidate: req.user._id, 
        status: 'interviewed' 
      });

      stats = {
        totalApplications,
        pendingApplications,
        shortlistedApplications,
        interviewedApplications
      };
    } else if (req.user.userType === 'recruiter') {
      // Recruiter stats
      const myJobs = await Job.find({ postedBy: req.user._id });
      const jobIds = myJobs.map(job => job._id);

      const totalApplications = await Application.countDocuments({ job: { $in: jobIds } });
      const pendingApplications = await Application.countDocuments({ 
        job: { $in: jobIds }, 
        status: 'pending' 
      });
      const shortlistedApplications = await Application.countDocuments({ 
        job: { $in: jobIds }, 
        status: 'shortlisted' 
      });
      const interviewedApplications = await Application.countDocuments({ 
        job: { $in: jobIds }, 
        status: 'interviewed' 
      });

      stats = {
        totalApplications,
        pendingApplications,
        shortlistedApplications,
        interviewedApplications,
        totalJobs: myJobs.length
      };
    }

    res.json({ stats });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
