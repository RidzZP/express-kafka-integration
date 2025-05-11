const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

// Import routes
const indexRouter = require('./routes/index');

// Import Kafka service
const kafkaService = require('./services/kafka');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON body
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded body

// Routes
app.use('/api', indexRouter);

// Middleware error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Terjadi kesalahan pada server'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Route tidak ditemukan'
  });
});

// Fungsi untuk menghubungkan ke Kafka
const connectKafka = async () => {
  try {
    const connected = await kafkaService.connect();
    if (connected) {
      console.log('Koneksi ke Kafka berhasil');
      // Jalankan consumer setelah terhubung
      await kafkaService.runConsumer();
    } else {
      console.error('Gagal terhubung ke Kafka');
    }
  } catch (error) {
    console.error('Error saat menghubungkan ke Kafka:', error);
  }
};

// Start server
app.listen(PORT, async () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
  
  // Hubungkan ke Kafka setelah server berjalan
  await connectKafka();
});

// Tangani proses keluar dengan baik
process.on('SIGINT', async () => {
  try {
    await kafkaService.disconnect();
    console.log('Aplikasi ditutup dengan baik');
    process.exit(0);
  } catch (error) {
    console.error('Error saat menutup aplikasi:', error);
    process.exit(1);
  }
});

module.exports = app;