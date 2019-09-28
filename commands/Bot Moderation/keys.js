const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const { model } = require('mongoose');

const Key = model('Key');
const Guild = model('Guild');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text', 'dm', 'group'],
      aliases: ['getkeys', 'viewkeys'],
      cooldown: 10,
      permissionLevel: 8,
      description: 'View Keys',
    });
  }

  async run(msg) {
    const keys = await Key.find({}).exec();

    let str = '';

    keys.forEach(async (key, i) => {
      const guild = await Guild.findOne({ key: key.key }).exec();

      if (guild)
        str += `**${key.key}** (${key.version}) - ${
          this.client.guilds.get(guild.guildID).name
        }\n`;
      else str += `**${key.key}** (${key.version}) - UNUSED\n`;

      if (i === keys.length - 1)
        msg.send(
          new MessageEmbed({
            title: 'Keys',
            description: str,
            color: '#2196f3',
          }),
        );
    });
  }
***REMOVED***
