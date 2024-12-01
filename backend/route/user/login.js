const express = require('express');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../../models/user');

const router = express.Router();

router.post('/login', [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').notEmpty()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const email = req.body.email.toLowerCase().trim();
    const password = req.body.password.trim();

    try {
        console.log('User login request received for email:', email);

        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            console.log('No user found with email:', email);
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        console.log('User found:', user);

        // Use the model's `comparePassword` method for password verification
        const isPasswordMatch = await user.comparePassword(password);
        if (!isPasswordMatch) {
            console.log('Password mismatch for email:', email);
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Ensure JWT secret is defined
        if (!process.env.JWT_SECRET) {
            console.error('JWT_SECRET is not defined in the environment variables.');
            return res.status(500).json({ error: 'Server configuration error' });
        }

        // Generate a JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        console.log('Generated JWT token for user:', user.email);

        res.status(200).json({
            message: 'Login successful',
            jwt_token: token
        });

    } catch (error) {
        console.error('Unexpected error during login:', error.message, error.stack);
        return res.status(500).json({ error: 'Unexpected server error occurred' });
    }
});

module.exports = router;
