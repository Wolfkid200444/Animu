//Dependencies
const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const _ = require('lodash');

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
  { string: 'Reply hazy, try again.', color: '#ffeb3b' },
  { string: 'Ask again later.', color: '#ffeb3b' },
  { string: 'Better not tell you now.', color: '#ffeb3b' },
  { string: 'Cannot predict now.', color: '#ffeb3b' },
  { string: 'Concentrate and ask again.', color: '#ffeb3b' },
  { string: "Don't count on it.", color: '#f44336' },
  { string: 'My reply is no.', color: '#f44336' },
  { string: 'My sources say no.', color: '#f44336' },
  { string: 'Outlook not so good.', color: '#f44336' },
  { string: 'Very doubtful.', color: '#f44336' }
];

//Main
module.exports = class ReactCommand extends Command {
  constructor(client) {
    super(client, {
      name: '8ball',
      aliases: [],
      group: 'fun',
      memberName: '8ball',
      throttling: {
        usages: 1,
        duration: 5
      },
      guildOnly: true,
      description: 'Ask the well known 8 ball anything you want',
      examples: ['8ball', '8ball Am I gay?'],
      args: [
        {
          key: 'question',
          prompt: 'What do you want to ask?',
          type: 'string'
        }
      ]
    });
  }

  async run(msg, { question }) {
    const answer = _.sample(answers);

    return msg.embed(
      new RichEmbed()
        .setTitle(`${msg.member.displayName} asks "${question}"`)
        .setDescription(answer.string)
        .setColor(answer.color)
    );
  }
***REMOVED***
