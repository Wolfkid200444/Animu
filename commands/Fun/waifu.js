const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      description: "Sends a randomly generated Waifu that doesn't exist",
    });
  }

  async run(msg) {
    return msg.send(
      new MessageEmbed()
        .setTitle('Waifu')
        .setImage(
          `https://www.thiswaifudoesnotexist.net/example-${Math.floor(
            Math.random() * 100000,
          )}.jpg`,
        )
        .setColor('#2196f3'),
    );
  }
***REMOVED***
