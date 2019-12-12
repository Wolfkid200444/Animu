const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const mongoose = require('mongoose');
const prompt = require('discordjs-prompter');
const _ = require('lodash');

//Init
const Action = mongoose.model('Action');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text'],
      aliases: ['a'],
      requiredPermissions: ['EMBED_LINKS'],
      cooldown: 5,
      description: 'Wanna punch someone?',
      usage: '<actionName:string> <member:member>',
      usageDelim: ' ',
    });
  }

  async run(msg, [actionName, member]) {
    const action = await Action.findOne({
      name: actionName.toLowerCase(),
    }).exec();

    if (!action)
      return msg.sendEmbed(
        new MessageEmbed()
          .setTitle('Action not found')
          .setDescription(
            `Please notify a senior mod or server admin that the \`${actionName}\` action doesn't exist`
          )
          .setColor('#f44336')
      );

    if (action.requireConsent) {
      const res = await prompt.reaction(msg.channel, {
        question: `${member}, do you want to allow ${msg.member.displayName} to ${action.name} you?`,
        userId: member.id,
        timeout: 60000,
      });

      if (!res || res === 'no')
        return msg.sendEmbed(
          new MessageEmbed()
            .setTitle('Ooops')
            .setDescription(
              `${msg.member}, ${member.displayName} denied your request to ${action.name} them...`
            )
            .setColor('#2196f3')
        );

      this.sendReactionImage(msg, action, member);
    } else this.sendReactionImage(msg, action, member);
  }

  async sendReactionImage(msg, action, member) {
    return msg.sendEmbed(
      new MessageEmbed()
        .setTitle(
          `${msg.member.displayName} ${action.pastTense} ${member.displayName}`
        )
        .setImage(_.sample(action.urls))
        .setColor('#2196f3')
    );
  }
***REMOVED***
