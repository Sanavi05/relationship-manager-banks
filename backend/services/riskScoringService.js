/**
 * Risk Scoring Engine
 * Calculates customer churn risk based on behavioral and financial indicators
 */

const calculateRiskScore = (customer) => {
    let score = 0;
    const reasons = [];

    const today = new Date();
    const lastTransactionDate = new Date(customer.last_transaction_date);
    const daysSinceTransaction = Math.floor(
        (today - lastTransactionDate) / (1000 * 60 * 60 * 24)
    );

    // Rule 1: No transactions in 10+ days → +20
    if (daysSinceTransaction >= 10) {
        score += 20;
        reasons.push(`No transactions in ${daysSinceTransaction} days`);
    }

    // Rule 2: Login frequency < 3/week → +15
    if (customer.login_frequency < 3) {
        score += 15;
        reasons.push('Low login activity (less than 3 times per week)');
    }

    // Rule 3: Complaint count > 2 → +25
    if (customer.complaint_count > 2) {
        score += 25;
        reasons.push(`Multiple complaints (${customer.complaint_count} complaints)`);
    }

    // Rule 4: Balance significantly dropped (simulate by checking if below avg monthly) → +20
    if (customer.account_balance < customer.avg_monthly_balance * 0.5) {
        score += 20;
        reasons.push('Significant account balance drop');
    }

    // Rule 5: No salary detected → +20
    if (!customer.salary_detected) {
        score += 20;
        reasons.push('No regular salary deposits detected');
    }

    // Rule 6: Very low account balance → +15
    if (customer.account_balance < 5000) {
        score += 15;
        reasons.push('Low account balance');
    }

    // Cap score at 100
    score = Math.min(score, 100);

    // Determine risk level
    let riskLevel = 'LOW';
    if (score >= 70) {
        riskLevel = 'HIGH';
    } else if (score >= 30) {
        riskLevel = 'MEDIUM';
    }

    return {
        riskScore: score,
        riskLevel,
        reasons: reasons.length > 0 ? reasons : ['Customer appears to be in good standing'],
    };
};

module.exports = {
    calculateRiskScore,
};
