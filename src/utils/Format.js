// src/utils/Format.js

class Format {
  /**
   * Format pesan utama / sambutan (Main Menu)
   */
  static main(pushName, body, stats = []) {
    const lines = body.split('\n').map(line => `│ ${line}`).join('\n');
    const statSection = stats.length > 0 
      ? `\n├──────────────\n${stats.map(s => `│ ${s}`).join('\n')}` 
      : '';
    return `╭─〔 Nexus Bot 〕\n│\n│ 👋 Halo, ${pushName}\n│\n${lines}${statSection}\n╰──────────────`;
  }

  /**
   * Format dasar box panel berbingkai header kustom
   */
  static header(title, body) {
    const lines = body.split('\n').map(line => `│ ${line}`).join('\n');
    return `╭─〔 ${title} 〕\n│\n${lines}\n╰────────────`;
  }

  /**
   * Format box kategori menu (Category Panel)
   */
  static category(title, items) {
    const lines = items.map(item => `│ • ${item}`).join('\n');
    return `╭─⌬ ${title}\n${lines}\n╰────────────`;
  }

  /**
   * Format sukses
   */
  static success(body) {
    return this.header('✅ Success', body);
  }

  /**
   * Format error
   */
  static error(body) {
    return this.header('❌ Error', body);
  }

  /**
   * Format informasi / umum
   */
  static info(title, body) {
    return this.header(`ℹ️ ${title}`, body);
  }

  /**
   * Format custom (misal: panel Owner)
   */
  static custom(title, body) {
    return this.header(title, body);
  }
}

export default Format;
