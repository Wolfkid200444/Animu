const { Command } = require('klasa');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text'],
      cooldown: 120,
      description: 'Setup profile for this guild',
      extendedHelp: 'Set up necessary stuff for this guild',
    });
  }

  async run(msg) {
    msg.sendEmbed(await msg.author.setupProfile(msg.guild.id));
  }
***REMOVED***
