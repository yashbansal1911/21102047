const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const uuid = require('uuid');
const crypto = require('crypto');

const app = express();
app.use(bodyParser.json());

// Array to store company data
const companies = [];

// Register endpoint
app.post('/test/register', (req, res) => {
  const { companyName, ownerName, rollNo, ownerEmail, accessCode } = req.body;

  // Generate clientID and clientSecret
  const clientID = generateUniqueID();
  const clientSecret = generateClientSecret();

  // Create a new company object
  const company = {
    companyName,
    ownerName,
    rollNo,
    ownerEmail,
    accessCode,
    clientID,
    clientSecret,
  };

  // Add the company to the array
  companies.push(company);

  // Return the response
  res.json({
    companyName,
    clientID,
    clientSecret,
    ownerName,
    ownerEmail,
    rollNo: '1',
  });
});

// Authorization Token endpoint
app.post('/test/auth', (req, res) => {
  const { companyName, clientID, clientSecret, ownerName, ownerEmail, rollNo } = req.body;

  // Find the company in the array
  const company = companies.find(
    (company) => company.companyName === companyName && company.clientID === clientID
  );

  // Validate the clientSecret
  if (!company || company.clientSecret !== clientSecret) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Generate and sign the token
  const token = jwt.sign({ companyName, clientID }, 'your-secret-key', { expiresIn: '1h' });

  // Return the token response
  res.json({
    token_type: 'Bearer',
    access_token: token,
    expires_in: 3600, // Token expiration time in seconds
  });
});

// Middleware to verify the token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    // Verify and decode the token
    const decoded = jwt.verify(token, 'your-secret-key');
    req.companyName = decoded.companyName;
    req.clientID = decoded.clientID;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Protected route example
app.get('/protected', verifyToken, (req, res) => {
  res.json({ message: 'Access granted to protected route' });
});

// Helper functions
function generateUniqueID() {
  // Generate a unique clientID using the uuid library
  return uuid.v4();
}

function generateClientSecret() {
  // Generate a random clientSecret using the crypto library
  return crypto.randomBytes(16).toString('hex');
}

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});