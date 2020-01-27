const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const axios = require('axios');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text', 'dm', 'group'],
      aliases: ['bird', 'bpic', 'birdo'],
      requiredPermissions: ['EMBED_LINKS'],
      cooldown: 10,
      description: 'View random bird pic',
    });
  }

  async run(msg) {
    const { data } = await axios.get('https://shibe.online/api/birds', {
      params: { count: 1, urls: true, httpsUrls: true },
    });

    const image = data[0];

    msg.sendEmbed(
      new MessageEmbed()
        .setTitle(`🐦 Birdo 🐦`)
        .setImage(image)
        .setColor('#2196f3'),
    );
  }
};
