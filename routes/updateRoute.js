const express = require('express');
const router = express.Router();

// Destructure controller methods
const {
  createUpdate,
  getAllUpdates,
  getUpdateById,
  updateUpdate,
  deleteUpdate
} = require('../controllers/updateController');

// Routes
router.post('/updates', createUpdate);       
router.get('/updates', getAllUpdates);        
router.get('/updates/:id', getUpdateById);   
router.put('/updates/:id', updateUpdate);     
router.delete('/updates/:id', deleteUpdate);  

module.exports = router;
