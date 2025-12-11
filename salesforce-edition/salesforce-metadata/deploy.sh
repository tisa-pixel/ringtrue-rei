#!/bin/bash

# Deploy RingTrue SF Edition Custom Fields
# This script deploys all 18 phone validation custom fields to Salesforce

echo "🚀 RingTrue - SF Edition Field Deployment"
echo "========================================="
echo ""

# Check if Salesforce CLI is installed
if ! command -v sf &> /dev/null; then
    echo "❌ Salesforce CLI not found. Please install it first:"
    echo "   Mac: brew install sf"
    echo "   Windows: https://developer.salesforce.com/tools/salesforcecli"
    exit 1
fi

echo "✅ Salesforce CLI found"
echo ""

# Check if already authenticated
if sf org list --json | grep -q "ringtrue-org"; then
    echo "✅ Already authenticated to ringtrue-org"
else
    echo "🔐 Authenticating to Salesforce..."
    echo "   A browser window will open. Please log in."
    sf org login web --alias ringtrue-org

    if [ $? -ne 0 ]; then
        echo "❌ Authentication failed"
        exit 1
    fi
    echo "✅ Authentication successful"
fi

echo ""
echo "📦 Deploying 18 custom fields to Lead object..."
echo ""

# Deploy the metadata
sf project deploy start --source-dir . --target-org ringtrue-org

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 Deployment successful!"
    echo ""
    echo "Next steps:"
    echo "1. Log into Salesforce and verify fields"
    echo "2. Add fields to Lead page layouts"
    echo "3. Continue to Zapier setup"
    echo ""
    echo "📖 See DEPLOY.md for more details"
else
    echo ""
    echo "❌ Deployment failed. Check errors above."
    echo "📖 See DEPLOY.md for troubleshooting"
    exit 1
fi
