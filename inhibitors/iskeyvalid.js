const { Inhibitor } = require('klasa');
const { model } = require('mongoose');
const _ = require('lodash');

const Guild = model('Guild');
const Key = model('Key');

module.exports = class extends Inhibitor {
  constructor(...args) {
    super(...args, {
      name: 'iskeyvlaid',
      enabled: true,
      spamProtection: false,
    });

    this.validGuilds = [];
  }

  async run(message, command) {
    if (command.name === 'registerguild') return false;
    else if (!_.includes(this.validGuilds, message.guild.id)) return true;
    else return false;
  }

  async init() {
    const guilds = await Guild.find({}).exec();

    guilds.forEach(async (guild) => {
      const key = await Key.findOne({ key: guild.key }).exec();

      if (key != 0) this.validGuilds.push(guild.guildID);
    });
  }
***REMOVED***
