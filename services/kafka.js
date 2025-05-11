// services/kafka.js
const { Kafka } = require('kafkajs');
const kafkaConfig = require('../config/kafka');
const userConsumer = require('./user.consumer');

// Inisialisasi client Kafka
const kafka = new Kafka({
  clientId: kafkaConfig.clientId,
  brokers: kafkaConfig.brokers,
  connectionTimeout: kafkaConfig.connectionTimeout,
  retry: kafkaConfig.retry
});

// Inisialisasi producer
const producer = kafka.producer();

// Inisialisasi consumer
const consumer = kafka.consumer({ groupId: 'ag-flow-consumer-group' });

// Fungsi untuk menghubungkan ke Kafka
const connect = async () => {
  try {
    // Connect producer
    await producer.connect();
    console.log('Kafka Producer terhubung');
    
    // Connect consumer
    await consumer.connect();
    console.log('Kafka Consumer terhubung');
    
    // Subscribe ke topic
    await consumer.subscribe({ 
      topic: kafkaConfig.topics.order, 
      fromBeginning: false 
    });
    
    console.log(`Consumer berlangganan ke topic: ${kafkaConfig.topics.order}`);
    
    return true;
  } catch (error) {
    console.error('Error saat menghubungkan ke Kafka:', error);
    return false;
  }
};

// Fungsi untuk memproses pesan
const runConsumer = async () => {
  try {
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const messageValue = message.value.toString();
        
        console.log({
          topic,
          partition,
          offset: message.offset,
          value: messageValue.substring(0, 100) + (messageValue.length > 100 ? '...' : '') // Truncate panjang log
        });
        
        try {
          // Proses pesan berdasarkan topiknya
          if (topic === kafkaConfig.topics.order) {
            await userConsumer.processMessage(messageValue);
          }
        } catch (processError) {
          console.error('Error saat memproses pesan:', processError);
        }
      },
    });
    
    console.log('Kafka Consumer berjalan dan mendengarkan pesan baru');
  } catch (error) {
    console.error('Error saat menjalankan consumer:', error);
  }
};

// Fungsi untuk mengirim pesan
const sendMessage = async (topic, message) => {
  try {
    // Cek apakah producer terhubung, jika tidak coba connect lagi
    if (!producer.isConnected) {
      await producer.connect();
    }
    
    const messageValue = typeof message === 'string' ? message : JSON.stringify(message);
    
    await producer.send({
      topic,
      messages: [{ value: messageValue }],
    });
    
    console.log(`Pesan berhasil dikirim ke topic ${topic}`);
    return true;
  } catch (error) {
    console.error('Error saat mengirim pesan ke Kafka:', error);
    return false;
  }
};

// Fungsi untuk menutup koneksi
const disconnect = async () => {
  try {
    await producer.disconnect();
    await consumer.disconnect();
    console.log('Koneksi Kafka ditutup');
    return true;
  } catch (error) {
    console.error('Error saat menutup koneksi Kafka:', error);
    return false;
  }
};

module.exports = {
  kafka,
  producer,
  consumer,
  connect,
  runConsumer,
  sendMessage,
  disconnect
};