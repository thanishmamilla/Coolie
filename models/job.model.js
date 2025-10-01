

// import * as mongoose from 'mongoose';
const mongoose = require('mongoose');

// Define the allowed Job Types using an Enum or simple array
const JobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship'];

const JobSchema = new mongoose.Schema({
  // 1. Pages/Filters: Job Title, Location, Job Type, Salary Range
  
  title: { 
    type: String, 
    required: true, 
    trim: true,
    index: true // Recommended for search/filtering
  },
  
  location: { 
    type: String, 
    required: true,
    index: true // Recommended for search/filtering
  },
  
  jobType: { 
    type: String, 
    enum: JobTypes, // Restricts values to the list
    required: true,
    index: true // Recommended for filtering
  },
  
  salaryRange: { 
    type: String, // Storing as a string (e.g., "50k - 70k") based on the text input requirement
    required: true,
    index: true // Recommended for filtering/sorting
  },

  companyName: { 
    type: String, 
    required: true 
  },
   companyLogoUrl: {
    type: String,
    default: null // Optional field, can be null if no logo uploaded
  },
  
  // Use String for 'Textarea' fields
  description: { 
    type: String, 
    required: true 
  },
  
  requirements: { 
    type: String, // Could also be [String] if storing as a list of requirements
    required: true 
  },
  
  responsibilities: { 
    type: String, // Could also be [String] if storing as a list of responsibilities
    required: true 
  },
  
  applicationDeadline: { 
    type: Date, // Date Picker input maps to the Date type
    required: true 
  }
}, {
  // Add timestamps for createdAt and updatedAt tracking
  timestamps: true, 
  collection: 'jobPostings'
});


module.exports = mongoose.model('Job', JobSchema);