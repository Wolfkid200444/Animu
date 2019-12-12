const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const _ = require('lodash');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text', 'dm', 'group'],
      aliases: [
        'kiss-kill-marry',
        'kill-kiss-marry',
        'kill-marry-kiss',
        'marry-kiss-kill',
        'marry-kill-kiss',
      ],
      requiredPermissions: ['EMBED_LINKS'],
      cooldown: 10,
      description: 'Try using this command on your crush',
      usage: '<person1:member> <person1:member> <person1:member>',
      usageDelim: ' ',
    });
  }

  async run(msg, [person1, person2, person3]) {
    const nums = [0, 1, 2];
    const shuffled = _.shuffle(nums);

    return msg.send(
      new MessageEmbed({
        title: 'Kiss, Marry, Kill',
        description: `You'll kiss ${
          shuffled[0] === 0 ? person1 : shuffled[0] === 1 ? person2 : person3
        }, marry ${
          shuffled[1] === 0 ? person1 : shuffled[1] === 1 ? person2 : person3
        } and kill ${
          shuffled[2] === 0 ? person1 : shuffled[2] === 1 ? person2 : person3
        }`,
        color: 0x2196f3,
      })
    );
  }
***REMOVED***
