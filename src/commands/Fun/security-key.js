const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const crypto = require('crypto');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text', 'dm', 'group'],
      requiredPermissions: ['EMBED_LINKS'],
      cooldown: 10,
      description: "Get a password that's 100x better than your password",
    });
  }

  async run(msg) {
    msg.send(
      new MessageEmbed()
        .setTitle(`Securiy Key`)
        .setDescription(crypto.randomBytes(15).toString('hex'))
        .setColor('#2196f3')
    );
  }
***REMOVED***
