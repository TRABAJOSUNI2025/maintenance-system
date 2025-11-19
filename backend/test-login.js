const http = require('http');

const testCases = [
  {
    name: 'Login Cliente',
    data: { email: 'cliente1@test.com', password: 'password123', userType: 'CLIENTE' }
  },
  {
    name: 'Login Trabajador',
    data: { email: 'trabajador2@test.com', password: 'password123', userType: 'TRABAJADOR' }
  }
];

async function testLogin(testCase) {
  return new Promise((resolve) => {
    const postData = JSON.stringify(testCase.data);

    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          console.log(`\n✓ ${testCase.name}:`);
          console.log(`  Status: ${res.statusCode}`);
          console.log(`  User:`, result.user);
          console.log(`  Role:`, result.user.role);
          console.log(`  Token: ${result.accessToken.substring(0, 20)}...`);
        } catch (e) {
          console.log(`\n✗ ${testCase.name}:`);
          console.log(`  Status: ${res.statusCode}`);
          console.log(`  Response: ${data}`);
        }
        resolve();
      });
    });

    req.on('error', (error) => {
      console.log(`\n✗ ${testCase.name}: ${error.message}`);
      resolve();
    });

    req.write(postData);
    req.end();
  });
}

async function runTests() {
  console.log('=== Testeando Login con diferentes roles ===\n');
  for (const testCase of testCases) {
    await testLogin(testCase);
  }
  console.log('\n=== Tests completados ===\n');
}

runTests();
