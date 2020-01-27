const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const axios = require('axios');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text'],
      description: 'Search the Pokédex for a Pokémon',
      cooldown: 10,
      aliases: ['pokemon'],
      requiredPermissions: ['EMBED_LINKS'],
      usage: '<pokemon:string>',
      quotedStringSupport: true,
    });
  }

  async run(msg, [pokemon]) {
    const { data } = await axios.get(
      `https://pokeapi.co/api/v2/pokemon/${pokemon}`
    );
    if (!data) return msg.send('Pokemon Not Found');
    const embed = new MessageEmbed()
      .setColor(0x2196f3)
      .setTitle(data.name)
      .addField('❯ Type', data.types[0].type.name)
      .addField('❯ Species', data.species.name)
      .addField('❯ Weight', `${data.weight}`)
      .setThumbnail(data.sprites.front_default);

    return msg.send(embed);
  }
};
