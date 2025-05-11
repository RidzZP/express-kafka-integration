const express = require('express');
const router = express.Router();
const kafkaController = require('../controller/testKafka.controller');
const userController = require('../controller/user.controller');

// Route utama
router.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'API berjalan dengan baik'
  });
});

// Route untuk mengirim pesan ke Kafka
router.post('/kafka/send-message', kafkaController.sendMessage);

// Route untuk User
router.post('/users/register', userController.register);

module.exports = router;