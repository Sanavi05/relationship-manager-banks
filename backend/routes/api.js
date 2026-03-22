const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');

/**
 * Customer API Routes
 */

// Get all customers with risk scores
router.get('/customers', customerController.getAllCustomers);

// Get detailed customer profile
router.get('/customers/:id', customerController.getCustomerDetail);

// Recalculate risk scores for all customers
router.post('/calculate-risk', customerController.calculateRiskForAll);

// Get recommended action for a customer
router.get('/recommend-action/:id', customerController.getRecommendedAction);

// Generate AI outreach message
router.post('/generate-outreach/:id', customerController.generateOutreach);

// Submit feedback on interaction
router.post('/feedback/:id', customerController.submitFeedback);

// Get dashboard statistics
router.get('/dashboard/stats', customerController.getDashboardStats);

module.exports = router;
