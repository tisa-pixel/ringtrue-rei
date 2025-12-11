# Salesforce Custom Fields Setup Guide

**Complete this in ~10 minutes** | Required for both Zapier and Apex integrations

---

## Overview

You need to create 18 custom fields on the **Lead** object in Salesforce to store phone validation data. These fields will be automatically populated by either Zapier or Apex triggers.

---

## Quick Setup Steps

1. Log into Salesforce
2. Go to **Setup** (gear icon, top right)
3. In Quick Find, search **"Object Manager"**
4. Click **"Lead"**
5. Click **"Fields & Relationships"** in the left sidebar
6. Click **"New"** to create each field below

---

## Field Definitions

### Basic Phone Validation

#### 1. Phone Valid
- **Field Label**: `Phone Valid`
- **API Name**: `Phone_Valid__c`
- **Data Type**: Checkbox
- **Default Value**: Unchecked
- **Description**: Indicates if the phone number is valid and formatted correctly
- **Field-Level Security**: Visible to all profiles

#### 2. Phone Line Status
- **Field Label**: `Phone Line Status`
- **API Name**: `Phone_Line_Status__c`
- **Data Type**: Picklist
- **Values**:
  - `active`
  - `inactive`
  - `unknown`
- **Description**: Current status of the phone line (active/inactive)
- **Field-Level Security**: Visible to all profiles

#### 3. Phone Line Type
- **Field Label**: `Phone Line Type`
- **API Name**: `Phone_Line_Type__c`
- **Data Type**: Picklist
- **Values**:
  - `mobile`
  - `landline`
  - `voip`
  - `unknown`
- **Description**: Type of phone line (mobile, landline, VoIP)
- **Field-Level Security**: Visible to all profiles

#### 4. Phone Carrier
- **Field Label**: `Phone Carrier`
- **API Name**: `Phone_Carrier__c`
- **Data Type**: Text
- **Length**: 100
- **Description**: Name of the phone carrier/provider
- **Field-Level Security**: Visible to all profiles

#### 5. Phone Fraud Score
- **Field Label**: `Phone Fraud Score`
- **API Name**: `Phone_Fraud_Score__c`
- **Data Type**: Number
- **Length**: 3
- **Decimal Places**: 0
- **Description**: Fraud risk score from 0-100 (higher = riskier)
- **Field-Level Security**: Visible to all profiles

---

### Legal Compliance (⚠️ CRITICAL)

#### 6. Phone DNC Status
- **Field Label**: `Phone DNC Status`
- **API Name**: `Phone_DNC_Status__c`
- **Data Type**: Checkbox
- **Default Value**: Unchecked
- **Description**: ⚠️ CRITICAL: Is number on Do Not Call Registry? ($500-$1500 fine per violation)
- **Help Text**: ⚠️ DO NOT CALL if checked. Legal violation: $500-$1500 per call
- **Field-Level Security**: Visible to all profiles

#### 7. Phone TCPA Blacklist
- **Field Label**: `Phone TCPA Blacklist`
- **API Name**: `Phone_TCPA_Blacklist__c`
- **Data Type**: Checkbox
- **Default Value**: Unchecked
- **Description**: ⚠️ CRITICAL: Is number on TCPA litigation blacklist?
- **Help Text**: ⚠️ DO NOT CALL if checked. High risk of lawsuit
- **Field-Level Security**: Visible to all profiles

#### 8. Phone Legal Risk
- **Field Label**: `Phone Legal Risk`
- **API Name**: `Phone_Legal_Risk__c`
- **Data Type**: Checkbox
- **Default Value**: Unchecked
- **Description**: ⚠️ Does this number have ANY legal compliance issues? (DNC or TCPA)
- **Help Text**: ⚠️ Review DNC Status and TCPA Blacklist before calling
- **Field-Level Security**: Visible to all profiles

---

### Lead Quality Indicators

#### 9. Phone Spammer
- **Field Label**: `Phone Spammer`
- **API Name**: `Phone_Spammer__c`
- **Data Type**: Checkbox
- **Default Value**: Unchecked
- **Description**: Is this number flagged as a known spammer?
- **Field-Level Security**: Visible to all profiles

