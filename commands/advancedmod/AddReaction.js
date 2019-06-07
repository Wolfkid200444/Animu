//Dependencies
const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const mongoose = require('mongoose');
const prompt = require('discordjs-prompter');

//Init
const Reaction = mongoose.model('Reaction');

//Main
module.exports = class RedisCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'addreaction',
      aliases: [],
      group: 'advancedmod',
      memberName: 'addreaction',
      throttling: {
        usages: 1,
        duration: 5
      },
      description: 'Add a new Reaction/Reaction GIF',
      examples: ['addReaction'],
      args: [
        {
          key: 'reactionName',
          prompt: 'Which reaction do you want to add Gif for?',
          type: 'string'
        },
        {
          key: 'gifUrl',
          prompt: "What's the URL of the gif? (must be ending with .gif)",
          type: 'string'
        }
      ]
    });
  }

  async run(msg, { reactionName, gifUrl }) {
    const reaction = await Reaction.findOne({
      name: reactionName.toLowerCase()
    }).exec();

    if (!reaction) {
      const res = await prompt.reaction(msg.channel, {
        question: `The reaction for which you are adding URL doesn't exist, would you like to create new reaction named \`${reactionName}\`(Please make sure there's no typo)`,
        userId: msg.author.id
      });

      if (!res || res === 'no')
        return msg.embed(
          new RichEmbed()
            .setTitle('Cancelled')
            .setDescription('New reaction creation is cancelled')
            .setColor('#f44336')
        );

      await new Reaction({
        name: reactionName.toLowerCase(),
        urls: [gifUrl.trim()]
      }).save();

      return msg.embed(
        new RichEmbed()
          .setTitle('New reaction created')
          .setDescription(`New reaction, \`${reactionName}\` is created`)
          .setColor('#2196f3')
      );
    } else {
      reaction.urls.push(gifUrl.trim());
      await reaction.save();

      return msg.embed(
        new RichEmbed()
          .setTitle('New GIF added')
          .setDescription(`New GIF is added for reaction \`${reactionName}\``)
          .setColor('#2196f3')
      );
    }
  }
***REMOVED***
