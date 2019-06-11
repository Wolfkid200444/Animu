//Dependencies
const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const mongoose = require('mongoose');
const prompt = require('discordjs-prompter');

//Init
const Action = mongoose.model('Action');

//Main
module.exports = class AddActionCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'addaction',
      aliases: [],
      group: 'advancedmod',
      userPermissions: ['MANAGE_GUILD'],
      memberName: 'addaction',
      throttling: {
        usages: 1,
        duration: 5
      },
      description: 'Add a new Action/Action GIF',
      examples: ['addAction'],
      args: [
        {
          key: 'actionName',
          prompt: 'Which action do you want to add Gif for?',
          type: 'string'
        },
        {
          key: 'gifUrl',
          prompt: "What's the URL of the gif? (must be ending with .gif)",
          type: 'string'
        },
        {
          key: 'pastTense',
          prompt:
            "What's the past tense of this action? (eg: past tense of punch is punched)",
          type: 'string',
          default: ''
        },
        {
          key: 'requireConsent',
          prompt: 'Should this action require consent?',
          type: 'boolean',
          default: false
        }
      ]
    });
  }

  async run(msg, { actionName, gifUrl, pastTense, requireConsent }) {
    const action = await Action.findOne({
      name: actionName.toLowerCase()
    }).exec();

    if (!action) {
      const res = await prompt.reaction(msg.channel, {
        question: `The action for which you are adding URL doesn't exist, would you like to create new action named \`${actionName}\`(Please make sure there's no typo)`,
        userId: msg.author.id
      });

      if (!res || res === 'no')
        return msg.embed(
          new RichEmbed()
            .setTitle('Cancelled')
            .setDescription('New action creation is cancelled')
            .setColor('#f44336')
        );

      await new Action({
        name: actionName.toLowerCase(),
        pastTense,
        requireConsent,
        urls: [gifUrl.trim()]
      }).save();

      return msg.embed(
        new RichEmbed()
          .setTitle('New action created')
          .setDescription(`New action, \`${actionName}\` is created`)
          .setColor('#2196f3')
      );
    } else {
      action.urls.push(gifUrl.trim());
      await action.save();

      return msg.embed(
        new RichEmbed()
          .setTitle('New GIF added')
          .setDescription(`New GIF is added for action \`${actionName}\``)
          .setColor('#2196f3')
      );
    }
  }
***REMOVED***
