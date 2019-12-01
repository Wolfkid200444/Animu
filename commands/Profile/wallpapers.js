const { Command } = require('klasa');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text', 'dm', 'group'],
      aliases: ['profile-wallpapers', 'wp'],
      requiredPermissions: ['EMBED_LINKS'],
      cooldown: 10,
      description: 'View your profile wallpapers',
    });
  }

  async run(msg) {
    msg.sendEmbed(await msg.author.getWallpapersEmbed());
  }
***REMOVED***
