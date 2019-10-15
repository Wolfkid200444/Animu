const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const axios = require('axios');
const { openWeatherAPIKey } = require('../../config/keys');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      description: 'Show details about an anime',
      cooldown: 10,
      requiredPermissions: ['EMBED_LINKS'],
      usage: '<location:string>',
      quotedStringSupport: true,
    });
  }

  async run(msg, [location]) {
    if (/^[0-9]+$/.test(location)) location = { type: 'zip', data: location ***REMOVED***
    location = { type: 'q', data: location ***REMOVED***

    try {
      const { data: body } = await axios.get(
        'https://api.openweathermap.org/data/2.5/weather',
        {
          params: {
            q: location.type === 'q' ? location.data : '',
            zip: location.type === 'zip' ? location.data : '',
            units: 'metric',
            appid: openWeatherAPIKey,
          },
        },
      );
      const embed = new MessageEmbed()
        .setColor(0xff7a09)
        .setAuthor(
          `${body.name}, ${body.sys.country}`,
          'https://i.imgur.com/NjMbE9o.png',
          'https://openweathermap.org/city',
        )
        .setURL(`https://openweathermap.org/city/${body.id}`)
        .setTimestamp()
        .addField(
          '❯ Condition',
          body.weather
            .map((data) => `${data.main} (${data.description})`)
            .join('\n'),
        )
        .addField('❯ Temperature', `${body.main.temp}°F`, true)
        .addField('❯ Humidity', `${body.main.humidity}%`, true)
        .addField('❯ Wind Speed', `${body.wind.speed} mph`, true);
      return msg.send(embed);
    } catch (err) {
      if (err.status === 404) return msg.send('Could not find any results.');
      return msg.send(
        `Oh no, an error occurred: \`${err.message}\`. Try again later!`,
      );
    }
  }
***REMOVED***
