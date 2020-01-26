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
      description: 'Hug someone and make their day a little better',
      usage: '<member:member>',
    });
  }

  async run(msg, [member]) {
    const action = await Action.findOne({
      name: 'hug',
    }).exec();

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
