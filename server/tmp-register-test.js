const http = require('http');
const payload = JSON.stringify({
  name: 'Test User',
  email: 'testuser1234@example.com',
  password: 'secret123',
  phone: '1234567890',
  role: 'patient',
});

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/auth/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(payload),
  },
};

const req = http.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => { body += chunk; });
  res.on('end', () => {
    console.log('status:', res.statusCode);
    console.log('body:', body);
  });
});

req.on('error', (err) => {
  console.error('request error:', err);
});
req.write(payload);
req.end();
