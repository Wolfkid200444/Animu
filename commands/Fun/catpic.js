const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const axios = require('axios');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text', 'dm', 'group'],
      aliases: ['cat', 'cpic', 'catto'],
      requiredPermissions: ['EMBED_LINKS'],
      cooldown: 10,
      description: 'View random cat pic',
    });
  }

  async run(msg) {
    const res = await axios.get('https://api.thecatapi.com/v1/images/search', {
      'x-api-key': '0067907b-12a2-47fe-b056-c3aa58cee4d8',
    });

    const image = res.data[0].url;

    msg.sendEmbed(
      new MessageEmbed()
        .setTitle(`🐱 Catto 🐱`)
        .setImage(image)
        .setColor('#2196f3'),
    );
  }
***REMOVED***
