const openaiConfig = require('../config/openai');

/**
 * Outreach Service
 * Generates AI-powered personalized messages and recommends actions
 */

const getRecommendedAction = (riskLevel) => {
    const actions = {
        HIGH: 'Call + Special Offer',
        MEDIUM: 'Email + Incentive',
        LOW: 'Monitor',
    };
    return actions[riskLevel] || 'Monitor';
};

const getActionDetails = (action) => {
    const details = {
        'Call + Special Offer': {
            action,
            description: 'Proactive phone call with special retention offer',
            priority: 'URGENT',
            channel: 'Phone',
            incentive: '0.5% interest rate boost for 6 months',
        },
        'Email + Incentive': {
            action,
            description: 'Personalized email with special incentive',
            priority: 'MEDIUM',
            channel: 'Email',
            incentive: 'Waived monthly fee for 3 months',
        },
        'Monitor': {
            action,
            description: 'Continue monitoring account activity',
            priority: 'LOW',
            channel: 'Monitoring',
            incentive: 'N/A',
        },
    };
    return details[action] || details['Monitor'];
};

const generateOutreachMessage = async (customer, riskReasons, riskLevel) => {
    const action = getRecommendedAction(riskLevel);

    try {
        const message = await openaiConfig.generateOutreach(customer, riskReasons, action);
        return {
            message,
            action,
            timestamp: new Date().toISOString(),
        };
    } catch (err) {
        console.error('Error generating outreach:', err);
        throw err;
    }
};

module.exports = {
    getRecommendedAction,
    getActionDetails,
    generateOutreachMessage,
};
