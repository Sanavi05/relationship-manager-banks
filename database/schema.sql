-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    account_balance DECIMAL(15, 2) DEFAULT 0,
    last_transaction_date DATE,
    login_frequency INT DEFAULT 0, -- logins per week
    complaint_count INT DEFAULT 0,
    avg_monthly_balance DECIMAL(15, 2) DEFAULT 0,
    salary_detected BOOLEAN DEFAULT false,
    risk_score INT DEFAULT 0,
    risk_level VARCHAR(20) DEFAULT 'LOW',
    risk_reasons TEXT[] DEFAULT ARRAY[]::TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create interactions table
CREATE TABLE IF NOT EXISTS interactions (
    id SERIAL PRIMARY KEY,
    customer_id INT NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    outreach_message TEXT,
    recommended_action VARCHAR(50),
    status VARCHAR(20) DEFAULT 'pending', -- pending, responded, ignored
    outcome VARCHAR(20), -- retained, churned, pending
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_customers_risk_level ON customers(risk_level);
CREATE INDEX idx_customers_risk_score ON customers(risk_score);
CREATE INDEX idx_interactions_customer_id ON interactions(customer_id);
CREATE INDEX idx_interactions_status ON interactions(status);
