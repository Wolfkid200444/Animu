const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const mongoose = require('mongoose');
const prompt = require('discordjs-prompter');

//Init
const Reaction = mongoose.model('Reaction');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text', 'dm', 'group'],
      aliases: ['addreact', 'addr'],
      bucket: 2,
      cooldown: 5,
      permissionLevel: 8,
      description: 'Add Reaction',
      extendedHelp:
        'Add a gif for an existing reaction or create a new reaction. First argument is the reactionName while second argument is url for the gif to add for that reaction',
      usage: '<reactionName:string> <gifURL:string>',
      usageDelim: ' '
    });
  }

  async run(msg, [reactionName, gifURL]) {
    const reaction = await Reaction.findOne({
      name: reactionName.toLowerCase()
    }).exec();

    if (!reaction) {
      const res = await prompt.reaction(msg.channel, {
        question: `The reaction for which you are adding URL doesn't exist, would you like to create new reaction named \`${reactionName}\`(Please make sure there's no typo)`,
        userId: msg.author.id
      });

      if (!res || res === 'no')
        return msg.sendEmbed(
          new MessageEmbed()
            .setTitle('Cancelled')
            .setDescription('New reaction creation is cancelled')
            .setColor('#f44336')
        );

      await new Reaction({
        name: reactionName.toLowerCase(),
        urls: [gifURL.trim()]
      }).save();

      return msg.sendEmbed(
        new MessageEmbed()
          .setTitle('New reaction created')
          .setDescription(`New reaction, \`${reactionName}\` is created`)
          .setColor('#2196f3')
      );
    } else {
      reaction.urls.push(gifURL.trim());
      await reaction.save();

      return msg.sendEmbed(
        new MessageEmbed()
          .setTitle('New GIF added')
          .setDescription(`New GIF is added for reaction \`${reactionName}\``)
          .setColor('#2196f3')
      );
    }
  }
***REMOVED***
