const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const axios = require('axios');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text', 'dm', 'group'],
      aliases: ['ln-title'],
      requiredPermissions: ['EMBED_LINKS'],
      cooldown: 10,
      description: 'For your next light-novel',
    });
  }

  async run(msg) {
    const { data } = await axios.get(
      'https://salty-salty-studios.com/shiz/ln.php'
    );

    msg.sendEmbed(
      new MessageEmbed()
        .setTitle('Title of your next Light Novel')
        .setDescription(data.match(/<h1>(.+)<\/h1>/i)[1])
        .setColor('#2196f3')
    );
  }
***REMOVED***
