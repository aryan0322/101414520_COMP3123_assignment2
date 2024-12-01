require('dotenv').config();
const express = require('express');
const connectDB = require('./config/database');
const userSignUp = require('./route/user/signUp');
const userLogin = require('./route/user/login');
const employeeActions = require('./route/employee/employee_actions'); // Import employee routes
console.log('Router Object from employeeActions:', employeeActions);
const jwt = require('jsonwebtoken');

const app = express();
const SERVER_PORT = process.env.PORT || 1111;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const verifyToken = (req, res, next) => {
    console.log('Authorization Header:', req.headers.authorization);

    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        console.log('No token provided');
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Token Decoded Successfully:', decoded);
        req.user = decoded; // Attach the decoded user info to the request
        next();
    } catch (err) {
        console.log('Invalid Token:', err.message);
        return res.status(401).json({ message: 'Invalid token' });
    }
};

// Routes
app.use('/api/v1/user', userSignUp);
app.use('/api/v2/user', userLogin);
app.use('/api/v1/employees',verifyToken, employeeActions); // Register employee routes with token verification
app.use('/api', require('./route/employee/employee_actions'));

// Add debug route directly to test if `employeeActions` works
app.get('/api/v1/debug-test', (req, res) => {
    console.log('GET /api/v1/debug-test route accessed');
    res.status(200).json({ message: 'Debug route works' });
});
// Health Check Endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ message: 'Server is running and healthy!' });
});

// Protected Example Route
app.get('/api/v1/protected', verifyToken, (req, res) => {
    res.status(200).json({
        message: 'Access to protected route granted!',
        user: req.user, // Decoded user information from JWT
    });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal server error' });
});

// Start the Server
app.listen(SERVER_PORT, () => {
    console.log(`Server is running on port ${SERVER_PORT}`);
});