#### 10. Phone Prepaid
- **Field Label**: `Phone Prepaid`
- **API Name**: `Phone_Prepaid__c`
- **Data Type**: Checkbox
- **Default Value**: Unchecked
- **Description**: Is this a prepaid phone line?
- **Field-Level Security**: Visible to all profiles

#### 11. Phone Data Breach
- **Field Label**: `Phone Data Breach`
- **API Name**: `Phone_Data_Breach__c`
- **Data Type**: Checkbox
- **Default Value**: Unchecked
- **Description**: Has this number appeared in known data breaches?
- **Field-Level Security**: Visible to all profiles

#### 12. Phone Recent Abuse
- **Field Label**: `Phone Recent Abuse`
- **API Name**: `Phone_Recent_Abuse__c`
- **Data Type**: Checkbox
- **Default Value**: Unchecked
- **Description**: Has this number been used for recent abusive behavior?
- **Field-Level Security**: Visible to all profiles

#### 13. Phone Reassigned
- **Field Label**: `Phone Reassigned`
- **API Name**: `Phone_Reassigned__c`
- **Data Type**: Checkbox
- **Default Value**: Unchecked
- **Description**: Was this number recently reassigned to a new owner?
- **Help Text**: Calling reassigned numbers can violate TCPA
- **Field-Level Security**: Visible to all profiles

---

### Identity & Location

#### 14. Phone Owner Name
- **Field Label**: `Phone Owner Name`
- **API Name**: `Phone_Owner_Name__c`
- **Data Type**: Text
- **Length**: 255
- **Description**: Name of the phone number owner or associated business
- **Field-Level Security**: Visible to all profiles

#### 15. Phone Location
- **Field Label**: `Phone Location`
- **API Name**: `Phone_Location__c`
- **Data Type**: Text
- **Length**: 255
- **Description**: Location associated with phone number (City, State, ZIP)
- **Field-Level Security**: Visible to all profiles

#### 16. Phone Timezone
- **Field Label**: `Phone Timezone`
- **API Name**: `Phone_Timezone__c`
- **Data Type**: Text
- **Length**: 50
- **Description**: Timezone of the phone number location (e.g., America/New_York)
- **Field-Level Security**: Visible to all profiles

---

### Metadata

#### 17. Phone Validation Date
- **Field Label**: `Phone Validation Date`
- **API Name**: `Phone_Validation_Date__c`
- **Data Type**: Date/Time
- **Description**: When was the phone number last validated?
- **Field-Level Security**: Visible to all profiles

#### 18. Phone Recommendation
- **Field Label**: `Phone Recommendation`
- **API Name**: `Phone_Recommendation__c`
- **Data Type**: Picklist
- **Values**:
  - `Do Not Contact - Legal Risk`
  - `Do Not Contact - Invalid/Inactive`
  - `Do Not Contact - High Fraud`
  - `Do Not Contact - Spammer`
  - `Proceed with Caution - VoIP/Landline`
  - `Proceed with Caution - Prepaid`
  - `Proceed with Caution - Moderate Fraud`
  - `Proceed with Caution - Data Breach`
  - `Good to Contact`
  - `Review Required`
- **Default Value**: `Review Required`
- **Description**: Recommended action based on phone validation data
- **Field-Level Security**: Visible to all profiles

---

## Automated Setup (Optional)

If you prefer to use Salesforce metadata files, create a `package.xml` and field XML files in the `salesforce-metadata/` directory.

### Using Salesforce CLI

```bash
# Install Salesforce CLI if not already installed
npm install -g @salesforce/cli

# Authenticate to your Salesforce org
sf org login web --alias ringtrue-org

# Deploy custom fields
sf project deploy start --source-dir salesforce-metadata/
```

---

## After Field Creation

### 1. Add Fields to Page Layouts

1. Go to **Setup** → **Object Manager** → **Lead**
2. Click **"Page Layouts"**
3. Click **"Lead Layout"** (or your custom layout)
4. Click **"Fields"** in the palette
5. Drag the new custom fields to your desired section

**Recommended sections:**
- Create a new section: **"Phone Validation"**
- Move all 18 fields into this section
- Arrange with legal fields at the top for visibility

### 2. Create List Views

Create filtered list views for easy lead management:

