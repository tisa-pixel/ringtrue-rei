# RingTrue - App Edition 📞

**Know before you call!** A comprehensive phone number validation app that checks legal compliance, fraud risk, and lead quality before you dial.

## Features

### 🚨 Legal Compliance Protection
- ✅ Do Not Call Registry check - Avoid $500-$1,500 fines
- ✅ TCPA Blacklist verification
- ✅ Legal risk warnings

### 📊 Lead Quality Assessment
- ✅ Fraud score (0-100%)
- ✅ Known spammer detection
- ✅ Prepaid line identification
- ✅ Data breach detection
- ✅ Recent abuse reports

### 📱 Phone Number Intelligence
- ✅ Line type (Mobile, Landline, VoIP)
- ✅ Active/Inactive status
- ✅ Carrier information
- ✅ Reassigned number detection
- ✅ Owner/caller name lookup

### 👤 Identity & Location
- ✅ Owner/company name
- ✅ Geographic location (city, state, zip)
- ✅ Timezone for optimal calling times
- ✅ Phone number formatting

## Technology Stack

**APIs Used:**
- **Twilio Lookup API v2** - Line type, carrier, caller name, reassigned numbers
- **IPQualityScore (IPQS)** - Fraud detection, legal compliance, line status (FREE tier!)

**Hosting:**
- Netlify serverless functions
- GitHub version control

## Cost

For **500 lookups per month**: **$9/month**
- Twilio: $0.018 per lookup × 500 = $9
- IPQS: FREE (1,000 lookups included)

## Deploy to Netlify

### Quick Deploy (5 minutes)
```bash
# Clone the repository
git clone https://github.com/tisa-pixel/ringtrue-app-edition.git
cd ringtrue-app-edition

# Install Netlify CLI
npm install -g netlify-cli

# Login and deploy
netlify login
netlify deploy --prod
```

### Environment Variables Required
Set these in Netlify:
- `TWILIO_ACCOUNT_SID` - Your Twilio Account SID
- `TWILIO_AUTH_TOKEN` - Your Twilio Auth Token
- `IPQS_API_KEY` - Your IPQualityScore API key

## How to Use

1. **Open the app** at your Netlify URL
2. **Enter any phone number** in these formats:
   - `555-555-5555`
   - `(555) 555-5555`
   - `5555555555`
   - Any format with 10+ digits!
3. **Get instant results** with color-coded recommendations:
   - 🟢 **Green** = Good to contact
   - 🟡 **Yellow** = Proceed with caution
   - 🔴 **Red** = Do NOT contact

## Decision Tree

The app uses a 12-level priority system:

1. 🚨 **Legal Risk** - Do Not Call/TCPA blacklist
2. ❌ **Invalid/Inactive** - Number doesn't exist or is disconnected
3. ❌ **Known Spammer** - Associated with spam/scam operations
4. ❌ **High Fraud Risk** - Fraud score 85%+
5. ⚠️ **Recently Reassigned** - May reach wrong person
6. ⚠️ **Data Breach** - Found in breach databases
7. ⚠️ **Recent Abuse** - Recent spam/fraud reports
8. ⚠️ **Moderate Fraud Risk** - Fraud score 50-84%
9. ⚠️ **Prepaid** - Lower quality lead indicator
10. ⚠️ **VoIP** - Virtual/temporary number
11. ⚠️ **Landline** - Cannot receive SMS
12. ⚠️ **Suspended** - Temporarily inactive

## Files Structure
```
ringtrue-app-edition/
├── index.html                          # Main web interface
├── netlify.toml                        # Netlify configuration
├── netlify/
│   └── functions/
│       └── lookup.js                   # Serverless function for API calls
└── README.md                           # This file
```

## Security
- ✅ API credentials stored as environment variables
- ✅ Serverless functions keep credentials secure
- ✅ No sensitive data exposed in browser
- ✅ HTTPS encryption on all requests

## Next Steps for Salesforce Integration

Ready to integrate with Salesforce? Options include:

1. **Apex Trigger** - Automatically validate on lead creation
2. **Salesforce Flow** - Low-code external service integration
3. **Lightning Web Component** - Real-time UI validation
4. **Middleware** - Zapier, MuleSoft, or custom integration

### Custom Fields to Add in Salesforce:
- `Phone_Valid__c` (Checkbox)
- `Phone_Line_Status__c` (Picklist: Active/Inactive)
- `Phone_Line_Type__c` (Picklist: Mobile/Landline/VoIP)
- `Phone_Fraud_Score__c` (Number)
- `Phone_DNC_Status__c` (Checkbox) ⚠️
- `Phone_Legal_Risk__c` (Checkbox) ⚠️
- `Phone_Carrier__c` (Text)
- `Phone_Location__c` (Text)
- `Phone_Timezone__c` (Text)

## Support & Resources

- **Twilio Lookup API**: [docs](https://www.twilio.com/docs/lookup/v2-api)
- **IPQualityScore**: [docs](https://www.ipqualityscore.com/documentation/phone-number-validation-api)
- **Netlify Functions**: [docs](https://docs.netlify.com/functions/overview/)

## License

Created for lead validation and legal compliance checking.

---

**Remember:** Always check Do Not Call status before contacting leads! 📞
