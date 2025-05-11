const http = require('http');

const TOTAL_REQUESTS = 10000;
const BATCH_SIZE = 100; // Jumlah request paralel per batch
const DELAY_MS = 200;   // Delay antar batch (untuk menghindari overload)

function getRandomName() {
  const chars = 'abcdefghijklmnopqrstuvwxyz';
  const length = 10;
  let name = 'User_';
  for (let i = 0; i < length; i++) {
    name += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return name;
}

function sendPostRequest(name) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ name });

    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/users/register',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
      },
    };

    const req = http.request(options, (res) => {
      res.on('data', () => {}); // Bisa dibaca jika ingin
      res.on('end', () => resolve(res.statusCode));
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  for (let i = 0; i < TOTAL_REQUESTS; i += BATCH_SIZE) {
    const batch = [];

    for (let j = 0; j < BATCH_SIZE && (i + j) < TOTAL_REQUESTS; j++) {
      const randomName = getRandomName();
      batch.push(sendPostRequest(randomName));
    }

    try {
      await Promise.all(batch);
      console.log(`Batch ${i + BATCH_SIZE} dari ${TOTAL_REQUESTS} selesai`);
    } catch (err) {
      console.error('Error saat request:', err.message);
    }

    await delay(DELAY_MS);
  }
}

main();
