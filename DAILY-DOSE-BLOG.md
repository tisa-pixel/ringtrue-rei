# Daily Dose - Build Post: RingTrue - Salesforce Edition
**For conversionisourgame.com**
**Created:** December 11, 2025

---

## 1. BUILD TITLE
How I Built Automatic Phone Validation in Salesforce to Stop Calling Numbers on the Do Not Call List (And Avoid $43,000 TCPA Fines)

---

## 2. THE PROBLEM
You're running outbound calling campaigns in Salesforce, but you have NO IDEA if your leads' phone numbers are:
- On the **Do Not Call Registry** (illegal to call)
- On the **TCPA Blacklist** (lawsuit waiting to happen)
- Disconnected or reassigned
- Fraud numbers that waste your reps' time
- VoIP lines that never pick up

The legal risk is massive: TCPA violations cost **$500-$1,500 PER CALL**. A sales team calling 100 flagged numbers = $50,000-$150,000 in fines.

Most teams find out they called DNC numbers AFTER they get sued - because Salesforce doesn't validate phone numbers automatically, and reps don't check manually.

You need phone validation that happens automatically, flags legal risks before reps dial, and enriches every lead with fraud scores, carrier info, and quality indicators - without slowing down your workflow.

---

## 3. THE SOLUTION
Built **RingTrue - Salesforce Edition** - automatic phone validation that enriches every Salesforce lead with 17 data fields the moment they're created.

When a lead enters Salesforce (web form, API, manual entry), RingTrue automatically:
1. Validates the phone number (active/inactive, valid/invalid)
2. Checks **Do Not Call Registry** and **TCPA Blacklist**
3. Runs fraud detection (0-100% risk score)
4. Identifies line type (mobile, landline, VoIP)
5. Looks up carrier, owner name, location, timezone
6. Flags spammers, prepaid lines, data breach victims
7. Gives a **recommendation**: "Good to Contact" / "Proceed with Caution" / "Do Not Contact - Legal Risk"

All 17 fields populate automatically in Salesforce. Reps see the legal risk flags BEFORE they dial.

**Two integration options:**
- **Zapier** (10-minute setup, no code)
- **Apex Trigger** (real-time, scales to thousands of leads/month)

Cost: ~$0.02 per lead validated. Prevents one $500 TCPA fine = you've validated 25,000 leads for free.

---

## 4. WATCH ME BUILD IT
[YouTube embed code - TBD]

Watch the full walkthrough on YouTube where I break down the Zapier integration, Apex trigger deployment, and Salesforce field mappings.

---

## 5. WHAT YOU'LL LEARN
- How to integrate phone validation APIs with Salesforce
- Building Zapier webhooks for Salesforce enrichment
- Writing Apex triggers for API callouts
- Mapping API responses to Salesforce picklist values
- Creating custom fields for phone intelligence
- Legal compliance automation (DNC, TCPA)
- Fraud detection scoring and thresholds
- Rate limiting strategies for API integrations
- Cost optimization for high-volume lead validation

---

## 6. BUILD DETAILS

### 6.1 Time Investment
| Who | Time Required |
|-----|---------------|
| **If You Hire a Dev** | 8-10 hours ($800-$1,500) |
| **If You Build It - Zapier Path** | 15 minutes |
| **If You Build It - Apex Path** | 45 minutes |

### 6.2 Cost Breakdown
| Approach | Cost |
|----------|------|
| **Developer Rate** | $100-150/hour |
| **Estimated Dev Cost** | $800-$1,500 |
| **DIY Cost (Zapier Path)** | 15 minutes + $3-50/month (Zapier + API fees) |
| **DIY Cost (Apex Path)** | 45 minutes + $0.02/lead (API only) |
| **Cost per TCPA Violation** | $500-$1,500 PER CALL |

**ROI:** Prevent ONE TCPA violation = 25,000 leads validated for free

**Operating Costs (per month):**
| Leads/Month | Zapier Path | Apex Path | API Cost |
|-------------|-------------|-----------|----------|
| 100 | $3-5 | $2 | $2 |
| 500 | $15-25 | $9 | $9 |
| 1,000 | $30-50 | $18 | $18 |
| 5,000 | $150-250 | $90 | $90 |

Recommendation: Start with Zapier, migrate to Apex at 500+ leads/month

