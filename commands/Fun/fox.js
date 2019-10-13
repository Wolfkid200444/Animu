const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const axios = require('axios');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text', 'dm', 'group'],
      aliases: ['fox', 'fpic'],
      requiredPermissions: ['EMBED_LINKS'],
      cooldown: 10,
      description: 'View random fox pic',
    });
  }

  async run(msg) {
    const { data } = await axios.get('https://randomfox.ca/floof/');

    const { image } = data;

    msg.sendEmbed(
      new MessageEmbed()
        .setTitle(`🦊 Fox 🦊`)
        .setImage(image)
        .setColor('#2196f3'),
    );
  }
***REMOVED***
