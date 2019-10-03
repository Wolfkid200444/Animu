const { Command } = require('klasa');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text', 'dm', 'group'],
      aliases: ['b', 'badge'],
      requiredPermissions: ['EMBED_LINKS'],
      cooldown: 10,
      description: 'View your badges',
    });
  }

  async run(msg) {
    msg.sendEmbed(await msg.author.getBadgesEmbed(msg.guild.id));
  }
***REMOVED***
