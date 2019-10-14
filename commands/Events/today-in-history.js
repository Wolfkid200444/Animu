const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const axios = require('axios');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text', 'dm', 'group'],
      requiredPermissions: ['EMBED_LINKS'],
      cooldown: 10,
      description: 'What happened on this day in history?',
    });
  }

  async run(msg) {
    const now = new Date();
    const date = `${now.getMonth() + 1}/${now.getDate()}`;
    const { data } = await axios.get(
      `http://history.muffinlabs.com/date/${date}`,
    );
    const body = data;
    const events = body.data.Events;
    const event = events[Math.floor(Math.random() * events.length)];
    const embed = new MessageEmbed()
      .setColor(0x9797ff)
      .setURL(body.url)
      .setTitle(`On this day (${body.date})...`)
      .setTimestamp()
      .setDescription(`${event.year}: ${event.text}`)
      .addField(
        '❯ See More',
        event.links
          .map((link) => `[${link.title}](${link.link.replace(/\)/g, '%29')})`)
          .join('\n'),
      );
    return msg.send(embed);
  }
***REMOVED***
