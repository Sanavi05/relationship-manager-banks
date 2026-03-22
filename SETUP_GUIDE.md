# Quick Setup Guide - AI Relationship Manager

For anyone cloning this repository, follow these steps:

## Prerequisites

- Node.js v14+ - https://nodejs.org
- PostgreSQL v11+ - https://www.postgresql.org/download
- npm (comes with Node.js)

## Setup Steps (5 minutes)

### 1. Install Dependencies

```bash
cd relationship-manager-banks
npm install
```

### 2. Create Environment File

```bash
cp .env.example .env
```

(Default values work fine, only modify if your PostgreSQL uses different credentials)

### 3. Start PostgreSQL

**Windows:**

```bash
pg_ctl -D "C:\Program Files\PostgreSQL\14\data" start
```

**macOS:**

```bash
brew services start postgresql
```

**Linux:**

```bash
sudo service postgresql start
```

### 4. Setup Database

```bash
node scripts/setup-db.js
```

Expected: [SUCCESS] Database Setup Complete!

### 5. Start Server

```bash
npm start
```

### 6. In NEW Terminal - Populate Risk Reasons

```bash
curl -X POST http://localhost:3000/api/calculate-risk
```

### 7. Open Browser

```
http://localhost:3000
```

## You're Done!

The dashboard should show:

- 25 Indian customers with rupee balances
- Risk analysis and churn prediction
- AI-powered outreach messages
- Interactive customer management

## Troubleshooting

**PostgreSQL not running?**

- Windows: Check Services or use pg_ctl start
- Mac: `brew services start postgresql`

**Database error?**

- Run: `psql -U postgres -c "SELECT version();"`
- If it fails, PostgreSQL isn't running

**Still seeing "No data available"?**

- Make sure you ran: `curl -X POST http://localhost:3000/api/calculate-risk`
- Refresh browser after

## Full Documentation

See README.md for complete details, API documentation, and advanced features.
