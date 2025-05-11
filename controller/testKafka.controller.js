// controllers/kafkaController.js
const kafkaService = require('../services/kafka');
const kafkaConfig = require('../config/kafka');

/**
 * Controller untuk menangani operasi terkait Kafka
 */
class KafkaController {
  async sendMessage(req, res) {
    try {
      const { message } = req.body;
      
      if (!message) {
        return res.status(400).json({
          status: 'error',
          message: 'Pesan tidak boleh kosong'
        });
      }
      
      const sent = await kafkaService.sendMessage(kafkaConfig.topics.order, message);
      
      if (sent) {
        return res.status(200).json({
          status: 'success',
          message: 'Pesan berhasil dikirim ke Kafka'
        });
      } else {
        return res.status(500).json({
          status: 'error',
          message: 'Gagal mengirim pesan ke Kafka'
        });
      }
    } catch (error) {
      console.error('Error saat mengirim pesan:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Terjadi kesalahan saat mengirim pesan'
      });
    }
  }
}

module.exports = new KafkaController();