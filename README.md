# 🏦 AI Relationship Manager for Banks

> A complete, working prototype for predicting customer churn, explaining why, recommending actions, and generating AI-powered outreach messages.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Usage Guide](#usage-guide)

---

## 🎯 Overview

**AI Relationship Manager** is a full-stack banking solution that:

1. **Predicts** customer churn risk using behavior and financial indicators
2. **Explains** why customers are at risk with human-readable reasons
3. **Recommends** next-best actions (Call + Offer, Email + Incentive, Monitor)
4. **Generates** personalized AI-powered outreach messages
5. **Tracks** interaction outcomes for continuous improvement

### Key Capabilities

✨ **Risk Scoring Engine** - Dynamic scoring based on:

- Transaction frequency
- Login activity
- Complaint history
- Account balance trends
- Salary detection

🤖 **AI Outreach Generator** - Uses OpenAI API (with mock fallback) to generate personalized banking messages

📊 **Interactive Dashboard** - Real-time customer view with filtering and insights

🔄 **Feedback Loop** - Record interaction outcomes (retained/churned)

---

## 🚀 Features

### Backend

- **RESTful API** with Express.js
- **PostgreSQL** database with real customer data (25 seed customers)
- **Rule-based risk scoring** engine
- **AI message generation** (OpenAI API or mock responses)
- **Interaction tracking** and feedback recording
- **CORS enabled** for frontend-backend communication

### Frontend

- **Clean, modern dashboard UI** (no frameworks, pure CSS + vanilla JS)
- **Customer listing** with sorting and filtering
- **Detailed customer profiles** with risk analysis
- **Risk reasons** displayed as readable bullet points
- **Recommended actions** with priority and details
- **One-click AI message generation**
- **Interaction feedback** recording
- **Real-time statistics** and top churn reasons

### Database

- **Two main tables**: `customers` and `interactions`
- **Pre-calculated risk scores** for all customers
- **Normalized and indexed** for performance
- **25 realistic seed customers** representing different risk profiles

---

## 🛠 Tech Stack

| Component          | Technology                      |
| ------------------ | ------------------------------- |
| **Backend**        | Node.js + Express.js            |
| **Frontend**       | HTML5, CSS3, Vanilla JavaScript |
| **Database**       | PostgreSQL                      |
| **AI/ML**          | OpenAI API (GPT-3.5-turbo)      |
| **Authentication** | None (demo system)              |
| **Deployment**     | Local development               |

---

## 📁 Project Structure

```
relationship-manager-banks/
├── backend/
│   ├── config/
│   │   ├── database.js          # PostgreSQL connection pool
│   │   └── openai.js            # OpenAI configuration & mock responses
│   ├── models/
│   │   ├── Customer.js          # Customer database queries
│   │   └── Interaction.js       # Interaction database queries
│   ├── services/
│   │   ├── riskScoringService.js   # Risk calculation engine
│   │   └── outreachService.js      # Outreach & action recommendation
│   ├── controllers/
│   │   └── customerController.js   # API request handlers
│   ├── routes/
│   │   └── api.js               # API route definitions
│   └── server.js                # Main server file
├── frontend/
│   ├── index.html               # Main UI
│   ├── styles.css               # Modern, responsive CSS
│   └── app.js                   # Frontend logic & API calls
├── database/
│   ├── schema.sql               # Table definitions
│   └── seed.sql                 # 25 sample customers
├── scripts/
│   └── setup-db.js              # Database initialization
├── package.json                 # Dependencies
├── .env.example                 # Environment template
└── README.md                    # This file
```

---

## 📦 Prerequisites

Ensure you have the following installed:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **PostgreSQL** (v11 or higher) - [Download](https://www.postgresql.org/download/)
- **Git** (optional, for cloning)

### Verify Installation

```bash
node --version   # Should be v14+
npm --version    # Should be v6+
psql --version   # Should be v11+
```

---

## 💾 Installation

### Step 1: Clone or Navigate to Project

```bash
# If cloning from git
git clone <repository-url>
cd relationship-manager-banks

# Or navigate to your existing directory
cd c:\Users\kulka\OneDrive\Desktop\relationship-manager-banks
```

### Step 2: Install Dependencies

```bash
npm install
```

This installs:

- express (web framework)
- pg (PostgreSQL driver)
- cors (cross-origin requests)
- dotenv (environment variables)
- openai (OpenAI API client)

### Step 3: Configure Environment

```bash
# Copy .env.example to .env
cp .env.example .env
```

Edit `.env` with your PostgreSQL credentials:

```env
# Server
PORT=3000
NODE_ENV=development

# Database (adjust if your PostgreSQL uses different credentials)
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=relationship_manager

# OpenAI (Optional - leave commented for mock responses)
# OPENAI_API_KEY=sk-your-key-here
```

---

## 🗄️ Database Setup

PostgreSQL must be running on your system.

### Start PostgreSQL

**Windows:**

```bash
# PostgreSQL should run as a service automatically
# If not, you can start it via Services or:
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

### Create Database

Run the setup script:

```bash
node scripts/setup-db.js
```

This will:

1. Create the `relationship_manager` database
2. Create `customers` and `interactions` tables
3. Seed 25 realistic customers
4. Calculate risk scores for all customers

**Expected Output:**

```
🔧 Setting up database...
📦 Creating database: relationship_manager
✅ Database created: relationship_manager
📋 Creating tables...
✅ Tables created successfully
🌱 Seeding data...
✅ Data seeded successfully
📊 Calculating risk scores...
✅ Risk scores calculated
```

### Verify Database

```bash
psql -U postgres -d relationship_manager

# In psql:
SELECT COUNT(*) FROM customers;
# Should show: 25

SELECT * FROM customers LIMIT 1;
# Should show customer data
```

---

## ▶️ Running the Application

### Start the Server

```bash
npm start
```

Or for development with auto-reload:

```bash
npm run dev
```

**Expected Output:**

```
╔════════════════════════════════════════════════════════╗
║    AI Relationship Manager for Banks                   ║
║    Server running on http://localhost:3000             ║
║    Press Ctrl+C to stop                                ║
╚════════════════════════════════════════════════════════╝
```

### Populate Risk Reasons

In a **NEW terminal**, run this command to populate risk analysis data:

```bash
curl -X POST http://localhost:3000/api/calculate-risk
```

This will:

- Calculate risk reasons for all customers
- Populate the "Top Churn Reasons Analysis" section
- Full data becomes available for the dashboard

**Expected:** Returns list of updated customers with calculated risks

### Open in Browser

Navigate to: **http://localhost:3000**

You should see the AI Relationship Manager dashboard with:

- 25 Indian customers with Rupee balances
- Risk scores and levels for each customer
- Top churn reasons analysis
- Interactive customer profiles

---

## 📡 API Documentation

### Base URL

```
http://localhost:3000/api
```

### Endpoints

#### 1. **Get All Customers**

```http
GET /customers
```

Response:

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "John Mitchell",
      "email": "john.mitchell@email.com",
      "account_balance": 45000.5,
      "risk_score": 15,
      "risk_level": "LOW",
      "risk_reasons": ["Low transaction activity"]
    }
  ]
}
```

#### 2. **Get Customer Detail**

```http
GET /customers/:id
```

Example: `GET /customers/3`

Response includes customer details and interaction history.

#### 3. **Calculate Risk Scores**

```http
POST /calculate-risk
```

Recalculates risk scores for all customers. Useful after testing feedback.

#### 4. **Get Recommended Action**

```http
GET /recommend-action/:id
```

Example: `GET /recommend-action/3`

Response:

```json
{
  "success": true,
  "data": {
    "customerId": 3,
    "riskLevel": "HIGH",
    "action": "Call + Special Offer",
    "priority": "URGENT",
    "channel": "Phone",
    "incentive": "0.5% interest rate boost for 6 months"
  }
}
```

#### 5. **Generate AI Outreach**

```http
POST /generate-outreach/:id
```

Example: `POST /generate-outreach/3`

Response:

```json
{
  "success": true,
  "data": {
    "interactionId": 42,
    "customerId": 3,
    "message": "Dear Michael,\n\nWe've noticed you're a valued member...",
    "action": "Call + Special Offer",
    "timestamp": "2026-03-22T10:30:00Z"
  }
}
```

#### 6. **Submit Feedback**

```http
POST /feedback/:id
```

Example: `POST /feedback/42`

Body:

```json
{
  "status": "responded",
  "outcome": "retained"
}
```

#### 7. **Dashboard Statistics**

```http
GET /dashboard/stats
```

Response:

```json
{
  "success": true,
  "data": {
    "stats": {
      "total_customers": 25,
      "high_risk_count": 8,
      "medium_risk_count": 9,
      "low_risk_count": 8,
      "avg_risk_score": 42
    },
    "topReasons": [
      { "reason": "Low login activity", "frequency": 12 },
      { "reason": "No transactions in 10+ days", "frequency": 8 }
    ]
  }
}
```

---

## 🎮 Usage Guide

### 1. **View Dashboard**

- Open http://localhost:3000
- See all customers with risk levels (color-coded)
- View top churn reasons chart

### 2. **Filter Customers**

- Use "All", "High Risk", "Medium Risk", "Low Risk" buttons
- Search by name or email

### 3. **View Customer Details**

- Click "View Details" on any customer row
- See:
  - Full customer profile
  - Risk score and level
  - Reasons for risk (readable list)
  - Recommended action with incentive
  - Last transaction and login activity

### 4. **Generate AI Outreach Message**

- Click "Generate Message" button
- System creates personalized message using OpenAI API (or mock responses)
- Message appears with professional banking tone

### 5. **Record Interaction Outcome**

- After generating message, mark outcome:
  - ✅ **Marked Responded - Retained** (customer engaged)
  - ❌ **Marked Ignored - Churned** (customer left)
- System records feedback and updates dashboard

---

## 🎨 UI Features

### Dashboard Colors

- 🟢 **Green** - Low Risk (Risk Score 0-30)
- 🟡 **Yellow** - Medium Risk (Risk Score 30-70)
- 🔴 **Red** - High Risk (Risk Score 70-100)

### Dashboard Stats

- **Total Customers** - All active customers
- **High-Risk Count** - Alert metric
- **Medium-Risk Count** - Attention metric
- **Avg Risk Score** - Overall health

### Top Churn Reasons

- Visual cards showing most common churn factors across all customers
- Frequency count per reason

---

## 📊 Sample Data

The system seeds 25 realistic customers with:

- Varying risk profiles (HIGH, MEDIUM, LOW)
- Realistic account balances ($1.5K - $215K)
- Different transaction patterns
- Mix of salary-detected and freelance profiles
- Complaint history (0-6 complaints)
- Login frequencies (0-10 per week)

---

## 🔧 Troubleshooting

### Error: `connect ECONNREFUSED 127.0.0.1:5432`

**Issue:** PostgreSQL is not running

**Solution:**

```bash
# Start PostgreSQL
# Windows: Use Services app or:
pg_ctl -D "C:\Program Files\PostgreSQL\14\data" start

# macOS:
brew services start postgresql

# Linux:
sudo service postgresql start
```

### Error: `database "relationship_manager" does not exist`

**Issue:** Database was not created

**Solution:**

```bash
node scripts/setup-db.js
```

### Frontend not loading

**Issue:** Backend not serving static files correctly

**Solution:**

```bash
# Ensure you're in project root
npm start
# Visit http://localhost:3000
```

### OpenAI API errors

**Issue:** Invalid or missing API key

**Solution:**

- Leave `OPENAI_API_KEY` commented in `.env` to use mock responses
- Or add valid key: `OPENAI_API_KEY=sk-your-key-here`

---

## 🎯 Risk Scoring Rules

The system uses these rules to calculate risk (0-100):

| Rule                     | Points | Condition                        |
| ------------------------ | ------ | -------------------------------- |
| Low Transaction Activity | +20    | No transactions in 10+ days      |
| Low Login Frequency      | +15    | Less than 3 logins per week      |
| Complaint History        | +25    | More than 2 complaints           |
| Balance Drop             | +20    | Balance < 50% of average monthly |
| No Salary Detection      | +20    | No regular deposits detected     |
| Low Balance              | +15    | Balance < $5,000                 |

**Risk Levels:**

- 🟢 **LOW:** 0-30 points → Monitor
- 🟡 **MEDIUM:** 30-70 points → Email + Incentive
- 🔴 **HIGH:** 70-100 points → Call + Special Offer

---
