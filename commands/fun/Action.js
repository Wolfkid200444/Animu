//Dependencies
const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const prompt = require('discordjs-prompter');
const mongoose = require('mongoose');
const nlp = require('compromise');
const _ = require('lodash');

//Init
const Action = mongoose.model('Action');

//Main
module.exports = class ActionCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'action',
      aliases: ['a'],
      group: 'fun',
      memberName: 'action',
      throttling: {
        usages: 1,
        duration: 5
      },
      guildOnly: true,
      description: 'Perform an action with/on someone',
      examples: ['a hug @someone', 'a slap @someone'],
      args: [
        {
          key: 'actionName',
          prompt: 'Which action do you want to perform?',
          type: 'string',
          oneOf: ['hug', 'pat', 'kiss', 'slap', 'punch', 'stab', 'shoot']
        },
        {
          key: 'member',
          prompt: 'Who do you want to perform this action on/with?',
          type: 'member'
        }
      ]
    });
  }

  async run(msg, { actionName, member }) {
    const action = await Action.findOne({
      name: actionName.toLowerCase()
    }).exec();

    if (!action)
      return msg.embed(
        new RichEmbed()
          .setTitle('Action not found')
          .setDescription(
            `Please notify a senior mod or server admin that the \`${actionName}\` action doesn't exist`
          )
          .setColor('#f44336')
      );

    if (action.requireConsent) {
      const res = await prompt.reaction(msg.channel, {
        question: `${member}, do you want to allow ${
          msg.member.displayName
        } to ${action} you?`,
        userId: member.id
      });

      if (!res || res === 'no')
        return msg.embed(
          new RichEmbed()
            .setTitle('Ooops')
            .setDescription(
              `${msg.member}, ${member.displayName} denied your request to ${
                action.name
              } them...`
            )
            .setColor('#2196f3')
        );

      sendReactionImage();
    } else sendReactionImage();

    async function sendReactionImage() {
      return msg.embed(
        new RichEmbed()
          .setTitle(
            `${msg.member.displayName} ${action.pastTense} ${
              member.displayName
            }`
          )
          .setImage(_.sample(action.urls))
          .setColor('#2196f3')
      );
    }
  }
***REMOVED***
