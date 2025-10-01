const Job = require('../models/job.model');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/logos/');
    },
    filename: (req, file, cb) => {
        // Create a unique filename with original extension
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    },
});

// Filter to ensure only image files are accepted
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

// Middleware function ready to handle a single file named 'logo'
const uploadLogo = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // Limit file size to 5MB
}).single('logo');


const createJob = async (req, res) => {
    try {
        const {
            title,
            companyName,
            location,
            jobType,
            salaryRange,
            applicationDeadline,
            description,
            requirements,
            responsibilities
        } = req.body;

        // 1. Mandatory Field Validation
        if (!title || !companyName || !location || !jobType || !salaryRange || !applicationDeadline || !description || !requirements || !responsibilities) {
            return res.status(400).json({ message: 'Missing required job fields in request body.' });
        }
        
        // 2. Store relative path for serving static files
        // IMPORTANT: Don't use req.file.path as it contains absolute computer path
        // Instead, construct relative path using filename only
        const logoPath = req.file ? `uploads/logos/${req.file.filename}` : null;

        const deadlineDate = new Date(applicationDeadline);
        
        // 3. Create the Job Document
        const newJob = await Job.create({
            title,
            companyName,
            location,
            jobType,
            salaryRange,
            description,
            requirements,
            responsibilities,
            applicationDeadline: deadlineDate,
            companyLogoUrl: logoPath, // Store relative path
        });

        // 4. Return Success Response
        res.status(201).json({
            message: 'Job posting created successfully',
            job: newJob,
        });

    } catch (error) {
        console.error('Error creating job posting:', error);
        
        // Handle Mongoose validation errors specifically
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ message: 'Validation Error', errors: messages });
        }
        
        res.status(500).json({ message: 'Server error while creating job.' });
    }
};


const getAllJobs = async (req, res) => {
    try {
        // Fetch all jobs from database, sorted by creation date (newest first)
        const jobs = await Job.find().sort({ createdAt: -1 });

        // Return success response with jobs array
        res.status(200).json({
            message: 'Jobs retrieved successfully',
            count: jobs.length,
            jobs: jobs,
        });

    } catch (error) {
        console.error('Error fetching jobs:', error);
        res.status(500).json({ message: 'Server error while fetching jobs.' });
    }
};


module.exports = {
    createJob,
    getAllJobs,
    uploadLogo,
};