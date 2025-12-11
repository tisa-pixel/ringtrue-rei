const https = require('https');

exports.handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { phoneNumber } = JSON.parse(event.body);

    // Get credentials from environment variables
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const ipqsApiKey = process.env.IPQS_API_KEY;

    if (!phoneNumber) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing phone number' })
      };
    }

    if (!accountSid || !authToken) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Twilio credentials not configured on server' })
      };
    }

    if (!ipqsApiKey) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'IPQS API key not configured on server' })
      };
    }

    // Call both APIs in parallel
    const [twilioResponse, ipqsResponse] = await Promise.all([
      makeTwilioRequest(phoneNumber, accountSid, authToken),
      makeIPQSRequest(phoneNumber, ipqsApiKey)
    ]);

    // Merge the responses
    const mergedResponse = {
      ...twilioResponse,
      ipqs_data: ipqsResponse,
      // Add IPQS line status to the main response for easier access
      line_status: {
        status: ipqsResponse.active ? 'active' : 'inactive',
        ipqs_active: ipqsResponse.active,
        ipqs_valid: ipqsResponse.valid,
        ipqs_fraud_score: ipqsResponse.fraud_score,
        ipqs_recent_abuse: ipqsResponse.recent_abuse,
        ipqs_VOIP: ipqsResponse.VOIP,
        ipqs_risky: ipqsResponse.risky
      }
    };

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(mergedResponse)
    };

  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: error.message || 'Failed to lookup phone number' 
      })
    };
  }
};

function makeTwilioRequest(phoneNumber, accountSid, authToken) {
  return new Promise((resolve, reject) => {
    const encodedPhone = encodeURIComponent(phoneNumber);
    const auth = Buffer.from(`${accountSid}:${authToken}`).toString('base64');

    const options = {
      hostname: 'lookups.twilio.com',
      path: `/v2/PhoneNumbers/${encodedPhone}?Fields=line_type_intelligence,caller_name,reassigned_number`,
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`
      }
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(new Error('Failed to parse Twilio response'));
          }
        } else {
          reject(new Error(`Twilio API error: ${res.statusCode} - ${data}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
}

function makeIPQSRequest(phoneNumber, apiKey) {
  return new Promise((resolve, reject) => {
    const encodedPhone = encodeURIComponent(phoneNumber);

    const options = {
      hostname: 'ipqualityscore.com',
      path: `/api/json/phone/${apiKey}/${encodedPhone}`,
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(new Error('Failed to parse IPQS response'));
          }
        } else {
          reject(new Error(`IPQS API error: ${res.statusCode} - ${data}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
}