**View: "Legal Risk Leads"**
- Filter: `Phone Legal Risk = TRUE`
- Columns: Name, Company, Phone, Phone DNC Status, Phone TCPA Blacklist, Phone Recommendation

**View: "High Quality Leads"**
- Filter: `Phone Recommendation = "Good to Contact"`
- Columns: Name, Company, Phone, Phone Line Type, Phone Carrier, Phone Fraud Score

**View: "Needs Review"**
- Filter: `Phone Recommendation CONTAINS "Caution"`
- Columns: Name, Company, Phone, Phone Recommendation, Phone Fraud Score, Phone Prepaid

### 3. Set Up Validation Rules (Optional)

Prevent users from marking leads as "Working - Contacted" if there are legal risks:

**Rule Name**: `Prevent_Contact_Legal_Risk`

**Formula**:
```
AND(
  Phone_Legal_Risk__c = TRUE,
  ISPICKVAL(Status, "Working - Contacted")
)
```

**Error Message**:
```
⚠️ Cannot contact this lead: Phone number has legal compliance issues (DNC/TCPA). Review Phone DNC Status and Phone TCPA Blacklist fields.
```

---

## Field Mapping Reference

Use this table when setting up Zapier or Apex:

| Salesforce Field API Name | Source in API Response | Notes |
|---------------------------|------------------------|-------|
| `Phone_Valid__c` | `valid` | Boolean |
| `Phone_Line_Status__c` | `line_status.status` | Text: active/inactive |
| `Phone_Line_Type__c` | `lineType` | Text: mobile/landline/voip |
| `Phone_Carrier__c` | `carrier` | Text |
| `Phone_Fraud_Score__c` | `ipqs_data.fraud_score` | Number: 0-100 |
| `Phone_DNC_Status__c` | `ipqs_data.do_not_call` | Boolean |
| `Phone_TCPA_Blacklist__c` | `ipqs_data.do_not_call` | Boolean (same as DNC) |
| `Phone_Legal_Risk__c` | *Calculated* | TRUE if DNC or TCPA |
| `Phone_Spammer__c` | `ipqs_data.spammer` | Boolean |
| `Phone_Prepaid__c` | `ipqs_data.prepaid` | Boolean |
| `Phone_Data_Breach__c` | `ipqs_data.leaked` | Boolean |
| `Phone_Recent_Abuse__c` | `ipqs_data.recent_abuse` | Boolean |
| `Phone_Reassigned__c` | `isReassigned` | Boolean |
| `Phone_Owner_Name__c` | `callerName` or `ipqs_data.name` | Text |
| `Phone_Location__c` | *Combine:* `ipqs_data.city`, `region`, `zip_code` | Text |
| `Phone_Timezone__c` | `ipqs_data.timezone` | Text |
| `Phone_Validation_Date__c` | *Current timestamp* | DateTime |
| `Phone_Recommendation__c` | *Calculated* | Picklist value |

---

## Testing Your Fields

After creating all fields, test by manually creating a lead and filling in sample data:

1. Go to **Leads** tab
2. Click **"New"**
3. Fill required fields (Last Name, Company)
4. Add a phone number
5. Scroll to your **Phone Validation** section
6. Check that all 18 custom fields are visible
7. Save the lead

---

## Troubleshooting

**Issue: Field doesn't appear in page layout**
- **Fix**: Go to Page Layouts → Drag field from palette

**Issue: "Insufficient access rights" error**
- **Fix**: Check Field-Level Security → Make visible to your profile

**Issue: Picklist values not showing**
- **Fix**: Verify you added all picklist values exactly as specified

**Issue: Can't save lead - "Invalid data type"**
- **Fix**: Verify field types match exactly (Checkbox vs Text vs Number)

---

## Next Steps

✅ Fields created? → Continue to [Zapier Setup](zapier-setup.md) or [Apex Setup](apex-setup.md)
✅ Add fields to page layouts
✅ Create list views for lead filtering
✅ Train sales team on new fields

---

## Support

- **Salesforce Field Help**: https://help.salesforce.com/s/articleView?id=sf.adding_fields.htm
- **API Field Names**: https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/sforce_api_objects_lead.htm

---

**🎉 Fields ready!** You can now proceed with your integration setup.
