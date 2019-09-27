const { Event } = require('klasa');

module.exports = class extends Event {
  async run(message) {
    let proceedExp = true;

    for (let i = 0; i < message.guild.settings.ignoreExpChannels.length; i++) {
      const ignoreExpChannel = message.guild.settings.ignoreExpChannels[i];
      if (message.channel.id === ignoreExpChannel) {
        proceedExp = false;
        break;
      }
    }

    if (proceedExp) {
      message.author.addExp(1, message.guild.id);
    }
  }
***REMOVED***
