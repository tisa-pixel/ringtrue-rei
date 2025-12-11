# Deploy Custom Fields to Salesforce

**Deploy all 18 custom phone validation fields at once** using Salesforce CLI

---

## Quick Deploy (3 steps)

### Step 1: Install Salesforce CLI

**Mac (Homebrew):**
```bash
brew install sf
```

**Windows:**
Download installer: https://developer.salesforce.com/tools/salesforcecli

**Verify installation:**
```bash
sf --version
```

---

### Step 2: Authenticate to Salesforce

```bash
cd /Users/tisa/ringtrue-sf-edition/salesforce-metadata
sf org login web --alias ringtrue-org
```

This will open your browser to log into Salesforce. Use your production or sandbox credentials.

---

### Step 3: Deploy All Fields

```bash
sf project deploy start --source-dir . --target-org ringtrue-org
```

**Expected output:**
```
Deploying v60.0 metadata to ringtrue-org
Status: Succeeded
Components deployed: 18
```

---

## Verify Deployment

1. Log into Salesforce
2. Go to **Setup** → **Object Manager** → **Lead**
3. Click **Fields & Relationships**
4. You should see all 18 new custom fields:
   - Phone Valid
   - Phone Line Status
   - Phone Line Type
   - Phone Carrier
   - Phone Fraud Score
   - Phone DNC Status ⚠️
   - Phone TCPA Blacklist ⚠️
   - Phone Legal Risk ⚠️
   - Phone Spammer
   - Phone Prepaid
   - Phone Data Breach
   - Phone Recent Abuse
   - Phone Reassigned
   - Phone Owner Name
   - Phone Location
   - Phone Timezone
   - Phone Validation Date
   - Phone Recommendation

---

## Troubleshooting

### Error: "Source path does not exist"
**Fix:** Make sure you're in the `/salesforce-metadata` directory when running the deploy command.

### Error: "No org configuration found"
**Fix:** Run `sf org login web --alias ringtrue-org` again to authenticate.

### Error: "Field already exists"
**Fix:** Fields were already created. You can:
- Skip deployment (fields already exist)
- Delete existing fields in Salesforce UI first, then redeploy
- Or continue - Salesforce will update existing fields

### Error: "Insufficient access rights"
**Fix:** Make sure you're logged in as a System Administrator or have "Customize Application" permission.

---

## Alternative: Deploy to Sandbox First

If you want to test in a sandbox before production:

```bash
# Authenticate to sandbox
sf org login web --alias ringtrue-sandbox --instance-url https://test.salesforce.com

# Deploy to sandbox
sf project deploy start --source-dir . --target-org ringtrue-sandbox
```

---

## What's Being Deployed?

- **18 Custom Fields** on the Lead object
- **Field Types**: Checkbox, Text, Number, Picklist, DateTime
- **No triggers or code** - just field definitions
- **Safe to deploy** - won't affect existing data or functionality

---

## After Deployment

1. ✅ Add fields to Lead page layouts ([see guide](../docs/salesforce-fields-setup.md))
2. ✅ Create list views for lead filtering
3. ✅ Continue to Zapier setup ([see guide](../docs/zapier-setup.md))

---

## Files Deployed

All XML files in `salesforce-metadata/objects/Lead/fields/`:
- `Phone_Valid__c.field-meta.xml`
- `Phone_Line_Status__c.field-meta.xml`
- `Phone_Line_Type__c.field-meta.xml`
- `Phone_Carrier__c.field-meta.xml`
- `Phone_Fraud_Score__c.field-meta.xml`
- `Phone_DNC_Status__c.field-meta.xml`
- `Phone_TCPA_Blacklist__c.field-meta.xml`
- `Phone_Legal_Risk__c.field-meta.xml`
- `Phone_Spammer__c.field-meta.xml`
- `Phone_Prepaid__c.field-meta.xml`
- `Phone_Data_Breach__c.field-meta.xml`
- `Phone_Recent_Abuse__c.field-meta.xml`
- `Phone_Reassigned__c.field-meta.xml`
- `Phone_Owner_Name__c.field-meta.xml`
- `Phone_Location__c.field-meta.xml`
- `Phone_Timezone__c.field-meta.xml`
- `Phone_Validation_Date__c.field-meta.xml`
- `Phone_Recommendation__c.field-meta.xml`

Plus `package.xml` which tells Salesforce what to deploy.

---

**🚀 Ready to deploy?** Run the commands above and you'll have all 18 fields live in 2 minutes!
