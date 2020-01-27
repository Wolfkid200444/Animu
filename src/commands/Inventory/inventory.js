const { Command } = require('klasa');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text', 'dm', 'group'],
      aliases: ['i', 'inv'],
      requiredPermissions: ['EMBED_LINKS'],
      cooldown: 10,
      description: 'View inventory',
      extendedHelp:
        "View your own inventory or your partner's inventory, to view your partners's inventory, use true at the end",
      usage: '[partner:boolean]',
    });
  }

  async run(msg, [partner = false]) {
    const member = msg.author;
    msg.sendEmbed(await member.getInventoryEmbed(partner));
  }
};
