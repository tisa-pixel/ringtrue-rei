# Salesforce Field Mappings for RingTrue Integration

## Critical: Picklist Value Mappings

When integrating RingTrue API responses with Salesforce, you MUST map the API values to the correct Salesforce picklist values. Attempting to insert invalid picklist values will result in errors.

## Phone_Line_Type__c (Picklist)

**Valid Salesforce Values:**
- `mobile`
- `landline`
- `voip`
- `unknown`

**API to Salesforce Mapping:**
```javascript
const LINE_TYPE_MAP = {
  'mobile': 'mobile',
  'landline': 'landline',
  'fixedVoip': 'voip',        // RingTrue/Twilio returns this
  'nonFixedVoip': 'voip',     // RingTrue/Twilio returns this
  'voip': 'voip',
  'Unknown': 'unknown',
  '': 'unknown'
};
```

## Phone_Recommendation__c (Picklist)

**Valid Salesforce Values:**
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

**API to Salesforce Mapping:**
```javascript
const RECOMMENDATION_MAP = {
  'DO NOT CALL - Legal Risk': 'Do Not Contact - Legal Risk',
  'Inactive/Invalid': 'Do Not Contact - Invalid/Inactive',
  'High Risk': 'Do Not Contact - High Fraud',
  'Medium Risk': 'Proceed with Caution - Moderate Fraud',
  'OK to Call': 'Good to Contact',
  '': 'Review Required'
};
```

## Complete Field List

### Required Custom Fields

| API Field | Salesforce Field | Type | Notes |
|-----------|------------------|------|-------|
| `carrier_name` | `Phone_Carrier__c` | Text(255) | Verizon, AT&T, T-Mobile, etc. |
| `type` | `Phone_Line_Type__c` | Picklist | **Requires mapping** (see above) |
| (calculated) | `Phone_Recommendation__c` | Picklist | **Requires mapping** (see above) |
| `do_not_call` | `Phone_DNC_Status__c` | Checkbox | Critical for legal compliance |
| `tcpa_blacklist` | `Phone_TCPA_Blacklist__c` | Checkbox | Critical for legal compliance |
| `fraud_score` | `Phone_Fraud_Score__c` | Number(3,0) | 0-100 |
| `valid` | `Phone_Valid__c` | Checkbox | Number exists/is valid |
| `status` | `Phone_Line_Status__c` | Text(50) | active/inactive |
| `caller_name` | `Phone_Owner_Name__c` | Text(255) | CNAM data |
| `city` | `Phone_Location__c` | Text(255) | Geographic location |
| `timezone` | `Phone_Timezone__c` | Text(50) | For optimal call times |
| `prepaid` | `Phone_Prepaid__c` | Checkbox | Lead quality indicator |
| `risky` | `Phone_Legal_Risk__c` | Checkbox | High-risk number |
| `recent_abuse` | `Phone_Recent_Abuse__c` | Checkbox | Recent spam reports |
| `spammer` | `Phone_Spammer__c` | Checkbox | Known spammer |
| `leaked` | `Phone_Data_Breach__c` | Checkbox | Found in data breaches |
| `is_number_reassigned` | `Phone_Reassigned__c` | Checkbox | Recently reassigned |
| (system) | `Phone_Validation_Date__c` | DateTime | Last validation timestamp |

## Example Python Implementation

```python
def map_to_salesforce(api_response):
    """Map RingTrue API response to Salesforce field values"""

    line_intel = api_response.get('line_type_intelligence') or {}
    ipqs = api_response.get('ipqs_data') or {}
    line_status = api_response.get('line_status') or {}

    # Map line type
    line_type_raw = line_intel.get('type', 'Unknown')
    line_type_map = {
        'mobile': 'mobile',
        'landline': 'landline',
        'fixedVoip': 'voip',
        'nonFixedVoip': 'voip',
        'voip': 'voip',
        'Unknown': 'unknown',
        '': 'unknown'
    }
    line_type = line_type_map.get(line_type_raw, 'unknown')

    # Calculate recommendation
    is_active = line_status.get('status') == 'active'
    is_valid = api_response.get('valid', False)
    fraud_score = ipqs.get('fraud_score', 0)
    dnc = ipqs.get('do_not_call', False)
    tcpa = ipqs.get('tcpa_blacklist', False)

    if dnc or tcpa:
        recommendation = 'Do Not Contact - Legal Risk'
    elif not is_valid or not is_active:
        recommendation = 'Do Not Contact - Invalid/Inactive'
    elif fraud_score > 75:
        recommendation = 'Do Not Contact - High Fraud'
    elif fraud_score > 50:
        recommendation = 'Proceed with Caution - Moderate Fraud'
    else:
        recommendation = 'Good to Contact'

    return {
        'Phone_Carrier__c': line_intel.get('carrier_name', ''),
        'Phone_Line_Type__c': line_type,
        'Phone_Recommendation__c': recommendation,
        'Phone_DNC_Status__c': dnc,
        'Phone_TCPA_Blacklist__c': tcpa,
        'Phone_Fraud_Score__c': fraud_score,
        'Phone_Valid__c': is_valid,
        'Phone_Line_Status__c': line_status.get('status', ''),
        'Phone_Validation_Date__c': 'NOW()'  # Use Salesforce NOW() function
    }
```

