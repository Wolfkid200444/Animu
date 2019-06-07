//Dependencies
const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const mongoose = require('mongoose');
const _ = require('lodash');

//Init
const Reaction = mongoose.model('Reaction');

//Main
module.exports = class RedisCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'react',
      aliases: ['r', 'reaction'],
      group: 'fun',
      memberName: 'react',
      throttling: {
        usages: 1,
        duration: 5
      },
      guildOnly: true,
      description: 'Express your reaction',
      examples: ['react laugh', 'r excited'],
      args: [
        {
          key: 'reactionName',
          prompt: 'Which reaction do you want to perform?',
          type: 'string',
          oneOf: [
            'dabbing',
            'confused',
            'thinking',
            'lewding',
            'crying',
            'smiling',
            'laughing',
            'excited'
          ]
        }
      ]
    });
  }

  async run(msg, { reactionName }) {
    const reaction = await Reaction.findOne({
      name: reactionName.toLowerCase()
    }).exec();

    if (!reaction)
      return msg.embed(
        new RichEmbed()
          .setTitle('Reaction not found')
          .setDescription(
            `Please notify a senior mod or server admin that the \`${reactionName}\` reaction doesn't exist`
          )
          .setColor('#f44336')
      );

    return msg.embed(
      new RichEmbed()
        .setTitle(`${msg.member.displayName} is ${reactionName}`)
        .setImage(_.sample(reaction.urls))
        .setColor('#2196f3')
    );
  }
***REMOVED***
