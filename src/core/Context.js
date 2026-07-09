// src/core/Context.js
import config from '../../config/config.js';

class Context {
  constructor(socket, msg) {
    this.socket = socket;
    this.msg = msg;

    // Ekstraksi metadata dasar pesan
    this.from = msg.key.remoteJid;
    this.isGroup = this.from.endsWith('@g.us');
    
    // Menentukan JID pengirim (apabila di grup, ambil participant)
    this.sender = this.isGroup 
      ? (msg.key.participant || msg.participant) 
      : this.from;

    this.id = msg.key.id;

    // Ekstraksi string isi pesan dari beragam jenis tipe pesan WhatsApp
    const messageType = Object.keys(msg.message || {})[0];
    this.body = '';
    
    if (messageType === 'conversation') {
      this.body = msg.message.conversation;
    } else if (messageType === 'extendedTextMessage') {
      this.body = msg.message.extendedTextMessage.text;
    } else if (messageType === 'imageMessage') {
      this.body = msg.message.imageMessage.caption;
    } else if (messageType === 'videoMessage') {
      this.body = msg.message.videoMessage.caption;
    }

    this.body = this.body || '';

    // Memeriksa dan mengekstrak prefix, command, dan argument secara otomatis
    const hasPrefix = this.body.startsWith(config.prefix);
    this.prefix = hasPrefix ? config.prefix : '';
    
    const cleanBody = hasPrefix ? this.body.slice(config.prefix.length).trim() : this.body.trim();
    const parts = cleanBody.split(/\s+/);
    
    this.command = hasPrefix ? parts[0].toLowerCase() : '';
    this.args = hasPrefix && parts[0] !== '' ? parts.slice(1) : parts;
  }

  /**
   * Mengirim pesan teks balasan langsung kepada pengirim saat ini
   * @param {string} text - Pesan teks yang ingin dikirim
   * @param {object} options - Parameter tambahan opsional dari Baileys
   */
  async reply(text, options = {}) {
    return await this.socket.sendMessage(
      this.from, 
      { text: text, ...options }, 
      { quoted: this.msg } // Mengutip pesan asli agar terlihat sebagai balasan/reply
    );
  }

  /**
   * Mengirim reaksi emoji terhadap pesan saat ini
   * @param {string} emoji - Karakter emoji tunggal
   */
  async react(emoji) {
    return await this.socket.sendMessage(this.from, {
      react: {
        text: emoji,
        key: this.msg.key
      }
    });
  }
}

export default Context;
