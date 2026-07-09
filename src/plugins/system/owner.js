// src/plugins/system/owner.js
import Format from '../../utils/Format.js';

export default {
  name: "owner",
  aliases: ["creator"],
  category: "System",
  description: "Menampilkan kontak pembuat bot",
  owner: false,
  admin: false,
  group: false,

  async execute(ctx) {
    const ownerDetail = `Nama  : Irhas Raykhan\nNomor : +6285135044757`;
    
    // 1. Mengirimkan visual box Owner info
    await ctx.reply(Format.custom('👑 Owner', ownerDetail));

    // 2. Mengirimkan berkas vCard agar pengguna dapat langsung menyentuh & menyimpan nomor owner
    const vcard = 'BEGIN:VCARD\n'
                + 'VERSION:3.0\n'
                + 'FN:Irhas Raykhan\n'
                + 'ORG:Nexus Creator;\n'
                + 'TEL;type=CELL;type=VOICE;waid=6285135044757:+6285135044757\n'
                + 'END:VCARD';

    await ctx.socket.sendMessage(ctx.from, {
      contacts: {
        displayName: 'Irhas Raykhan',
        contacts: [{ vcard }]
      }
    }, { quoted: ctx.msg });
  }
};