---

## 7. TECH STACK
🔧 **Tools Used:**
- **Salesforce** (CRM platform)
- **Twilio Lookup API** (Phone validation, line type, carrier)
- **IPQualityScore API** (Fraud detection, DNC/TCPA check - FREE tier: 1,000/month)
- **Zapier** (No-code integration - Option 1)
- **Apex** (Salesforce code - Option 2)
- **Netlify Functions** (API proxy/aggregator)

---

## 8. STEP-BY-STEP BREAKDOWN

### 1. **Create Custom Fields in Salesforce**

Start by adding 17 custom fields to the Lead object. These fall into several categories: legal compliance fields (DNC status, TCPA blacklist, legal risk flag), validation fields (valid/invalid, line status, line type), fraud detection (fraud score, spammer flag, recent abuse), phone intelligence (carrier, owner name, location, timezone), and quality indicators (prepaid, data breach, reassigned).

The most critical field is Phone_Recommendation - a picklist that drives your workflow with values like "Do Not Contact - Legal Risk", "Proceed with Caution", and "Good to Contact". This becomes the single field reps check before dialing.

---

### 2. **Set Up the API Proxy**

The phone validation API aggregates data from multiple sources - Twilio for carrier/line type and IPQualityScore for fraud/DNC/TCPA checks. We use a Netlify function as a proxy that calls both APIs and returns unified results.

The proxy simplifies integration - instead of calling two APIs from Salesforce, you make one request and get all 17 data points back. The GitHub repo includes the complete proxy function ready to deploy.

---

### 3. **Choose Your Integration Path**

For the Zapier path: Create a Zap triggered by new Salesforce Leads, add a webhook action that POSTs the phone number to the API proxy, then use a Salesforce Update action to write all returned fields back to the Lead. Zapier's code step handles the recommendation logic.

For the Apex path: Create a trigger that fires on Lead insert/update, calls the API asynchronously using a future method, parses the JSON response, and updates the Lead with all phone data. This scales better and runs in real-time.

---

### 4. **Configure the Zapier Webhook (Option 1)**

Set up your Zap with Salesforce as the trigger - new Lead where Phone is not empty. Add a Webhooks by Zapier action that POSTs to the API proxy with the phone number. The response includes all validation data.

Map each API response field to the corresponding Salesforce field. Use Zapier's code step to calculate the recommendation based on legal risk flags, fraud score, and validity. Test with a real phone number before activating.

---

### 5. **Deploy Apex Trigger (Option 2)**

The repo includes pre-built Apex classes: a callout class that makes the HTTP request to the API and parses the response, and a trigger that fires on Lead insert/update and calls the callout asynchronously.

Deploy using Salesforce CLI or via Setup → Deployment Status. Add the API endpoint as a Remote Site Setting so Salesforce allows the callout. The trigger handles the recommendation calculation server-side.

---

### 6. **Configure Remote Site Settings**

For Apex integration, Salesforce requires you to whitelist external API endpoints. Go to Setup → Security → Remote Site Settings and add the API proxy URL. This allows your Apex code to make HTTP callouts to the phone validation service.

Without this step, all API calls will fail with a CalloutException. It's a one-time configuration that takes about 30 seconds.

---

### 7. **Create Validation Rules**

Add validation rules that prevent reps from accidentally contacting legal-risk leads. Create a rule that blocks status changes to "Attempting Contact" when Phone_DNC_Status is true. Add another for TCPA blacklist.

These rules are your safety net - even if a rep doesn't check the recommendation field, Salesforce won't let them mark a DNC lead as "Attempting Contact". Include clear error messages explaining the legal risk.

---

### 8. **Create List Views**

Build list views that make it easy for reps to find safe leads. Create a "Good to Contact" view filtered on that recommendation value. Create a "Legal Risk - Do Not Call" view so managers can monitor flagged leads.

Add a "Proceed with Caution" view for leads that are contactable but need extra attention - VoIP lines, prepaid phones, or moderate fraud scores. These views become the daily working queues for your sales team.

---

### 9. **Update Page Layouts**

Add all 17 phone validation fields to your Lead page layout in a dedicated section called "Phone Validation". Make the legal risk fields read-only so reps can't accidentally clear flags.

