# RingTrue - Salesforce Edition 📞

**Automatically enrich Salesforce leads with phone validation, legal compliance checks, and fraud detection from Dial or No Dial.**

## Overview

RingTrue - SF Edition integrates your "Dial or No Dial" phone validation app directly into Salesforce, automatically enriching every lead with:

- 🚨 **Legal Compliance** - Do Not Call Registry + TCPA Blacklist
- 📊 **Fraud Detection** - 0-100% fraud score
- 📱 **Phone Intelligence** - Active/Inactive status, Line type, Carrier
- 👤 **Identity Verification** - Owner name, Location, Timezone
- ⚠️ **Lead Quality Indicators** - Spammer status, Prepaid detection, Data breach flags

## Architecture Options

### Option 1: Zapier Integration (⭐ Recommended for Quick Setup)

**Best for**: Teams already using Zapier, quick implementation

**Flow**:
```
Website Form → Zapier → Call Dial or No Dial API → Enrich Data → Salesforce Lead
```

**Pros**:
- ✅ No Salesforce code changes
- ✅ 10-minute setup
- ✅ Visual workflow
- ✅ Easy to modify

**Cons**:
- ❌ Costs per task (Zapier pricing)
- ❌ Adds latency to lead creation

---

### Option 2: Salesforce Apex Trigger (⭐ Recommended for Scale)

**Best for**: High volume, real-time enrichment, cost efficiency

**Flow**:
```
Lead Created/Updated → Apex Trigger → Call Dial or No Dial API → Update Lead Fields
```

**Pros**:
- ✅ Real-time, automatic
- ✅ No per-transaction cost
- ✅ Most scalable
- ✅ Runs on every lead (web, API, manual)

**Cons**:
- ❌ Requires Apex deployment
- ❌ Need to manage API callouts

---

## Files in This Project

```
ringtrue-sf-edition/
├── README.md                                    # This file
├── docs/
│   ├── zapier-setup.md                         # Step-by-step Zapier integration
│   ├── apex-setup.md                           # Apex trigger deployment guide
│   └── salesforce-fields-setup.md              # Custom field creation guide
├── apex/
│   ├── PhoneValidationTrigger.trigger          # Main Apex trigger
│   ├── PhoneValidationHandler.cls              # Trigger handler logic
│   └── PhoneValidationCallout.cls              # API callout logic
└── zapier/
    └── webhook-payload-example.json            # Sample API response for Zapier
```

---

## Quick Start - Choose Your Path

### Path A: Zapier Integration (Fastest)

**Time**: 15 minutes | **Difficulty**: Easy | **Best for**: Quick setup

1. Create custom fields in Salesforce (10 min)
2. Set up Zapier webhook (5 min)
3. Test with sample lead

👉 **[Start Zapier Setup →](docs/zapier-setup.md)**

---

### Path B: Apex Trigger (Most Powerful)

**Time**: 45 minutes | **Difficulty**: Medium | **Best for**: Scale & automation

1. Create custom fields in Salesforce (10 min)
2. Deploy Apex code (20 min)
3. Configure Remote Site Settings (5 min)
4. Test trigger (10 min)

👉 **[Start Apex Setup →](docs/apex-setup.md)**

---

## Salesforce Custom Fields Required

Add these to the **Lead** object:

| Field Label | API Name | Type | Notes |
|------------|----------|------|-------|
| Phone Valid | `Phone_Valid__c` | Checkbox | Is number valid? |
| Phone Line Status | `Phone_Line_Status__c` | Picklist | Active/Inactive |
| Phone Line Type | `Phone_Line_Type__c` | Picklist | Mobile/Landline/VoIP |
| Phone Carrier | `Phone_Carrier__c` | Text(100) | Carrier name |
| Phone Fraud Score | `Phone_Fraud_Score__c` | Number(3,0) | 0-100 risk score |
| **Phone DNC Status** | `Phone_DNC_Status__c` | Checkbox | ⚠️ Do Not Call Registry |
| **Phone TCPA Blacklist** | `Phone_TCPA_Blacklist__c` | Checkbox | ⚠️ TCPA blacklist |
| **Phone Legal Risk** | `Phone_Legal_Risk__c` | Checkbox | ⚠️ Any legal issues |
| Phone Spammer | `Phone_Spammer__c` | Checkbox | Known spammer |
| Phone Prepaid | `Phone_Prepaid__c` | Checkbox | Prepaid line |
| Phone Data Breach | `Phone_Data_Breach__c` | Checkbox | In data breach |
| Phone Recent Abuse | `Phone_Recent_Abuse__c` | Checkbox | Recent abuse |
| Phone Reassigned | `Phone_Reassigned__c` | Checkbox | Recently reassigned |
| Phone Owner Name | `Phone_Owner_Name__c` | Text(255) | Owner/company |
| Phone Location | `Phone_Location__c` | Text(255) | City, State, ZIP |
| Phone Timezone | `Phone_Timezone__c` | Text(50) | Timezone |
| Phone Validation Date | `Phone_Validation_Date__c` | DateTime | When validated |
| Phone Recommendation | `Phone_Recommendation__c` | Picklist | Call decision |

**👉 Full field setup guide**: [`docs/salesforce-fields-setup.md`](docs/salesforce-fields-setup.md)

---

## Cost Comparison

| Leads/Month | Zapier Cost | Apex Cost | Savings |
|-------------|-------------|-----------|---------|
| 100 | $3-5 | $2 | $1-3 |
| 500 | $15-25 | $9 | $6-16 |
| 1,000 | $30-50 | $18 | $12-32 |
| 5,000 | $150-250 | $90 | $60-160 |

💡 **Recommendation**: Start with Zapier, migrate to Apex at 500+ leads/month

---

## Decision Logic

Your leads will be automatically categorized:

```
🟢 Good to Contact
   - Valid, active, mobile
   - No legal risks
   - Low fraud score (<50%)

🟡 Proceed with Caution
   - VoIP or Landline
   - Prepaid
   - Moderate fraud (50-84%)
   - Data breach detected

🔴 Do Not Contact
   - On Do Not Call Registry ⚠️
   - On TCPA Blacklist ⚠️
   - Inactive/Invalid
   - Known spammer
   - High fraud (85%+)
   - Recently reassigned
```

---

## Support & Resources

- **Dial or No Dial App**: https://github.com/tisa-pixel/dial-or-no-dial
- **API Endpoint**: `https://phone-lookup-tester.netlify.app/.netlify/functions/lookup`
- **GitHub Issues**: https://github.com/tisa-pixel/ringtrue-sf-edition/issues

---

## What's Next?

1. ✅ Choose your integration path (Zapier or Apex)
2. ✅ Create Salesforce custom fields
3. ✅ Follow the setup guide
4. ✅ Test with sample leads
5. ✅ Go live!

---

**⚠️ Legal First**: This tool helps you stay compliant by automatically identifying numbers on the Do Not Call Registry and TCPA blacklist. Always respect these flags! 📞
