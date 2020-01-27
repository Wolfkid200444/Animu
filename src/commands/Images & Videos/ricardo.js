const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const _ = require('lodash');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      cooldown: 10,
      description: "I don't think I have to explain this command...",
    });
  }

  run(msg) {
    return msg.sendMessage(
      new MessageEmbed({
        title: 'Ricardo',
        color: 0x2196f3,
      }).setImage(_.sample(urls))
    );
  }
};

// URLs
const urls = [
  'https://i.kym-cdn.com/photos/images/original/001/449/046/e4c.jpg',
  'https://vignette.wikia.nocookie.net/jaygt/images/e/ee/Ricardomilos.png/revision/latest/scale-to-width-down/1000?cb=20190501163419',
  'https://i.redd.it/z1y6x7oab5u21.png',
  'https://i.kym-cdn.com/photos/images/newsfeed/001/479/169/c57.gif',
];
