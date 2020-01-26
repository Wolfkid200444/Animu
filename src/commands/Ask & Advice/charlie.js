const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const _ = require('lodash');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text', 'dm', 'group'],
      aliases: ['charlie-charlie', 'askcharlie'],
      requiredPermissions: ['EMBED_LINKS'],
      cooldown: 10,
      description: 'Yes? No?',
      usage: '<question:string>',
      quotedStringSupport: true,
    });
  }

  async run(msg, [question]) {
    const answer = _.sample(['yes', 'no']);
    return msg.send(
      new MessageEmbed({
        title: `${msg.author.username} Asks **${question}**`,
        description: `\`\`\`
        ${answer === 'no' ? '\\' : ' '}  |  ${answer === 'yes' ? '/' : ' '}
      NO ${answer === 'no' ? '\\' : ' '} | ${answer === 'yes' ? '/' : ' '}YES
          ${answer === 'no' ? '\\' : ' '}|${answer === 'yes' ? '/' : ' '}
    ————————————————
          ${answer === 'yes' ? '/' : ' '}|${answer === 'no' ? '\\' : ' '}
      YES${answer === 'yes' ? '/' : ' '} | ${answer === 'no' ? '\\' : ' '}NO
        ${answer === 'yes' ? '/' : ' '}  |  ${answer === 'no' ? '\\' : ' '}
    \`\`\``,
      })
    );
  }
***REMOVED***
