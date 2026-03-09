#!/bin/bash

# Health check script for Fitness Freak Gym Management System

echo "🔍 Checking system health..."

# Check if Flask server is running
echo "📡 Checking Flask API server..."
if curl -s http://localhost:5003/health > /dev/null 2>&1; then
    echo "✅ Flask API server is running"
    FLASK_HEALTH=$(curl -s http://localhost:5003/health)
    echo "   Health response: $FLASK_HEALTH"
else
    echo "❌ Flask API server is not responding"
    echo "   Make sure to run: cd flask && python app.py"
fi

# Check if Next.js dev server is running
echo ""
echo "🌐 Checking Next.js development server..."
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Next.js development server is running"
else
    echo "❌ Next.js development server is not responding"
    echo "   Make sure to run: npm run dev"
fi

# Check database connectivity
echo ""
echo "💾 Checking database connectivity..."
if curl -s http://localhost:5003/members > /dev/null 2>&1; then
    MEMBER_COUNT=$(curl -s http://localhost:5003/members | jq length 2>/dev/null || echo "unknown")
    echo "✅ Database connection successful"
    echo "   Current members: $MEMBER_COUNT"
else
    echo "❌ Database connection failed"
fi

echo ""
echo "📋 Environment check:"
echo "   Node.js version: $(node --version 2>/dev/null || echo 'Not found')"
echo "   Python version: $(python3 --version 2>/dev/null || echo 'Not found')"
echo "   Working directory: $(pwd)"

echo ""
echo "🎯 Quick start commands:"
echo "   Backend:  cd flask && python3 app.py"
echo "   Frontend: npm run dev"
echo "   Health check: ./check-health.sh"