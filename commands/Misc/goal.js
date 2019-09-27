const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text', 'dm', 'group'],
      aliases: ['target', 'goals', 'targets', 'patreon', 'patron'],
      cooldown: 120,
      description: 'View Goals of Animu',
    });
  }

  async run(msg) {
    msg.sendEmbed(
      new MessageEmbed({
        title: 'Animu Goals',
        description: 'https://patreon.com/Aldovia',
        fields: [
          {
            name: 'Current',
            value: `$${this.client.settings.patreonCurrent}/month`,
          },
          {
            name: '$100/month',
            value: '> Music\n> More perks for Verified Role',
          },
          {
            name: '$200/month',
            value: `> Guilds\n> Image Profiles`,
          },
          {
            name: '$300/month',
            value: `> AI based auto moderation`,
          },
        ],
        color: '#2196f3',
      }),
    );
  }
***REMOVED***
