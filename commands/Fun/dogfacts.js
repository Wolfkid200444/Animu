const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const axios = require('axios');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text', 'dm', 'group'],
      aliases: ['df', 'dogfact', 'doggofacts', 'doggofact'],
      cooldown: 10,
      description: 'View random dog facts',
      extendedHelp:
        'Use this command to fulfill your curiosity and get to know some fun dog facts!'
    });
  }

  async run(msg) {
    const res = await axios.get(
      'http://dog-api.kinduff.com/api/facts?number=1'
    );

    const fact = res.data.facts[0];

    msg.sendEmbed(
      new MessageEmbed()
        .setTitle(`🐶 Doggo Fact 🐶`)
        .setDescription(fact)
        .setColor('#2196f3')
    );
  }
***REMOVED***
