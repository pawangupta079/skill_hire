const express = require('express');
const Job = require('../models/Job');
const Application = require('../models/Application');
const { auth, authorize, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/jobs
// @desc    Get all jobs with filtering and pagination
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      location,
      employmentType,
      experienceLevel,
      minSalary,
      maxSalary,
      skills,
      company,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    const query = { status: 'active' };

    // Search functionality
    if (search) {
      query.$text = { $search: search };
    }

    // Location filter
    if (location) {
      query.$or = [
        { 'location.city': { $regex: location, $options: 'i' } },
        { 'location.state': { $regex: location, $options: 'i' } },
        { 'location.country': { $regex: location, $options: 'i' } },
        { 'location.type': location }
      ];
    }

    // Employment type filter
    if (employmentType) {
      query.employmentType = employmentType;
    }

    // Experience level filter
    if (experienceLevel) {
      query.experienceLevel = experienceLevel;
    }

    // Salary range filter
    if (minSalary || maxSalary) {
      query['salary.min'] = {};
      if (minSalary) query['salary.min'].$gte = parseInt(minSalary);
      if (maxSalary) query['salary.max'] = { $lte: parseInt(maxSalary) };
    }

    // Skills filter
    if (skills) {
      const skillsArray = skills.split(',').map(skill => skill.trim());
      query['skills.name'] = { $in: skillsArray };
    }

    // Company filter
    if (company) {
      query['company.name'] = { $regex: company, $options: 'i' };
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query
    const jobs = await Job.find(query)
      .populate('postedBy', 'firstName lastName company profilePicture')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Job.countDocuments(query);

    // Increment view count for each job
    if (jobs.length > 0) {
      const jobIds = jobs.map(job => job._id);
      await Job.updateMany(
        { _id: { $in: jobIds } },
        { $inc: { viewCount: 1 } }
      );
    }

    res.json({
      jobs,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total,
      hasNextPage: page < Math.ceil(total / limit),
      hasPrevPage: page > 1
    });
  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/jobs/:id
// @desc    Get job by ID
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('postedBy', 'firstName lastName company profilePicture');

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Increment view count
    await job.incrementViewCount();

    // Check if user has applied (if authenticated)
    let hasApplied = false;
    if (req.user) {
      const application = await Application.findOne({
        job: job._id,
        candidate: req.user._id
      });
      hasApplied = !!application;
    }

    res.json({ job, hasApplied });
  } catch (error) {
    console.error('Get job error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/jobs
// @desc    Create a new job
// @access  Private/Recruiter
router.post('/', auth, authorize('recruiter', 'admin'), async (req, res) => {
  try {
    const jobData = {
      ...req.body,
      postedBy: req.user._id
    };

    const job = new Job(jobData);
    await job.save();

    await job.populate('postedBy', 'firstName lastName company profilePicture');

    res.status(201).json({
      message: 'Job created successfully',
      job
    });
  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/jobs/:id
// @desc    Update a job
// @access  Private/Recruiter
router.put('/:id', auth, authorize('recruiter', 'admin'), async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if user owns the job or is admin
    if (job.postedBy.toString() !== req.user._id.toString() && req.user.userType !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this job' });
    }

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('postedBy', 'firstName lastName company profilePicture');

    res.json({
      message: 'Job updated successfully',
      job: updatedJob
    });
  } catch (error) {
    console.error('Update job error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/jobs/:id
// @desc    Delete a job
// @access  Private/Recruiter
router.delete('/:id', auth, authorize('recruiter', 'admin'), async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if user owns the job or is admin
    if (job.postedBy.toString() !== req.user._id.toString() && req.user.userType !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this job' });
    }

    await Job.findByIdAndDelete(req.params.id);

    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/jobs/my-jobs
// @desc    Get jobs posted by current user
// @access  Private/Recruiter
router.get('/my-jobs', auth, authorize('recruiter', 'admin'), async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    const query = { postedBy: req.user._id };
    if (status) {
      query.status = status;
    }

    const jobs = await Job.find(query)
      .populate('postedBy', 'firstName lastName company profilePicture')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Job.countDocuments(query);

    res.json({
      jobs,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    console.error('Get my jobs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/jobs/:id/status
// @desc    Update job status
// @access  Private/Recruiter
router.put('/:id/status', auth, authorize('recruiter', 'admin'), async (req, res) => {
  try {
    const { status } = req.body;
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if user owns the job or is admin
    if (job.postedBy.toString() !== req.user._id.toString() && req.user.userType !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this job' });
    }

    job.status = status;
    await job.save();

    res.json({
      message: 'Job status updated successfully',
      job
    });
  } catch (error) {
    console.error('Update job status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/jobs/search/suggestions
// @desc    Get search suggestions
// @access  Public
router.get('/search/suggestions', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.length < 2) {
      return res.json({ suggestions: [] });
    }

    // Get job title suggestions
    const titleSuggestions = await Job.aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: '$title', count: { $sum: 1 } } },
      { $match: { _id: { $regex: q, $options: 'i' } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      { $project: { _id: 0, title: '$_id', count: 1 } }
    ]);

    // Get company suggestions
    const companySuggestions = await Job.aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: '$company.name', count: { $sum: 1 } } },
      { $match: { _id: { $regex: q, $options: 'i' } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      { $project: { _id: 0, company: '$_id', count: 1 } }
    ]);

    // Get skill suggestions
    const skillSuggestions = await Job.aggregate([
      { $match: { status: 'active' } },
      { $unwind: '$skills' },
      { $group: { _id: '$skills.name', count: { $sum: 1 } } },
      { $match: { _id: { $regex: q, $options: 'i' } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      { $project: { _id: 0, skill: '$_id', count: 1 } }
    ]);

    res.json({
      suggestions: {
        titles: titleSuggestions,
        companies: companySuggestions,
        skills: skillSuggestions
      }
    });
  } catch (error) {
    console.error('Get suggestions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