## Example Zapier Implementation

1. **Trigger**: New Lead in Salesforce
2. **Action**: HTTP Request to RingTrue API
   - URL: `https://phone-lookup-tester.netlify.app/.netlify/functions/lookup`
   - Method: POST
   - Body: `{"phoneNumber": "{{Phone}}"}`
3. **Action**: Update Lead in Salesforce
   - Map fields using JavaScript code in Zapier:
   ```javascript
   // Map line type
   let lineType = 'unknown';
   if (inputData.line_type_intelligence?.type === 'mobile') lineType = 'mobile';
   else if (inputData.line_type_intelligence?.type === 'landline') lineType = 'landline';
   else if (inputData.line_type_intelligence?.type?.includes('Voip')) lineType = 'voip';

   // Calculate recommendation
   let recommendation = 'Review Required';
   if (inputData.ipqs_data?.do_not_call || inputData.ipqs_data?.tcpa_blacklist) {
     recommendation = 'Do Not Contact - Legal Risk';
   } else if (!inputData.valid || inputData.line_status?.status !== 'active') {
     recommendation = 'Do Not Contact - Invalid/Inactive';
   }

   output = {
     Phone_Line_Type__c: lineType,
     Phone_Recommendation__c: recommendation,
     Phone_Carrier__c: inputData.line_type_intelligence?.carrier_name,
     Phone_DNC_Status__c: inputData.ipqs_data?.do_not_call,
     Phone_TCPA_Blacklist__c: inputData.ipqs_data?.tcpa_blacklist,
     Phone_Fraud_Score__c: inputData.ipqs_data?.fraud_score
   };
   ```

## Testing Validation

Before deploying to production, test with these scenarios:

```python
# Test Case 1: Mobile number
assert map_to_salesforce({'line_type_intelligence': {'type': 'mobile'}})['Phone_Line_Type__c'] == 'mobile'

# Test Case 2: Fixed VoIP (should map to voip)
assert map_to_salesforce({'line_type_intelligence': {'type': 'fixedVoip'}})['Phone_Line_Type__c'] == 'voip'

# Test Case 3: DNC violation (must map to legal risk)
assert map_to_salesforce({'ipqs_data': {'do_not_call': True}})['Phone_Recommendation__c'] == 'Do Not Contact - Legal Risk'

# Test Case 4: TCPA violation (must map to legal risk)
assert map_to_salesforce({'ipqs_data': {'tcpa_blacklist': True}})['Phone_Recommendation__c'] == 'Do Not Contact - Legal Risk'

# Test Case 5: Inactive number
assert map_to_salesforce({'valid': False})['Phone_Recommendation__c'] == 'Do Not Contact - Invalid/Inactive'
```

## Common Errors

### Error 1: INVALID_OR_NULL_FOR_RESTRICTED_PICKLIST
```
Phone Line Type: bad value for restricted picklist field: nonFixedVoip
```
**Solution**: Use the LINE_TYPE_MAP to convert `nonFixedVoip` → `voip`

### Error 2: INVALID_OR_NULL_FOR_RESTRICTED_PICKLIST
```
Phone Recommendation: bad value for restricted picklist field: Inactive/Invalid
```
**Solution**: Use the RECOMMENDATION_MAP to convert `Inactive/Invalid` → `Do Not Contact - Invalid/Inactive`

### Error 3: Empty carrier causes validation error
**Solution**: Don't send empty strings for carrier field; use blank value or map `Unknown` → `''`

## Rate Limiting

- RingTrue API: 1 request per second recommended (tested with 38 leads)
- Twilio API: 100 requests per second (Enterprise tier)
- IPQS API: 600 requests per minute (free tier)

## Cost Per Lead

- **Twilio**: $0.018 per lookup
- **IPQS**: FREE (1,000 lookups/month on free tier)
- **Total**: ~$0.02 per lead validated

## Last Updated

October 30, 2025 - Tested with 38 leads in catalyst-partners Salesforce org
