const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const axios = require('axios');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text'],
      description: 'Search for a recipe',
      cooldown: 10,
      requiredPermissions: ['EMBED_LINKS'],
      usage: '<query:string>',
      quotedStringSupport: true,
    });
  }

  async run(msg, [query]) {
    try {
      const { data: body } = await axios.get(
        'http://www.recipepuppy.com/api/',
        {
          params: { q: query },
        }
      );
      if (!body.results.length) return msg.send('Could not find any results.');
      const recipe =
        body.results[Math.floor(Math.random() * body.results.length)];
      const embed = new MessageEmbed()
        .setAuthor(
          'Recipe Puppy',
          'https://i.imgur.com/lT94snh.png',
          'http://www.recipepuppy.com/'
        )
        .setColor(0xc20000)
        .setURL(recipe.href)
        .setTitle(recipe.title)
        .setDescription(`**Ingredients:** ${recipe.ingredients}`)
        .setThumbnail(recipe.thumbnail);
      return msg.send(embed);
    } catch (err) {
      if (err.status === 500) return msg.send('Could not find any results.');
      return msg.reply(
        `Oh no, an error occurred: \`${err.message}\`. Try again later!`
      );
    }
  }
***REMOVED***
