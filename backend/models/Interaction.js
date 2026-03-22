const pool = require('../config/database');

class Interaction {
    static async create(customerId, outreachMessage, recommendedAction) {
        try {
            const result = await pool.query(
                'INSERT INTO interactions (customer_id, outreach_message, recommended_action, status, outcome) VALUES ($1, $2, $3, $4, $5) RETURNING *',
                [customerId, outreachMessage, recommendedAction, 'pending', 'pending']
            );
            return result.rows[0];
        } catch (err) {
            console.error('Error creating interaction:', err);
            throw err;
        }
    }

    static async getByCustomerId(customerId) {
        try {
            const result = await pool.query(
                'SELECT * FROM interactions WHERE customer_id = $1 ORDER BY timestamp DESC',
                [customerId]
            );
            return result.rows;
        } catch (err) {
            console.error('Error fetching interactions:', err);
            throw err;
        }
    }

    static async updateFeedback(id, status, outcome) {
        try {
            const result = await pool.query(
                'UPDATE interactions SET status = $1, outcome = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
                [status, outcome, id]
            );
            return result.rows[0];
        } catch (err) {
            console.error('Error updating interaction:', err);
            throw err;
        }
    }

    static async getLatestByCustomerId(customerId) {
        try {
            const result = await pool.query(
                'SELECT * FROM interactions WHERE customer_id = $1 ORDER BY timestamp DESC LIMIT 1',
                [customerId]
            );
            return result.rows[0];
        } catch (err) {
            console.error('Error fetching latest interaction:', err);
            throw err;
        }
    }
}

module.exports = Interaction;
