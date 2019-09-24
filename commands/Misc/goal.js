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
            name: 'Next Goal',
            value: `$200\n${(this.client.settings.patreonCurrent / 200) *
              100}% Achieved\nGuilds will be added upon hitting this goal`,
          },
        ],
        color: '#2196f3',
      }),
    );
  }
***REMOVED***
