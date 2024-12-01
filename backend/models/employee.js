const mongoose = require('mongoose');

// Define the Employee Schema
const employeeSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    department: String,
    position: String,
    salary: Number,
    date_of_joining: Date,
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

// Middleware to update the `updated_at` field before saving
employeeSchema.pre('save', function (next) {
    this.updated_at = Date.now();
    next();
});

// Export the Employee model
const Employee = mongoose.model('Employee', employeeSchema);
module.exports = Employee;
