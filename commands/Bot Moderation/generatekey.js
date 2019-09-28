const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const { model } = require('mongoose');
const randomstring = require('randomstring');

const Key = model('Key');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text', 'dm', 'group'],
      aliases: ['genkey', 'keygen'],
      cooldown: 10,
      permissionLevel: 8,
      description: 'Generate Key',
      extendedHelp: 'Generate Animu Subscription Key',
      usage: '<lite|plus|pro> <days:number>',
      usageDelim: ' ',
    });
  }

  async run(msg, [version, days]) {
    const key = randomstring.generate({
      length: 12,
      charset: 'alphanumeric',
      capitalization: 'uppercase',
    });

    await new Key({
      key,
      daysLeft: days,
      version,
    }).save();

    msg.send(
      new MessageEmbed({
        title: 'Key Generated',
        description: `**${key}**\n\nValid for **${days}** days`,
        color: '#2196f3',
      }),
    );
  }
***REMOVED***
