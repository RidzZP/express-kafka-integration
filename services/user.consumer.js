// services/userConsumer.js
const {User} = require('../models');

/**
 * Service untuk menangani pesan user dari Kafka
 */
class UserConsumer {
  async processMessage(message) {
    try {
      // Parse pesan
      const messageData = typeof message === 'string' ? JSON.parse(message) : message;
      
      // Cek tipe pesan
      if (messageData.type === 'USER_REGISTER') {
        await this.processUserRegistration(messageData.data, messageData.requestId);
      } else {
        console.warn(`Tipe pesan tidak dikenali: ${messageData.type}`);
      }
    } catch (error) {
      console.error('Error saat memproses pesan user:', error);
    }
  }
  
  async processUserRegistration(userData, requestId) {
    try {
      console.log(`[${requestId}] Memproses pendaftaran user: ${userData.name}`);
      
      // Cek jika user sudah ada
      const existingUser = await User.findOne({ where: { name: userData.name } });
      
      if (existingUser) {
        console.log(`[${requestId}] User dengan name ${userData.name} sudah terdaftar`);
        return;
      }
      
      // Simpan user ke database
      const newUser = await User.create({
        name: userData.name,
        date_added: new Date(),
        date_modified: new Date()
      });
      
      console.log(`[${requestId}] User berhasil didaftarkan dengan ID: ${newUser.id}`);
    } catch (error) {
      console.error(`[${requestId}] Error saat mendaftarkan user:`, error);
      
      // Di sini bisa ditambahkan logika retry atau penyimpanan log error
      // Contoh: Kirim pesan ke topic Kafka khusus untuk error handling
    }
  }
}

module.exports = new UserConsumer();