require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const documentRoutes = require('./routes/documentRoutes');
const instructionRoutes = require('./routes/instructionRoutes');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const CustomError = require('./utils/customError');
const authenticateJWT = require('./middleware/authMiddleware');
const cors = require('cors'); // Add this for handling CORS

const app = express();
const port = process.env.PORT || 3001;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true // If needed for unique indexes, add this option
})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => {
        console.error('Could not connect to MongoDB:', err);
        process.exit(1);
    });

// Middleware
app.use(cors()); // Enable CORS for all origins
app.use(express.json());
app.use(authenticateJWT); // Apply authentication to all routes (except authRoutes)

// Routes
app.use('/api/documents', documentRoutes);
app.use('/api/instructions', instructionRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes); // Public authentication routes

// Error handling middleware (MUST be placed AFTER all routes)
app.use((err, req, res, next) => {
    if (err instanceof CustomError) {
        console.error(err);
        return res.status(err.statusCode).json({ message: err.message });
    } else {
        console.error(err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running on https://localhost:${port}/`);
});
