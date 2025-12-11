# Zapier Integration Setup Guide

**Complete this in ~15 minutes** | Automatically enrich Salesforce leads with phone validation data

---

## Prerequisites

✅ Active Zapier account (Free tier works, but Premium recommended for higher volume)
✅ Salesforce account with API access
✅ Custom fields created in Salesforce ([see field setup guide](salesforce-fields-setup.md))
✅ Dial or No Dial API endpoint: `https://phone-lookup-tester.netlify.app/.netlify/functions/lookup`

---

## Overview

This integration adds a phone validation step to your existing lead flow:

```
Website Form → Zapier → [NEW: Phone Validation] → Salesforce Lead
```

**What happens**:
1. New lead comes in from your website form (trigger)
2. Zapier calls Dial or No Dial API with the phone number
3. API returns validation data (fraud score, legal status, carrier, etc.)
4. Zapier maps the data to Salesforce custom fields
5. Lead is created in Salesforce with all enriched data

**Cost**: $0.10/lookup (Dial or No Dial) + Zapier task cost

---

## Step-by-Step Setup

### Step 1: Create New Zap

1. Log into Zapier: https://zapier.com/app/zaps
2. Click **"Create Zap"**
3. Name it: **"Enrich SF Leads with Phone Validation"**

---

### Step 2: Set Up Your Trigger

**This depends on your existing lead source. Common examples:**

**Option A: Website Form (Typeform, Webflow, etc.)**
1. Choose your form app as the trigger
2. Select "New Form Submission" or similar event
3. Connect your account
4. Test to pull in sample data

**Option B: Email (Gmail, Outlook, etc.)**
1. Choose your email app as the trigger
2. Select "New Email" with specific label/folder
3. Connect your account
4. Test to pull in sample data

**Option C: Webhook**
1. Choose "Webhooks by Zapier"
2. Select "Catch Hook"
3. Copy the webhook URL to use in your form
4. Send a test submission

---

### Step 3: Add Phone Validation Step

1. Click **"+"** to add a new step
2. Search for and select **"Webhooks by Zapier"**
3. Choose **"GET"** as the action event
4. Click **Continue**

**Configure the Webhook:**

| Field | Value |
|-------|-------|
| **URL** | `https://phone-lookup-tester.netlify.app/.netlify/functions/lookup` |
| **Query String Params** | Key: `phoneNumber`<br>Value: *(select phone field from previous step)* |
| **Headers** | Leave empty |

**Example URL with query string:**
```
https://phone-lookup-tester.netlify.app/.netlify/functions/lookup?phoneNumber=7277773204
```

5. Click **Test & Continue**
6. Zapier will make a test call and show you the response

**Expected Response Preview:**
```json
{
  "phoneNumber": "+17277773204",
  "valid": true,
  "nationalFormat": "(727) 777-3204",
  "countryCode": "US",
  "lineType": "mobile",
  "carrier": "T-Mobile USA",
  "callerName": "John Smith",
  "isReassigned": false,
  "line_status": {
    "status": "active",
    "ipqs_active": true,
    "ipqs_valid": true,
    "ipqs_fraud_score": 12,
    "ipqs_recent_abuse": false,
    "ipqs_VOIP": false,
    "ipqs_risky": false
  },
  "ipqs_data": {
    "valid": true,
    "active": true,
    "fraud_score": 12,
    "recent_abuse": false,
    "VOIP": false,
    "risky": false,
    "leaked": false,
    "spammer": false,
    "prepaid": false,
    "do_not_call": false,
    "name": "John Smith",
    "city": "Tampa",
    "region": "FL",
    "zip_code": "33602",
    "timezone": "America/New_York"
  }
}
```

---

### Step 4: Add Decision Logic (Optional but Recommended)

Before creating the Salesforce lead, add a **Filter** step to handle bad numbers:

1. Click **"+"** to add a new step
2. Choose **"Filter by Zapier"**
3. Set up your filter rules:

**Example Filter: Only create lead if phone is safe to contact**

