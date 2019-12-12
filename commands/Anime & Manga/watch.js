const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const _ = require('lodash');
const cheerio = require('cheerio');
const request = require('request');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      description: 'Watch an Anime (or hentai)',
      cooldown: 60,
      requiredPermissions: ['EMBED_LINKS'],
      usage: '<animeName:string> <episode:number>',
      usageDelim: ' ',
      quotedStringSupport: true,
    });
  }

  async run(msg, [animeName, episode]) {
    const loadingEmoji = this.client.emojis.find(e => e.name === 'loading');
    await msg.send(`Searching ${loadingEmoji}`);

    let searchResults = [];

    const baseURL = 'https://gogoanimes.ai';
    const searchURL = `https://gogoanimes.ai//search.html?keyword=${encodeURI(
      animeName
    )}`;

    request(
      {
        method: 'GET',
        url: searchURL,
      },
      async (err, res, body) => {
        const $s = cheerio.load(body);

        $s('.items li').each((i, elem) => {
          searchResults.push({
            title: $s(elem)
              .find('.name a')
              .text(),
            url: $s(elem)
              .find('.name a')
              .attr('href'),
          });
        });

        if (searchResults.length > 5) searchResults = searchResults.slice(0, 5);

        const sentMsg1 = await msg.send(
          new MessageEmbed({
            title: 'Result(s) Found',
            description:
              searchResults.length > 0
                ? searchResults
                    .map((result, i) => `**${i + 1})** ${result.title}`)
                    .join('\n')
                : 'No Anime Found',
            color: searchResults.length > 0 ? '#2196f3' : '#f44336',
          })
        );

        let validReactions = [];

        if (searchResults.length === 0) return;
        if (searchResults.length > 0) {
          sentMsg1.react('1⃣');
          validReactions.push('1⃣');
        }
        if (searchResults.length > 1) {
          sentMsg1.react('2⃣');
          validReactions.push('2⃣');
        }
        if (searchResults.length > 2) {
          sentMsg1.react('3⃣');
          validReactions.push('3⃣');
        }
        if (searchResults.length > 3) {
          sentMsg1.react('4⃣');
          validReactions.push('4⃣');
        }
        if (searchResults.length > 4) {
          sentMsg1.react('5⃣');
          validReactions.push('5⃣');
        }

        const filter1 = (reaction, user) =>
          _.includes(validReactions, reaction.emoji.name) &&
          user.id === msg.author.id;

        const reactionsSearch = sentMsg1.createReactionCollector(filter1, {
          time: 30000,
        });

        let animeUrl;

        reactionsSearch.on('collect', r => {
          const emojiName = r._emoji.name;
          if (emojiName === '1⃣') animeUrl = searchResults[0].url;
          if (emojiName === '2⃣') animeUrl = searchResults[1].url;
          if (emojiName === '3⃣') animeUrl = searchResults[2].url;
          if (emojiName === '4⃣') animeUrl = searchResults[3].url;
          if (emojiName === '5⃣') animeUrl = searchResults[4].url;
          sentMsg1.reactions.removeAll();

          request(
            {
              method: 'GET',
              url: `${baseURL}${_.replace(
                animeUrl,
                '/category/',
                '/'
              )}-episode-${episode}`,
            },
            async (err, res, body2) => {
              const $ = cheerio.load(body2);
              const title = $('.entry-title');

              if (title && title.text().trim() === 'Page not found')
                return msg.send(
                  new MessageEmbed({
                    title: 'Episode Not Found',
                    description: "The episode you're looking for doesn't exist",
                    color: '#f44336',
                  })
                );

              const videoUrl = $('iframe').attr('src');

              msg.send(`Here you go:\n\n http:${videoUrl}`);
            }
          );
        });
      }
    );
  }
***REMOVED***
