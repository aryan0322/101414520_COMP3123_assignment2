const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define User Schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

// Automatically update the `updated_at` field before saving
userSchema.pre('save', function (next) {
    this.updated_at = Date.now();
    next();
});

// Method to compare passwords for login
userSchema.methods.comparePassword = async function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
};

// Create and export the User model
const User = mongoose.model('User', userSchema);
module.exports = User;
