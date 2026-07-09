// index.js
import Client from './src/core/Client.js';
import logger from './src/utils/Logger.js';

logger.info('Memulai Bootstrap Nexus Framework...');

const bot = new Client();

bot.connect().catch((err) => {
  logger.error(`Gagal menginisialisasi bot: ${err.message}`);
});