| Field | Condition | Value |
|-------|-----------|-------|
| `ipqs_data do_not_call` | (Boolean) Is false | |
| AND `line_status status` | (Text) Exactly matches | `active` |
| AND `valid` | (Boolean) Is true | |

**Alternative: Create all leads but flag risky ones**
- Skip the filter step
- Use the data to populate recommendation fields in Salesforce
- Let your sales team decide based on the enriched data

---

### Step 5: Create Salesforce Lead

1. Click **"+"** to add a new step
2. Search for and select **"Salesforce"**
3. Choose **"Create Record"** action
4. Select **"Lead"** as the record type
5. Connect your Salesforce account (if not already connected)

**Map the fields:**

#### Standard Salesforce Fields (from your form)

| Salesforce Field | Map From |
|-----------------|----------|
| Last Name | *(from your form trigger)* |
| Company | *(from your form trigger)* |
| Email | *(from your form trigger)* |
| Phone | `phoneNumber` *(from webhook response)* |
| Lead Source | Set to "Website" or your source |

#### Custom Phone Validation Fields (from API response)

| Salesforce Field | Map From Webhook Response |
|-----------------|---------------------------|
| **Phone Valid** | `valid` |
| **Phone Line Status** | `line_status status` |
| **Phone Line Type** | `lineType` |
| **Phone Carrier** | `carrier` |
| **Phone Fraud Score** | `ipqs_data fraud_score` |
| **Phone DNC Status** | `ipqs_data do_not_call` |
| **Phone TCPA Blacklist** | *(set based on `do_not_call`)* |
| **Phone Legal Risk** | *(set to TRUE if `do_not_call` is true)* |
| **Phone Spammer** | `ipqs_data spammer` |
| **Phone Prepaid** | `ipqs_data prepaid` |
| **Phone Data Breach** | `ipqs_data leaked` |
| **Phone Recent Abuse** | `ipqs_data recent_abuse` |
| **Phone Reassigned** | `isReassigned` |
| **Phone Owner Name** | `callerName` OR `ipqs_data name` |
| **Phone Location** | *(combine `ipqs_data city`, `region`, `zip_code`)* |
| **Phone Timezone** | `ipqs_data timezone` |
| **Phone Validation Date** | *(use Zapier's "now" timestamp)* |
| **Phone Recommendation** | *(calculate using Formatter - see below)* |

---

### Step 6: Calculate Phone Recommendation (Advanced)

Add a **Formatter** step before Salesforce to determine the recommendation:

1. Click **"+"** to add step between webhook and Salesforce
2. Choose **"Formatter by Zapier"**
3. Select **"Text"** → **"Default Value"** or use **"Code by Zapier"** for complex logic

**Simple Logic with Filters:**

Create multiple Zap paths using **"Paths by Zapier"**:

**Path A: Do Not Contact**
- Condition: `do_not_call` = true OR `fraud_score` > 84 OR `status` = "inactive"
- Set recommendation: "Do Not Contact - Legal/Fraud Risk"

**Path B: Proceed with Caution**
- Condition: `lineType` = "voip" OR `fraud_score` between 50-84 OR `prepaid` = true
- Set recommendation: "Proceed with Caution - Review Data"

**Path C: Good to Contact**
- All other cases
- Set recommendation: "Good to Contact"

**Advanced Logic with Code:**

Use **"Code by Zapier"** (Python or JavaScript):

```javascript
// Input: webhook response data
const data = inputData;

// Determine recommendation
let recommendation;
let priority = 0;

// Level 1-3: Do Not Contact (Legal)
if (data.ipqs_data.do_not_call === true) {
  recommendation = "Do Not Contact - On DNC Registry";
  priority = 1;
} else if (data.line_status.status === "inactive" || data.valid === false) {
  recommendation = "Do Not Contact - Invalid/Inactive";
  priority = 3;
} else if (data.ipqs_data.fraud_score >= 85) {
  recommendation = "Do Not Contact - High Fraud Risk";
  priority = 3;
} else if (data.ipqs_data.spammer === true) {
  recommendation = "Do Not Contact - Known Spammer";
  priority = 3;
}

// Level 4-6: Proceed with Caution
else if (data.lineType === "voip" || data.lineType === "landline") {
  recommendation = "Proceed with Caution - VoIP/Landline";
  priority = 4;
} else if (data.ipqs_data.prepaid === true) {
  recommendation = "Proceed with Caution - Prepaid";
  priority = 5;
} else if (data.ipqs_data.fraud_score >= 50 && data.ipqs_data.fraud_score < 85) {
  recommendation = "Proceed with Caution - Moderate Fraud Risk";
  priority = 6;
}

// Level 7-8: Good to Contact
else if (data.lineType === "mobile" && data.line_status.status === "active") {
  recommendation = "Good to Contact";
  priority = 8;
} else {
  recommendation = "Review Required";
  priority = 7;
}

output = {
  recommendation: recommendation,
  priority: priority
};
```

---

### Step 7: Test Your Zap

1. Click **"Test & Continue"** on the Salesforce step
2. Zapier will create a test lead in Salesforce
3. Check Salesforce to verify:
   - Lead was created
   - All custom fields are populated correctly
   - Recommendation field shows correct value

---

### Step 8: Turn On Your Zap

1. Review all steps
2. Click **"Publish"** or **"Turn on Zap"**
3. Your integration is now live!

---

## Handling Phone Number Formats

The Dial or No Dial API accepts various formats:
- `(555) 555-5555`
- `555-555-5555`
- `5555555555`
- `+15555555555`

**If your form collects phone in a specific format**, you may need to add a **Formatter** step before the webhook:

1. Add **"Formatter by Zapier"** step after trigger
2. Choose **"Numbers"** → **"Format Phone Number"**
3. Select the phone field from your form
4. Choose format: **"International (E.164)"** → `+15555555555`
5. Use this formatted number in the webhook call

---

## Troubleshooting

### Issue: "No phone number provided"
**Fix**: Make sure the query string parameter is named exactly `phoneNumber` (case-sensitive)

### Issue: "Invalid phone number format"
**Fix**: Add a Formatter step to convert to E.164 format (+1XXXXXXXXXX)

### Issue: Salesforce fields not showing up
**Fix**:
1. Verify custom fields are created in Salesforce
2. Check API field names match exactly (e.g., `Phone_Valid__c`)
3. Refresh the Salesforce connection in Zapier

### Issue: Some data fields are empty
**Fix**: Not all numbers will have all data fields (e.g., caller name). Use Zapier's "Default Value" formatter to set fallbacks.

### Issue: Zap times out
**Fix**: The API usually responds in 2-3 seconds. If timing out, check:
1. Netlify function is deployed and active
2. API credentials are set in Netlify environment variables
3. Try the API URL directly in a browser with `?phoneNumber=5555555555`

---

## Cost Breakdown

**Per lead enriched:**
- Dial or No Dial API: ~$0.018 (500 lookups = $9/month)
- Zapier task: $0.03 (Starter plan) to $0.01 (Professional plan)
- **Total: $0.028 - $0.048 per lead**

**Monthly estimates:**
| Leads/Month | Zapier Plan | Zapier Cost | API Cost | Total |
|-------------|-------------|-------------|----------|-------|
| 100 | Free (100 tasks) | $0 | $2 | $2 |
| 500 | Starter ($20) | $20 | $9 | $29 |
| 1,000 | Starter ($20) | $20 | $18 | $38 |
| 5,000 | Professional ($69) | $69 | $90 | $159 |

💡 **Tip**: At 500+ leads/month, consider migrating to Apex trigger for cost savings

---

## Next Steps

✅ Test with sample leads from your website
✅ Monitor Zap runs for errors
✅ Train sales team on new data fields
✅ Set up Salesforce reports/views filtering by recommendation
✅ Consider Apex integration at higher volumes

---

## Support

- **Dial or No Dial Issues**: https://github.com/tisa-pixel/dial-or-no-dial/issues
- **Zapier Help**: https://zapier.com/help
- **Salesforce API**: https://developer.salesforce.com

---

**🎉 You're done!** New leads from your website will now automatically be enriched with phone validation data in Salesforce.
