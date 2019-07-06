const { Command } = require('klasa');

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
    return msg.sendMessage(
      `Ok, I created you a reminder with the id: \`${reminder.id}\``
    );
  }
***REMOVED***
