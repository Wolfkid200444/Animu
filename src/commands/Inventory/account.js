const { Command } = require('klasa');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text', 'dm', 'group'],
      requiredPermissions: ['EMBED_LINKS'],
      cooldown: 10,
      description: 'Get details about your bank account',
    });
  }

  async run(msg) {
    msg.sendEmbed(await msg.author.getAccountEmbed());
  }
};
