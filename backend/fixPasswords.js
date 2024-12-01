const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/user');
require('dotenv').config();

const fixPasswords = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB.');

        const users = await User.find();
        console.log('Users found:', users.length);

        for (const user of users) {
            // Replace this with the original plain password for testing
            const plainPassword = 'password123';

            // Rehash the password
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(plainPassword, salt);

            // Save the updated user
            await user.save();
            console.log(`Password updated for user: ${user.email}`);
        }

        console.log('Password rehashing completed.');
        process.exit(0);
    } catch (error) {
        console.error('Error rehashing passwords:', error);
        process.exit(1);
    }
};

fixPasswords();
