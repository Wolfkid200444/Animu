const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const axios = require('axios');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text', 'dm', 'group'],
      aliases: ['cf', 'catfact'],
      cooldown: 10,
      description: 'View random cat facts',
      extendedHelp:
        'Use this command to fulfill your curiosity and get to know some fun cat facts!'
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
