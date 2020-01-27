const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const axios = require('axios');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text', 'dm', 'group'],
      requiredPermissions: ['EMBED_LINKS'],
      cooldown: 10,
      description: 'A doomsday clock, I suppose?',
    });
  }

  async run(msg) {
    const { data } = await axios.get(
      'https://thebulletin.org/doomsday-clock/past-announcements/'
    );
    const time = data.match(/<h3 class="uabb-infobox-title">(.+)<\/h3>/)[1];
    const year = data.match(
      /<h5 class="uabb-infobox-title-prefix">(.+)<\/h5>/
    )[1];
    const description = data.match(
      /<div class="uabb-infobox-text uabb-text-editor"><p>(.+)<\/p>/
    )[1];
    const embed = new MessageEmbed()
      .setTitle(`${year}: ${time}`)
      .setColor(0x000000)
      .setURL('https://thebulletin.org/doomsday-clock/current-time/')
      .setAuthor(
        'Bulletin of the Atomic Scientists',
        undefined,
        'https://thebulletin.org/'
      )
      .setDescription(
        description.replace(/<a href="(.+)">(.+)<\/a>/, '[$2]($1)')
      );
    return msg.send(embed);
  }
};
