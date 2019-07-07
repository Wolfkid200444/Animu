const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ['remind', 'rm'],
      description: 'Creates a reminder',
      extendedHelp:
        'Create a reminder, the arguments are time (when you want to be reminded) and text that you want to get on specified time',
      cooldown: 20,
      usage: '<when:time> <text:...str>',
      usageDelim: ', '
    });
  }

  async run(msg, [when, text]) {
    const reminder = await this.client.schedule.create('reminder', when, {
      data: {
        channel: msg.channel.id,
        user: msg.author.id,
        text
      }
    });
    return msg.sendEmbed(
      new MessageEmbed()
        .setAuthor(
          msg.author.username,
          msg.author.displayAvatarURL({ size: 32 })
        )
        .setTitle('Reminder Created')
        .setDescription(
          `A reminder was created with the id: \`${reminder.id}\``
        )
        .setColor('#2196f3')
    );
  }
***REMOVED***