Put the Phone_Recommendation field at the top of the section with conditional highlighting - red for "Do Not Contact", yellow for "Proceed with Caution", green for "Good to Contact". Reps should see the recommendation instantly.

---

### 10. **Set Up Reporting**

Create reports and dashboards for compliance visibility. Build a report showing all leads with DNC status by rep, by source, and by date. Calculate fines avoided by multiplying legal-risk leads by $500.

Add a lead quality breakdown showing the distribution of recommendations across your database. Track fraud scores by lead source to identify which channels bring higher-risk leads.

---

## 9. GITHUB REPO
📂 **Get the Code:**
[View on GitHub: github.com/tisa-pixel/ringtrue-rei](https://github.com/tisa-pixel/ringtrue-rei)

**What's included in the repo:**
- Salesforce metadata for all 17 custom fields
- Apex trigger + callout classes
- Zapier webhook payload examples
- Field mapping documentation
- Deployment scripts
- Complete setup guides

---

## 10. DOWNLOAD THE TEMPLATE
⬇️ **Download Resources:**
- [Clone the repo](https://github.com/tisa-pixel/ringtrue-rei) - Full Salesforce metadata + code
- [Salesforce Metadata](https://github.com/tisa-pixel/ringtrue-rei/tree/main/salesforce-edition/salesforce-metadata) - Ready to deploy
- [Field Mappings Guide](https://github.com/tisa-pixel/ringtrue-rei/blob/main/salesforce-edition/SALESFORCE_FIELD_MAPPINGS.md) - API to SF mappings
- [Zapier Setup Guide](https://github.com/tisa-pixel/ringtrue-rei/blob/main/salesforce-edition/docs/zapier-setup.md) - Step-by-step Zapier

**Setup Checklist:**
1. Clone repo
2. Choose integration path (Zapier or Apex)
3. Deploy Salesforce metadata (17 custom fields)
4. If Zapier: Set up webhook
5. If Apex: Deploy trigger + callout classes
6. Configure Remote Site Settings (Apex only)
7. Create validation rules (prevent calling DNC numbers)
8. Add fields to page layout
9. Create list views for reps
10. Test with sample lead

---

## 11. QUESTIONS? DROP THEM BELOW
💬 **Have questions or want to share your results?**
- Comment on the [YouTube video](#) (TBD)
- DM me on Instagram: [@donottakeifallergictorevenue](https://www.instagram.com/donottakeifallergictorevenue/)
- Open an issue on [GitHub](https://github.com/tisa-pixel/ringtrue-rei/issues)

---

## 12. RELATED BUILDS
| Build 1 | Build 2 | Build 3 |
|---------|---------|---------|
| **Am I Spam? - Phone Reputation Checker** | **Sarah - AI Lead Qualifier** | **Attempting Contact - Follow-Up Cadence** |
| Check if your outbound DIDs are flagged as spam | AI voice agent that qualifies and warm transfers leads | Automated 17-touch Salesforce cadence |
| [View Build](https://github.com/tisa-pixel/am-i-spam) | [View Build](https://github.com/tisa-pixel/rei-lead-qualifier) | [View Build](https://github.com/tisa-pixel/attempting-contact) |

---

## Additional Metadata (for SEO / Backend)

**Published:** December 11, 2025
**Author:** Tisa Daniels
**Category:** Salesforce / Phone Validation / Legal Compliance / REI Tech
**Tags:** #Salesforce #PhoneValidation #TCPA #DNC #LegalCompliance #FraudDetection #RealEstateInvesting #Apex #Zapier
**Estimated Read Time:** 10 minutes
**Video Duration:** TBD

---

## Design Notes for Wix Implementation

### Layout Style:
- **Dark background** (charcoal #1B1C1D)
- **High contrast text** (white headings, light gray body)
- **Accent colors:** Red (#dc2626 for "Legal Risk"), Green (#16a34a for "Good to Contact"), Yellow (#eab308 for "Caution")
- **Clean, modern, mobile-first**

### Call-to-Action Buttons:
- **Primary CTA** (Clone on GitHub): Purple (#7c3aed)
- **Secondary CTA** (Watch on YouTube): Blue (#2563eb)
- **Legal Warning CTA**: Red (#dc2626)

---

**Template Version:** 1.0
**Created:** December 11, 2025
**Compliance Note:** Always consult legal counsel for TCPA compliance in your specific use case
