// src/plugins/system/botinfo.js
import Format from '../../utils/Format.js';
import config from '../../../config/config.js';
import os from 'os';

export default {
  name: "botinfo",
  aliases: ["info", "bot"],
  category: "System",
  description: "Menampilkan informasi spesifikasi sistem bot",
  owner: false,
  admin: false,
  group: false,

  async execute(ctx) {
    const totalMem = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);
    const freeMem = (os.freemem() / 1024 / 1024 / 1024).toFixed(2);
    const usedMem = (totalMem - freeMem).toFixed(2);
    
    const infoText = [
      `Nama Bot : ${config.botName}`,
      `Prefix   : "${config.prefix}"`,
      `Platform : ${os.platform()} (${os.arch()})`,
      `Engine   : Node.js ${process.version}`,
      `RAM      : ${usedMem} GB / ${totalMem} GB`,
      `CPU      : ${os.cpus()[0].model}`
    ].join('\n');

    await ctx.reply(Format.info('Bot Information', infoText));
  }
};
