const { Command } = require('klasa');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text'],
      requiredPermissions: ['EMBED_LINKS'],
      cooldown: 10,
      description: 'Give Coins or some item to another user',
      usage: '<coins|item> <member:user> <value:...string>',
      usageDelim: ' ',
      quotedStringSupport: true,
    });
  }

  async run(msg, [type, member, value]) {
    msg.sendEmbed(await msg.author.give(type, value, member));
  }
};
