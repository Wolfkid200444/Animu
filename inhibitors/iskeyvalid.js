const { Inhibitor } = require('klasa');
const { model } = require('mongoose');

const Guild = model('Guild');
const Key = model('Key');

module.exports = class extends Inhibitor {
  constructor(...args) {
    super(...args, {
      name: 'iskeyvlaid',
      enabled: true,
      spamProtection: false,
    });
  }

  async run(message, command) {
    if (command.name === 'registerguild') return false;
    else if (!require('../data/validGuilds').has(message.guild.id)) return true;
    else return false;
  }

  async init() {
    const guilds = await Guild.find({}).exec();

    guilds.forEach(async (guild) => {
      const key = await Key.findOne({ key: guild.key }).exec();

      if (key.daysLeft != 0) require('../data/validGuilds').add(guild.guildID);
    });

    require('../data/validGuilds').add('628931282851856394'); //Adding Dev Server
  }
***REMOVED***
