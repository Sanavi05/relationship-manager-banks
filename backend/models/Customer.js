const pool = require('../config/database');
const { calculateRiskScore } = require('../services/riskScoringService');

class Customer {
    static async getAll() {
        try {
            const result = await pool.query('SELECT * FROM customers ORDER BY risk_score DESC');
            return result.rows;
        } catch (err) {
            console.error('Error fetching customers:', err);
            throw err;
        }
    }

    static async getById(id) {
        try {
            const result = await pool.query('SELECT * FROM customers WHERE id = $1', [id]);
            return result.rows[0];
        } catch (err) {
            console.error('Error fetching customer:', err);
            throw err;
        }
    }

    static async getHighRiskCustomers() {
        try {
            const result = await pool.query(
                'SELECT * FROM customers WHERE risk_level = $1 ORDER BY risk_score DESC',
                ['HIGH']
            );
            return result.rows;
        } catch (err) {
            console.error('Error fetching high-risk customers:', err);
            throw err;
        }
    }

    static async updateRiskScore(id, riskScore, riskLevel, riskReasons) {
        try {
            const result = await pool.query(
                'UPDATE customers SET risk_score = $1, risk_level = $2, risk_reasons = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *',
                [riskScore, riskLevel, riskReasons, id]
            );
            return result.rows[0];
        } catch (err) {
            console.error('Error updating risk score:', err);
            throw err;
        }
    }

    static async recalculateAll() {
        try {
            const customers = await this.getAll();
            const updated = [];

            for (const customer of customers) {
                const { riskScore, riskLevel, reasons } = calculateRiskScore(customer);
                await this.updateRiskScore(customer.id, riskScore, riskLevel, reasons);
                updated.push({
                    id: customer.id,
                    name: customer.name,
                    riskScore,
                    riskLevel,
                });
            }

            return updated;
        } catch (err) {
            console.error('Error recalculating all risks:', err);
            throw err;
        }
    }

    static async getChurnStats() {
        try {
            const result = await pool.query(`
                SELECT 
                    COUNT(*) as total_customers,
                    SUM(CASE WHEN risk_level = 'HIGH' THEN 1 ELSE 0 END) as high_risk_count,
                    SUM(CASE WHEN risk_level = 'MEDIUM' THEN 1 ELSE 0 END) as medium_risk_count,
                    SUM(CASE WHEN risk_level = 'LOW' THEN 1 ELSE 0 END) as low_risk_count,
                    AVG(risk_score) as avg_risk_score
                FROM customers
            `);
            return result.rows[0];
        } catch (err) {
            console.error('Error fetching churn stats:', err);
            throw err;
        }
    }

    static async getTopChurnReasons() {
        try {
            const result = await pool.query(`
                SELECT 
                    unnest(risk_reasons) as reason,
                    COUNT(*) as frequency
                FROM customers
                WHERE risk_reasons IS NOT NULL AND array_length(risk_reasons, 1) > 0
                GROUP BY unnest(risk_reasons)
                ORDER BY frequency DESC
                LIMIT 10
            `);
            return result.rows;
        } catch (err) {
            console.error('Error fetching top reasons:', err);
            throw err;
        }
    }
}

module.exports = Customer;
