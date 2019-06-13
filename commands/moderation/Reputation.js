//Dependencies
const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const mongoose = require('mongoose');
const { changeReputation } = require('../../helpers/profile');

//Init
const Profile = mongoose.model('Profile');

//Main
module.exports = class ReputationCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'reputation',
      aliases: [],
      group: 'moderation',
      userPermissions: ['MANAGE_ROLES'],
      memberName: 'reputation',
      throttling: {
        usages: 1,
        duration: 5
      },
      description: "Increase/Decrease a member's reputation",
      examples: ['reputation'],
      args: [
        {
          key: 'member',
          prompt:
            "Which member's reputation would you like to increase/decrease?",
          type: 'member'
        },
        {
          key: 'change',
          prompt:
            'Do you want to increase or decrease their reputation? (+, -)',
          type: 'string',
          oneOf: ['+', '-']
        },
        {
          key: 'rep',
          prompt: 'How much reputation would you like to increase/decrease?',
          type: 'integer',
          min: 1,
          max: 100
        }
      ]
    });
  }

  async run(msg, { member, change, rep }) {
    if (
      member.roles.find(r => {
        return (
          r.name === 'Moderator' ||
          r.name === 'Senior Moderator' ||
          r.name === '👑 Server Admin 👑'
        );
      })
    )
      return msg.embed(
        new RichEmbed()
          .setTitle("Can't change reputation of mod/server admin")
          .setColor('#f44336')
      );

    await changeReputation(member.id, change, rep);

    const profileCheck = await Profile.findOne({ memberID: member.id }).exec();

    if (profileCheck.reputation <= 20)
      member.send(
        new RichEmbed()
          .setTitle('Low Reputation')
          .setDescription(
            `Your reputation has dropped to ${
              profileCheck.reputation
            }, you're in gray zone and can be banned at any time unless you improve your reputation`
          )
          .setColor('#f44336')
      );

    if (profileCheck.reputation <= 0) {
      profileCheck.reputation = 20;
      await member.send(
        'Your reputation has dropped to 0, thus you are hereby banned from Aldovia'
      );
      await member.ban({ days: 1, reason: 'Reputation dropped to 0' });
    }

    msg.embed(
      new RichEmbed().setTitle('Reputation modified').setColor('#2196f3')
    );
  }
***REMOVED***
