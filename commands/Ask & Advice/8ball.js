const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const _ = require('lodash');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text', 'dm', 'group'],
      aliases: ['8', 'eightball', 'ball', 'magicball'],
      requiredPermissions: ['EMBED_LINKS'],
      cooldown: 10,
      description: 'Ask 8ball',
      extendedHelp:
        'Ask any question you want and the magic 8ball will answer all your questions',
      usage: '<question:string>',
      quotedStringSupport: true,
    });
  }

  async run(msg, [question]) {
    const answer = _.sample(answers);

    return msg.sendEmbed(
      new MessageEmbed()
        .setTitle(`${msg.member.displayName} asks "${question}"`)
        .setDescription(answer.string)
        .setColor(answer.color),
    );
  }
***REMOVED***

//8Ball answers
const answers = [
  { string: 'It is certain.', color: '#4caf50' },
  { string: 'It is decidedly so.', color: '#4caf50' },
  { string: 'Without a doubt.', color: '#4caf50' },
  { string: 'Yes - definitely.', color: '#4caf50' },
  { string: 'You may rely on it.', color: '#4caf50' },
  { string: 'As I see it, yes.', color: '#4caf50' },
  { string: 'Most likely.', color: '#4caf50' },
  { string: 'Outlook good.', color: '#4caf50' },
  { string: 'Yes.', color: '#4caf50' },
  { string: 'Signs point to yes.', color: '#4caf50' },
  { string: "Don't count on it.", color: '#f44336' },
  { string: 'My reply is no.', color: '#f44336' },
  { string: 'My sources say no.', color: '#f44336' },
  { string: 'Outlook not so good.', color: '#f44336' },
  { string: 'Very doubtful.', color: '#f44336' },
];
