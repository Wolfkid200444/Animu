const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const mongoose = require('mongoose');
const _ = require('lodash');

//Init
const Reaction = mongoose.model('Reaction');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text'],
      aliases: ['r', 'reaction'],
      requiredPermissions: ['EMBED_LINKS'],
      cooldown: 5,
      description: 'Express your reactions',
      extendedHelp: 'Express different reactions',
      usage: '<reactionName:string>',
      usageDelim: ' ',
    });
  }

  async run(msg, [reactionName]) {
    const reaction = await Reaction.findOne({
      name: reactionName.toLowerCase(),
    }).exec();

    if (!reaction)
      return msg.sendEmbed(
        new MessageEmbed()
          .setTitle('Reaction not found')
          .setDescription(`The reaction you're trying to use doesn't exist`)
          .setColor('#f44336'),
      );

    return msg.sendEmbed(
      new MessageEmbed()
        .setTitle(`${msg.member.displayName} is ${reactionName}`)
        .setImage(_.sample(reaction.urls))
        .setColor('#2196f3'),
    );
  }
***REMOVED***
