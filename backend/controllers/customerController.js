const Customer = require('../models/Customer');
const Interaction = require('../models/Interaction');
const { calculateRiskScore } = require('../services/riskScoringService');
const outreachService = require('../services/outreachService');

/**
 * Get all customers with risk scores
 */
const getAllCustomers = async (req, res) => {
    try {
        const customers = await Customer.getAll();
        res.json({
            success: true,
            data: customers,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch customers',
            message: err.message,
        });
    }
};

/**
 * Get detailed customer profile with interactions
 */
const getCustomerDetail = async (req, res) => {
    try {
        const { id } = req.params;
        const customer = await Customer.getById(id);

        if (!customer) {
            return res.status(404).json({
                success: false,
                error: 'Customer not found',
            });
        }

        const interactions = await Interaction.getByCustomerId(id);

        res.json({
            success: true,
            data: {
                customer,
                interactions,
            },
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch customer details',
            message: err.message,
        });
    }
};

/**
 * Recalculate risk scores for all customers
 */
const calculateRiskForAll = async (req, res) => {
    try {
        const updated = await Customer.recalculateAll();

        res.json({
            success: true,
            message: 'Risk scores recalculated for all customers',
            data: updated,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: 'Failed to calculate risk scores',
            message: err.message,
        });
    }
};

/**
 * Get recommended action for a customer
 */
const getRecommendedAction = async (req, res) => {
    try {
        const { id } = req.params;
        const customer = await Customer.getById(id);

        if (!customer) {
            return res.status(404).json({
                success: false,
                error: 'Customer not found',
            });
        }

        const action = outreachService.getRecommendedAction(customer.risk_level);
        const actionDetails = outreachService.getActionDetails(action);

        res.json({
            success: true,
            data: {
                customerId: id,
                riskLevel: customer.risk_level,
                action,
                ...actionDetails,
            },
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: 'Failed to get recommended action',
            message: err.message,
        });
    }
};

/**
 * Generate AI-powered outreach message
 */
const generateOutreach = async (req, res) => {
    try {
        const { id } = req.params;
        const customer = await Customer.getById(id);

        if (!customer) {
            return res.status(404).json({
                success: false,
                error: 'Customer not found',
            });
        }

        const action = outreachService.getRecommendedAction(customer.risk_level);
        const outreach = await outreachService.generateOutreachMessage(
            customer,
            customer.risk_reasons,
            customer.risk_level
        );

        // Save interaction
        const interaction = await Interaction.create(
            id,
            outreach.message,
            action
        );

        res.json({
            success: true,
            data: {
                interactionId: interaction.id,
                customerId: id,
                message: outreach.message,
                action: outreach.action,
                timestamp: outreach.timestamp,
            },
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: 'Failed to generate outreach message',
            message: err.message,
        });
    }
};

/**
 * Submit feedback on interaction outcome
 */
const submitFeedback = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, outcome } = req.body;

        if (!status || !outcome) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: status, outcome',
            });
        }

        const updated = await Interaction.updateFeedback(id, status, outcome);

        res.json({
            success: true,
            message: 'Feedback recorded successfully',
            data: updated,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: 'Failed to submit feedback',
            message: err.message,
        });
    }
};

/**
 * Get dashboard statistics
 */
const getDashboardStats = async (req, res) => {
    try {
        const stats = await Customer.getChurnStats();
        const topReasons = await Customer.getTopChurnReasons();

        res.json({
            success: true,
            data: {
                stats,
                topReasons,
            },
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch dashboard stats',
            message: err.message,
        });
    }
};

module.exports = {
    getAllCustomers,
    getCustomerDetail,
    calculateRiskForAll,
    getRecommendedAction,
    generateOutreach,
    submitFeedback,
    getDashboardStats,
};
