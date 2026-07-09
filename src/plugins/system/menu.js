// src/plugins/system/menu.js
import Format from '../../utils/Format.js';
import config from '../../../config/config.js';

export default {
  name: "menu",
  aliases: ["help", "m"],
  category: "System",
  description: "Menampilkan panel bantuan menu Nexus",
  owner: false,
  admin: false,
  group: false,

  async execute(ctx) {
    const pushName = ctx.msg.pushName || "User";
    const commands = ctx.loader.commands;

    // Mengelompokkan seluruh command terdaftar berdasarkan properti kategorinya
    const categories = {};
    commands.forEach(cmd => {
      const cat = cmd.category || "Uncategorized";
      if (!categories[cat]) {
        categories[cat] = [];
      }
      if (!categories[cat].includes(cmd.name)) {
        categories[cat].push(cmd.name);
      }
    });

    const bodyText = "Selamat datang di NexusBot.\nBerikut adalah panel perintah aktif sistem yang dapat Anda gunakan.";
    
    // Menyusun statistik di bagian panel kepala
    const stats = [
      `Prefix   : "${config.prefix}"`,
      `Runtime  : ${formatRuntime(process.uptime())}`
    ];

    // Build halaman menu pembuka
    let menuOutput = Format.main(pushName, bodyText, stats) + '\n\n';

    // Build panel per kategori secara iteratif
    const catPanels = [];
    for (const [catName, cmdList] of Object.entries(categories)) {
      const formattedList = cmdList.map(name => `${config.prefix}${name}`);
      catPanels.push(Format.category(catName, formattedList));
    }

    menuOutput += catPanels.join('\n\n');

    await ctx.reply(menuOutput);
  }
};

// Fungsi penolong pemformatan waktu runtime
function formatRuntime(seconds) {
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  const dDisplay = d > 0 ? `${d} Hari ` : "";
  const hDisplay = h > 0 ? `${h} Jam ` : "";
  const mDisplay = m > 0 ? `${m} Menit ` : "";
  const sDisplay = s > 0 ? `${s} Detik` : "0 Detik";
  return dDisplay + hDisplay + mDisplay + sDisplay;
}
