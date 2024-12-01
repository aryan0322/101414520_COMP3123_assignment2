const express = require('express');
const Employee = require('../../models/employee');
const { check, validationResult } = require('express-validator');
const router = express.Router();

console.log('employee_action.js loaded');

// // Minimal POST route
// router.post('/employees', (req, res) => {
//     console.log('POST /employees route accessed');
//     res.status(200).json({ message: 'Test POST /employees route works' });
// });

// // Minimal GET route
// router.get('/employees', (req, res) => {
//     console.log('GET /employees route accessed');
//     res.status(200).json({ message: 'Test GET /employees route works' });
// });


// Search employees by department or position
router.get('/employees/search', async (req, res) => {
    try {
        const { department, position } = req.query;
        const filter = {};
        if (department) filter.department = department;
        if (position) filter.position = position;

        const employees = await Employee.find(filter);
        res.json(employees);
    } catch (error) {
        res.status(500).send('Server Error');
    }
});

// Get All Employees
router.get('/get_all_employees', async (req, res) => {
    try {
        const employees = await Employee.find();
        res.status(200).json(employees);
    } catch (error) {
        console.error('Error retrieving employees:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create Employee
router.post('/create_employees', [
    check('first_name').notEmpty().withMessage('First name is required'),
    check('last_name').notEmpty().withMessage('Last name is required'),
    check('email').isEmail().withMessage('Valid email is required'),
    check('position').notEmpty().withMessage('Position is required'),
    check('salary').isNumeric().withMessage('Salary must be a number')
], async (req, res) => {
    console.log('POST /employees route accessed'); // Log when route is accessed
    console.log('Request body:', req.body); // Log the request body

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log('Validation errors:', errors.array()); // Log validation errors
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const employee = new Employee(req.body);
        await employee.save();
        console.log('Employee saved:', employee); // Log saved employee
        res.status(201).json({ message: 'Employee is created successfully', employee_id: employee._id });
    } catch (error) {
        console.error('Error creating employee:', error.message); // Log the error
        res.status(500).json({ message: 'Server error' });
    }
});

// Update Employee
router.put('/employees/:eid', async (req, res) => {
    try {
        // Define the fields allowed to update
        const updateFields = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            department: req.body.department,
            position: req.body.position,
            salary: req.body.salary,
            date_of_joining: req.body.date_of_joining
        };

        // Remove undefined fields (in case some fields are not updated)
        Object.keys(updateFields).forEach(
            (key) => updateFields[key] === undefined && delete updateFields[key]
        );

        // Update employee and return the updated document
        const employee = await Employee.findByIdAndUpdate(
            req.params.eid,
            updateFields,
            { new: true } // Return the updated document
        );

        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        res.status(200).json({
            message: 'Employee details are updated successfully',
            employee
        });
    } catch (error) {
        console.error('Error updating employee:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete Employee
router.delete('/delete_employees/:eid', async (req, res) => {
    try {
        const employee = await Employee.findByIdAndDelete(req.params.eid);
        if (!employee) {
            return res.status(404).json({ message: 'Employee is not found' });
        }
        res.status(204).json({ message: 'Employee is deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});


// Log the routes being defined in this file
router.stack.forEach((layer) => {
    if (layer.route) {
        console.log(`Defining route: ${Object.keys(layer.route.methods)[0].toUpperCase()} ${layer.route.path}`);
    }
});

module.exports = router;