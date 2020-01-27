const { Command } = require('klasa');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text', 'dm', 'group'],
      aliases: ['useitem', 'use-item'],
      requiredPermissions: ['EMBED_LINKS'],
      cooldown: 10,
      description: 'Use an item from inventory',
      usage: '<itemName:...string>',
      quotedStringSupport: true,
    });
  }

  async run(msg, [itemName]) {
    const member = msg.author;
    msg.sendEmbed(await member.useItem(itemName, msg.guild.id));
  }
};
