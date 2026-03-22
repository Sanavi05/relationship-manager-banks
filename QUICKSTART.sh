#!/bin/bash
# Quick Start Guide for AI Relationship Manager

echo "╔════════════════════════════════════════════════════════╗"
echo "║         AI Relationship Manager - Quick Start          ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

# Step 1: Check Node.js
echo "✓ Checking Node.js..."
if command -v node &> /dev/null; then
    echo "  Node.js version: $(node --version)"
else
    echo "  ✗ Node.js not found. Please install: https://nodejs.org/"
    exit 1
fi

# Step 2: Check PostgreSQL
echo "✓ Checking PostgreSQL..."
if command -v psql &> /dev/null; then
    echo "  PostgreSQL is installed"
else
    echo "  ✗ PostgreSQL not found. Please install: https://www.postgresql.org/download/"
    exit 1
fi

# Step 3: Install dependencies
echo ""
echo "✓ Installing dependencies..."
npm install

# Step 4: Setup environment
echo ""
echo "✓ Setting up environment..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "  .env file created (update if needed)"
fi

# Step 5: Setup database
echo ""
echo "✓ Setting up database..."
node scripts/setup-db.js

# Step 6: Success
echo ""
echo "╔════════════════════════════════════════════════════════╗"
echo "║         ✅ Setup Complete!                            ║"
echo "║                                                        ║"
echo "║  To start the server, run:                            ║"
echo "║     npm start                                          ║"
echo "║                                                        ║"
echo "║  Then open: http://localhost:3000                     ║"
echo "╚════════════════════════════════════════════════════════╝"
