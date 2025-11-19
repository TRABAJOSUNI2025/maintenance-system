const http = require('http');

const testCases = [
  {
    name: 'Login CLIENTE',
    data: { email: 'cliente1@test.com', password: 'password123', userType: 'CLIENTE' }
  },
  {
    name: 'Login TRABAJADOR (ADMINISTRADOR)',
    data: { email: 'admin@test.com', password: 'password123', userType: 'TRABAJADOR' }
  },
  {
    name: 'Login con userType incorrecto (CLIENTE como TRABAJADOR)',
    data: { email: 'cliente1@test.com', password: 'password123', userType: 'TRABAJADOR' }
  },
  {
    name: 'Login con userType incorrecto (TRABAJADOR como CLIENTE)',
    data: { email: 'admin@test.com', password: 'password123', userType: 'CLIENTE' }
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
          if (res.statusCode === 200) {
            console.log(`\n✓ ${testCase.name}:`);
            console.log(`  Status: ${res.statusCode}`);
            console.log(`  User: ${result.user.email}`);
            console.log(`  Role: ${result.user.role}`);
          } else {
            console.log(`\n✗ ${testCase.name}:`);
            console.log(`  Status: ${res.statusCode}`);
            console.log(`  Error: ${result.message}`);
          }
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
  console.log('=== Testeando Login - Roles Correctos vs Incorrectos ===\n');
  for (const testCase of testCases) {
    await testLogin(testCase);
  }
  console.log('\n=== Tests completados ===\n');
}

runTests();
