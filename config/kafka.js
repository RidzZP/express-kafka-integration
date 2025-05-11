// config/kafka.js
require('dotenv').config();

module.exports = {
  clientId: 'ag-flow-app',
  brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
  topics: {
    order: process.env.KAFKA_TOPIC_ORDER || 'AgFlowOrder'
  },
  // Konfigurasi tambahan jika diperlukan
  connectionTimeout: 3000,
  retry: {
    initialRetryTime: 100,
    retries: 8
  }
};