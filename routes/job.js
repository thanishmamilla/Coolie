const express = require('express');
const {createJob, uploadLogo} = require('../controller/jobController');
const {getAllJobs} = require('../controller/jobController');
// Import the controller functions and middleware from the jobController file
// import { createJob, uploadLogo } from './jobController.js'; 

const router = express.Router();

router.post('/jobs', uploadLogo, createJob); 
router.get('/getjobs',getAllJobs);

module.exports=router;