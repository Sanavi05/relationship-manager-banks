/**
 * Database Setup Script
 * Creates PostgreSQL database and tables
 */

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const adminPool = new Pool({
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: 'postgres', // Connect to default postgres database
});

const dbName = process.env.DB_NAME || 'relationship_manager';

async function setupDatabase() {
    console.log('[SETUP] Setting up database...');

    try {
        // Create database if it doesn't exist
        console.log(`[DB] Creating database: ${dbName}`);
        const checkDbQuery = `SELECT 1 FROM pg_database WHERE datname = $1`;
        const result = await adminPool.query(checkDbQuery, [dbName]);

        if (result.rows.length === 0) {
            await adminPool.query(`CREATE DATABASE ${dbName}`);
            console.log(`[OK] Database created: ${dbName}`);
        } else {
            console.log(`[INFO] Database already exists: ${dbName}`);
        }

        // Connect to the new database
        const dbPool = new Pool({
            user: process.env.DB_USER || 'postgres',
            password: process.env.DB_PASSWORD || 'postgres',
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || 5432,
            database: dbName,
        });

        // Read and execute schema
        const schemaPath = path.join(__dirname, '../database/schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');

        console.log('[SCHEMA] Creating tables...');
        await dbPool.query(schemaSql);
        console.log('[OK] Tables created successfully');

        // Read and execute seed data
        const seedPath = path.join(__dirname, '../database/seed.sql');
        const seedSql = fs.readFileSync(seedPath, 'utf8');

        console.log('[SEED] Seeding data...');
        await dbPool.query(seedSql);
        console.log('[OK] Data seeded successfully');

        // Calculate risk scores for all customers
        console.log('[RISK] Calculating risk scores...');
        const updateRiskQuery = `
            UPDATE customers
            SET 
                risk_score = CASE
                    WHEN (CURRENT_DATE - last_transaction_date > 10) THEN 20 ELSE 0
                END +
                CASE WHEN login_frequency < 3 THEN 15 ELSE 0 END +
                CASE WHEN complaint_count > 2 THEN 25 ELSE 0 END +
                CASE WHEN account_balance < (avg_monthly_balance * 0.5) THEN 20 ELSE 0 END +
                CASE WHEN salary_detected = false THEN 20 ELSE 0 END +
                CASE WHEN account_balance < 5000 THEN 15 ELSE 0 END,
                risk_level = CASE
                    WHEN (
                        CASE WHEN (CURRENT_DATE - last_transaction_date > 10) THEN 20 ELSE 0 END +
                        CASE WHEN login_frequency < 3 THEN 15 ELSE 0 END +
                        CASE WHEN complaint_count > 2 THEN 25 ELSE 0 END +
                        CASE WHEN account_balance < (avg_monthly_balance * 0.5) THEN 20 ELSE 0 END +
                        CASE WHEN salary_detected = false THEN 20 ELSE 0 END +
                        CASE WHEN account_balance < 5000 THEN 15 ELSE 0 END
                    ) >= 70 THEN 'HIGH'
                    WHEN (
                        CASE WHEN (CURRENT_DATE - last_transaction_date > 10) THEN 20 ELSE 0 END +
                        CASE WHEN login_frequency < 3 THEN 15 ELSE 0 END +
                        CASE WHEN complaint_count > 2 THEN 25 ELSE 0 END +
                        CASE WHEN account_balance < (avg_monthly_balance * 0.5) THEN 20 ELSE 0 END +
                        CASE WHEN salary_detected = false THEN 20 ELSE 0 END +
                        CASE WHEN account_balance < 5000 THEN 15 ELSE 0 END
                    ) >= 30 THEN 'MEDIUM'
                    ELSE 'LOW'
                END
        `;

        await dbPool.query(updateRiskQuery);
        console.log('[OK] Risk scores calculated');

        await dbPool.end();
        await adminPool.end();

        console.log(`
╔════════════════════════════════════════════════════════╗
║         [SUCCESS] Database Setup Complete!             ║
║                                                        ║
║  Database: ${dbName.padEnd(42)} ║
║  Tables: customers, interactions                      ║
║  Sample Data: 25 customers seeded                     ║
║  Risk Scores: Pre-calculated for all customers       ║
╚════════════════════════════════════════════════════════╝

NEXT STEPS:
===========
1. Start server:
   npm start

2. In a NEW terminal, populate risk reasons:
   curl -X POST http://localhost:3000/api/calculate-risk

3. Open browser:
   http://localhost:3000

Your AI Relationship Manager is ready!
        `);
    } catch (error) {
        console.error('[ERROR] Error setting up database:', error);
        process.exit(1);
    }
}

setupDatabase();
