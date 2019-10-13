const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const axios = require('axios');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text', 'dm', 'group'],
      aliases: ['duckpic', 'ducko'],
      requiredPermissions: ['EMBED_LINKS'],
      cooldown: 10,
      description: 'View random duck pic',
    });
  }

  async run(msg) {
    const { data } = await axios.get('https://random-d.uk/api/v1/random');

    const image = data.url;

    msg.sendEmbed(
      new MessageEmbed()
        .setTitle(`🦆 Ducko 🦆`)
        .setImage(image)
        .setColor('#2196f3'),
    );
  }
***REMOVED***
