// src/core/Context.js
import config from '../../config/config.js';

class Context {
  constructor(socket, msg) {
    this.socket = socket;
    this.msg = msg;

    // Ekstraksi metadata dasar pesan
    this.from = msg.key.remoteJid;
    this.isGroup = this.from.endsWith('@g.us');
    
    this.sender = this.isGroup 
      ? (msg.key.participant || msg.participant) 
      : this.from;

    this.id = msg.key.id;

    // Identifikasi Tipe Chat berdasarkan standar JID WhatsApp & Baileys
    this.chatType = 'unknown';
    
    if (this.from === 'status@broadcast') {
      this.chatType = 'status';
    } else if (this.from.endsWith('@s.whatsapp.net') || this.from.endsWith('@lid')) {
      // '@s.whatsapp.net' adalah format pengguna standar
      // '@lid' merupakan format ID terenkripsi baru milik pengguna individu WhatsApp
      this.chatType = 'private';
    } else if (this.from.endsWith('@g.us')) {
      // Baileys merepresentasikan grup obrolan biasa sebagai JID akhiran '@g.us'.
      //
      // Catatan Arsitektur WhatsApp Community: 
      // Komunitas (Community) di WhatsApp juga menggunakan akhiran '@g.us' (sebagai grup pengumuman induk / Parent Group).
      // Untuk membedakannya secara mutlak, pengembang harus memeriksa metadata grup tersebut 
      // (misalnya properti 'isCommunity' atau 'isCommunityAnnounce' yang diperoleh dari socket.groupMetadata).
      //
      // Di sini kita menetapkan default sebagai 'group'.
      this.chatType = 'group';
    } else if (this.from.endsWith('@newsletter')) {
      // WhatsApp Channel (Saluran Penyiaran) di dalam protokol WhatsApp Web/Baileys dikenal dengan nama teknis 'newsletter'.
      this.chatType = 'newsletter';
    }

    // Catatan untuk klasifikasi mendatang:
    // - 'channel': Istilah pemasaran konsumen untuk 'newsletter'.
    // - 'community': Grup pengumuman induk ber-JID @g.us dengan metadata khusus 'isCommunityAnnounce'.

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

  async reply(text, options = {}) {
    return await this.socket.sendMessage(
      this.from, 
      { text: text, ...options }, 
      { quoted: this.msg }
    );
  }

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
