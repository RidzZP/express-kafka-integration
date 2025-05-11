// controllers/userController.js
const kafkaService = require('../services/kafka');
const kafkaConfig = require('../config/kafka');

class UserController {
  constructor() {
    // Bind methods ke instance untuk mempertahankan konteks 'this'
    this.register = this.register.bind(this);
    this.generateRequestId = this.generateRequestId.bind(this);
  }

  async register(req, res) {
    try {
      const userData = req.body;
      console.log('Received user data:', userData);
      
      // Validate using name property
      const userName = userData.name;
      
      // Validasi data user
      if (!userName) {
        return res.status(200).json({
          status: 'error',
          message: 'Name tidak boleh kosong',
          requestId: this.generateRequestId()
        });
      }
      
      // Generate ID unik untuk tracking request
      const requestId = this.generateRequestId();
      
      // Normalisasi data sebelum dikirim ke Kafka
      const normalizedUserData = {
        name: userName
      };
      
      // Kirim data user ke Kafka untuk diproses
      kafkaService.sendMessage(kafkaConfig.topics.order, {
        type: 'USER_REGISTER',
        data: normalizedUserData,
        requestId,
        timestamp: new Date().toISOString()
      });
      
      // Selalu kembalikan 200 meskipun proses di background
      return res.status(200).json({
        status: 'success',
        message: 'Permintaan pendaftaran diterima',
        requestId
      });
    } catch (error) {
      console.error('Error saat mendaftarkan user:', error);
      
      // Tetap kembalikan 200 meskipun ada error (dengan status 'error')
      return res.status(200).json({
        status: 'error',
        message: 'Permintaan pendaftaran diterima tetapi terjadi kesalahan',
        requestId: this.generateRequestId()
      });
    }
  }
  
  /**
   * Menghasilkan ID unik untuk tracking request
   */
  generateRequestId() {
    return `req-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }
}

module.exports = new UserController();