const { Command, Timestamp } = require('klasa');
const { MessageEmbed } = require('discord.js');
const moment = require('moment');
const { model } = require('mongoose');
const _ = require('lodash');

const Guild = model('Guild');
const Key = model('Key');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text'],
      aliases: ['guild', 'server', 'serverinfo', 'sinfo'],
      description: 'Get information on the current server.',
      cooldown: 10,
      extendedHelp:
        'Get information about this server, including creation date, filter/verification level, member count and other details',
    });
    this.verificationLevels = [
      'None',
      'Low',
      'Medium',
      '(╯°□°）╯︵ ┻━┻',
      '┻━┻ ﾐヽ(ಠ益ಠ)ノ彡┻━┻',
    ];

    this.filterLevels = ['Off', 'No Role', 'Everyone'];
    this.timestamp = new Timestamp('d MMMM YYYY');
  }

  async run(msg) {
    const guild = await Guild.findOne({ guildID: msg.guild.id }).exec();

    if (!guild) return false;

    const key = await Key.findOne({ key: guild.key }).exec();

    return msg.sendEmbed(
      new MessageEmbed()
        .setColor(
          key.version === 'lite'
            ? '#ffeb3b'
            : key.version === 'plus'
            ? '#f44336'
            : '#9c27b0',
        )
        .setThumbnail(msg.guild.iconURL())
        .addField('❯ Name', msg.guild.name, true)
        .addField('❯ ID', msg.guild.id, true)
        .addField(
          '❯ Creation Date',
          this.timestamp.display(msg.guild.createdAt),
          true,
        )
        .addField('❯ Region', msg.guild.region, true)
        .addField(
          '❯ Explicit Filter',
          this.filterLevels[msg.guild.explicitContentFilter],
          true,
        )
        .addField(
          '❯ Verification Level',
          this.verificationLevels[msg.guild.verificationLevel],
          true,
        )
        .addField(
          '❯ Server Age',
          `${moment().diff(msg.guild.createdAt, 'M')} Months`,
          true,
        )
        .addField('❯ Members', msg.guild.memberCount, true)
        .setFooter(`Animu ${_.capitalize(key.version)}`),
    );
  }
***REMOVED***
