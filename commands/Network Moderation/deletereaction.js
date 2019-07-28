const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const mongoose = require('mongoose');

//Init
const Reaction = mongoose.model('Reaction');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text', 'dm', 'group'],
      aliases: ['deletereact', 'delr', 'remr', 'removereaction', 'removereact'],
      bucket: 2,
      cooldown: 5,
      permissionLevel: 8,
      description: 'Delete reaction',
      extendedHelp: 'Delete a reaction by reaction name',
      usage: '<reactionName:string>'
    });
  }

  async run(msg, [reactionName]) {
    const reaction = await Reaction.findOne({
      name: reactionName.toLowerCase()
    }).exec();

    if (!reaction)
      return msg.sendEmbed(
        new MessageEmbed()
          .setTitle('Reaction not found')
          .setDescription(
            "The reaction you're trying to delete doesn't exist, please double check your spelling and capitalization"
          )
          .setColor('#f44336')
      );

    await Reaction.deleteOne({ name: reactionName.toLowerCase() }).exec();

    msg.sendEmbed(
      new MessageEmbed()
        .setTitle('Reaction Deleted')
        .setDescription(`\`${reactionName}\` reaction was successfully deleted`)
        .setColor('#2196f3')
    );
  }
***REMOVED***
