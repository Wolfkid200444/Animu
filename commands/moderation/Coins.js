//Dependencies
const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const { changeCoins } = require('../../helpers/profile');

//Main
module.exports = class CoinsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'coins',
      aliases: [],
      group: 'moderation',
      userPermissions: ['MANAGE_ROLES'],
      memberName: 'coins',
      throttling: {
        usages: 1,
        duration: 5
      },
      description: "Increase/Decrease a member's coins",
      examples: ['coins'],
      args: [
        {
          key: 'member',
          prompt: "Which member's coins would you like to increase/decrease?",
          type: 'member'
        },
        {
          key: 'change',
          prompt: 'Do you want to increase or decrease their coins? (+, -)',
          type: 'string',
          oneOf: ['+', '-']
        },
        {
          key: 'coins',
          prompt: 'How much coins would you like to increase/decrease?',
          type: 'integer',
          min: 1,
          max: 10000
        }
      ]
    });
  }

  async run(msg, { member, change, coins }) {
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
          .setTitle("Can't change coins of mod/server admin")
          .setColor('#f44336')
      );

    await changeCoins(member.id, change, coins);

    msg.embed(new RichEmbed().setTitle('Coins modified').setColor('#2196f3'));
  }
***REMOVED***
