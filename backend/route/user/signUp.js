const bcrypt = require('bcryptjs');
const express = require('express');
const { check, validationResult } = require('express-validator');
const User = require('../../models/user');

const router = express.Router();

// Signup Route
router.post('/signup', [
    check('username', 'Username is required').notEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be at least 6 characters').isLength({ min: 6 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    try {
        console.log('Signup request received:', req.body);

        // Check if the user already exists
        let user = await User.findOne({ email: email.toLowerCase().trim() });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        console.log('Password before hashing:', password);
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        console.log('Password after hashing:', hashedPassword);

        // Create a new user
        user = new User({
            username,
            email: email.toLowerCase().trim(),
            password: hashedPassword
        });

        console.log('User data after hashing password:', user);

        // Save the user in the database
        await user.save();
        console.log('User saved successfully:', user);

        res.status(201).json({ message: 'User created successfully', user_id: user._id });
    } catch (error) {
        console.error('Error during signup:', error.message);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
