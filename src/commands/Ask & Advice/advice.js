const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const axios = require('axios');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text', 'dm', 'group'],
      aliases: ['advice-slip', 'adviceslip'],
      requiredPermissions: ['EMBED_LINKS'],
      cooldown: 10,
      description: 'Get useful advice (for real)',
    });
  }

  async run(msg) {
    const { data } = await axios.get('http://api.adviceslip.com/advice');

    msg.send(
      new MessageEmbed({
        title: 'Advice Slip',
        description: data.slip.advice,
        color: 0x2196f3,
      }).setFooter(`Slip ID: ${data.slip.slip_id}`)
    );
  }
};
