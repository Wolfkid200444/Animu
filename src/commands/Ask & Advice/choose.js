const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const _ = require('lodash');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text', 'dm', 'group'],
      aliases: ['choice', 'choices'],
      requiredPermissions: ['EMBED_LINKS'],
      cooldown: 10,
      description: 'Use this when you have last 2 braincells left',
      usage: '<choices:string>',
      quotedStringSupport: true,
    });
  }

  async run(msg, [choices]) {
    return msg.send(
      new MessageEmbed({
        title: 'You should choose',
        description: _.capitalize(_.sample(choices.split(',')).trim()),
        color: 0x2196f3,
      })
    );
  }
};
