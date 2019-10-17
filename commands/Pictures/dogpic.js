const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const axios = require('axios');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text', 'dm', 'group'],
      aliases: ['dog', 'dpic', 'doggo'],
      requiredPermissions: ['EMBED_LINKS'],
      cooldown: 10,
      description: 'View random dog pic',
    });
  }

  async run(msg) {
    const res = await axios.get('https://dog.ceo/api/breeds/image/random');

    const image = res.data.message;

    msg.sendEmbed(
      new MessageEmbed()
        .setTitle(`🐶 Doggo 🐶`)
        .setImage(image)
        .setColor('#2196f3'),
    );
  }
***REMOVED***
