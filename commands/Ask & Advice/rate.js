const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const _ = require('lodash');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text'],
      requiredPermissions: ['EMBED_LINKS'],
      cooldown: 10,
      description: 'Rate something',
      usage: '<thing:string>',
      quotedStringSupport: true,
    });
  }

  async run(msg, [thing]) {
    return msg.send(
      new MessageEmbed({
        title: `I'd rate **${thing}**...`,
        description: `${_.round(_.random(9) + 1, 1)}/10`,
        color: 0x2196f3,
      }),
    );
  }
***REMOVED***
