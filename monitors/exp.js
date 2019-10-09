const { Monitor } = require('klasa');

module.exports = class extends Monitor {
  async run(message) {
    if (!require('../data/validGuilds').has(message.guild.id)) return;

    let proceedExp = true;

    for (let i = 0; i < message.guild.settings.ignoreExpChannels.length; i++) {
      const ignoreExpChannel = message.guild.settings.ignoreExpChannels[i];
      if (message.channel.id === ignoreExpChannel) {
        proceedExp = false;
        break;
      }
    }

    if (proceedExp) {
      const res = await message.author.addExp(1, message.guild.id);

      if (typeof res === 'object') {
        res.forEach((roleName) => {
          const role = message.guild.roles.find((r) => r.name === roleName);

          message.member.roles.add(role);
        });
      }
    }
  }
***REMOVED***
