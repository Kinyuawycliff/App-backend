const express = require('express');
const router = express.Router();
const { 
    getAllWorks, 
    createWork, 
    getWorkById, 
    updateWork, 
    deleteWork 
} = require('../controllers/workController');
const { protect } = require('../middleware/authMiddleware'); // Middleware to protect routes

// Routes
router.route('/')
    .get(getAllWorks) // Fetch all works
    .post(protect, createWork); // Create a new work, protected route

router.route('/:id')
    .get(getWorkById) // Fetch specific work by ID
    .put(protect, updateWork) // Update specific work by ID, protected route
    .delete(protect, deleteWork); // Delete work by ID, protected route

module.exports = router;
