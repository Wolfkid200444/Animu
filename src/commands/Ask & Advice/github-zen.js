const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const axios = require('axios');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text', 'dm', 'group'],
      aliases: ['gh-zen'],
      requiredPermissions: ['EMBED_LINKS'],
      cooldown: 10,
      description: 'View a random Github Design Philosophy (yeah, those exist)',
    });
  }

  async run(msg) {
    const { data } = await axios.get('https://api.github.com/zen');

    msg.sendEmbed(
      new MessageEmbed()
        .setTitle('Github Zen')
        .setDescription(data)
        .setColor('#2196f3')
    );
  }
};
