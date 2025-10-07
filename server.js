
// const express = require('express');
// const cors = require('cors');
// const bodyParser = require('body-parser');
// const mongoose = require('mongoose');
// const dotenv = require('dotenv');
// const authRoutes = require('./routes/auth');
// const jobRoutes = require('./routes/job');

// dotenv.config({});

// const connectDB = async ()=>{
//     try{
//         await mongoose.connect("mongodb+srv://thanishmamilla:thanish123@cluster0.1x0tmmk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
//         console.log("database connected")
//     }
//     catch(error)
//     {
//         console.log("error while connecting to database",error);
//     }
// }

// connectDB();

// const app=express();
// app.use(express.json());
// app.use(cors({
//     origin:"http://localhost:5173",
//     credentials:true
// }));
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use('/api/auth', authRoutes);
// app.use('/api', jobRoutes); 
// app.get('/', (req, res) => {
//   res.send('Job Admin API Running');
// });


// app.listen(5000,()=>{
//     console.log("server is starting");
// })


const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path'); // Required for serving static files

const authRoutes = require('./routes/auth');
const jobRoutes = require('./routes/job');

dotenv.config({});
const url=process.env.MONGODB_URL;
const connectDB = async () => {
    try {
        await mongoose.connect(url);
        console.log("Database connected");
    } catch (error) {
        console.log("error while connecting to database", error);
    }
};

connectDB();

const app = express();

// --- Middleware Setup ---
app.use(express.json());
app.use(cors({
    // Keep CORS for API testing during development
    origin: {"https://dynamic-hotteok-ea464c.netlify.app","http://localhost:5173"},
    credentials: true
}));
app.use(bodyParser.urlencoded({ extended: true }));

// --- 1. Serve Static 'uploads' Folder ---
// Allows access to uploaded files (like logos) via /uploads/filename.ext
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- 2. API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api', jobRoutes); 

// API Test Route (Moved from '/' to '/api/status' to avoid conflict with frontend serving)
app.get('/api/status', (req, res) => {
    res.send('Job Admin API Running');
});

// --- 3. Serve Frontend Build ---
// UPDATED ASSUMPTION: The compiled frontend files are located in a folder named 'dist' in the root directory.
const frontendBuildPath = path.join(__dirname, 'dist');

// Serve the static assets from the build folder (CSS, JS, images, etc.)
app.use(express.static(frontendBuildPath));

// For Single Page Application (SPA) routing, serve index.html for all GET requests that haven't been handled yet (i.e., by API routes or static files).
// FIX: Changed '/*' back to '*' to resolve PathError. This is the standard Express catch-all.



app.listen(5000, () => {
    console.log("Server is starting on port 5000");
    console.log(`Frontend served from: ${frontendBuildPath}`);
});
