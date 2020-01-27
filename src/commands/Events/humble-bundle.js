const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const axios = require('axios');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text', 'dm', 'group'],
      requiredPermissions: ['EMBED_LINKS'],
      cooldown: 10,
      description: "Trust me, You don't wanna miss out these humble bundles!",
    });
  }

  async run(msg) {
    const { data } = await axios.get(
      'https://www.humblebundle.com/androidapp/v2/service_check'
    );
    const body = data;
    if (!body.length) return msg.send('There is no bundle right now...');

    return msg.send(
      new MessageEmbed({
        title: 'Current Humble Bundle(s)',
        description: body
          .map(bundle => `[${bundle.bundle_name}](${bundle.url})`)
          .join('\n'),
        color: 0x2196f3,
      }).setFooter(`${body.length} Humble Bumble(s) Available`)
    );
  }
};
