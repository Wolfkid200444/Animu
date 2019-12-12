const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const axios = require('axios');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text', 'dm', 'group'],
      aliases: ['cf', 'catfact'],
      requiredPermissions: ['EMBED_LINKS'],
      cooldown: 10,
      description: '"Meow Meow Meow" - Cat',
    });
  }

  async run(msg) {
    const res = await axios.get('https://catfact.ninja/fact');

    const fact = res.data.fact;

    msg.sendEmbed(
      new MessageEmbed()
        .setTitle(`🐱 Cat Fact 🐱`)
        .setDescription(fact)
        .setColor('#2196f3')
    );
  }
***REMOVED***
