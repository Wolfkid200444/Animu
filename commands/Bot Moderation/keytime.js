const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const { model } = require('mongoose');

const Key = model('Key');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text', 'dm', 'group'],
      aliases: ['genkey', 'keygen'],
      cooldown: 10,
      permissionLevel: 8,
      description: 'Increase days of a key',
      usage: '<key:string> <daysToIncrease:number>',
      usageDelim: ' ',
    });
  }

  async run(msg, [key, daysToIncrease]) {
    const keyDB = await Key.findOne({ key }).exec();

    if (!keyDB)
      return msg.send(
        new MessageEmbed({
          title: 'Invalid Key',
          description: "Key doesn't exist",
          color: '#f44336',
        }),
      );

    keyDB.daysLeft += daysToIncrease;

    await keyDB.save();

    msg.send(
      new MessageEmbed({
        title: 'Key Updated',
        description: 'Key successfully updated',
        color: '#2196f3',
      }),
    );
  }
***REMOVED***
