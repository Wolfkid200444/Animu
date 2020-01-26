const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const axios = require('axios');
const { shorten } = require('../../util/util');
const { nasaAPIKey } = require('../../config/keys');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text', 'dm', 'group'],
      aliases: ['astronomy-picture-of-the-day'],
      requiredPermissions: ['EMBED_LINKS'],
      cooldown: 10,
      description: 'Astronomy Picture Of The Day (Just try it!)',
    });
  }

  async run(msg) {
    const { data } = await axios.get(`https://api.nasa.gov/planetary/apod`, {
      params: {
        api_key: nasaAPIKey,
      },
    });

    const embed = new MessageEmbed()
      .setTitle(data.title)
      .setDescription(shorten(data.explanation))
      .setColor(0x2e528e)
      .setAuthor(
        'Astronomy Picture of the Day',
        'https://i.imgur.com/Wh8jY9c.png',
        'https://apod.nasa.gov/apod/astropix.html'
      )
      .setImage(data.media_type === 'image' ? data.url : null)
      .setURL(data.url)
      .setFooter(
        `Image Credits: ${
          data.copyright ? data.copyright.replace(/\n/g, '/') : 'Public Domain'
        }`
      )
      .setTimestamp();
    return msg.send(embed);
  }
***REMOVED***
