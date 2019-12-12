const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const _ = require('lodash');
const cheerio = require('cheerio');
const request = require('request');
const redis = require('redis');
const bluebird = require('bluebird');

bluebird.promisifyAll(redis.RedisClient.prototype);
const redisClient = redis.createClient();

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      description: 'Read a manga (or doujin)',
      cooldown: 60,
      requiredPermissions: ['EMBED_LINKS'],
      usage: '<mangaName:string> <chapter:number>',
      usageDelim: ' ',
      quotedStringSupport: true,
    });
  }

  async run(msg, [mangaName, chapter]) {
    let pageNumber = 1;
    let searchResults = [];
    let imagesArr = [];

    request(
      {
        method: 'GET',
        url: `https://manganelo.com/search/${_.snakeCase(mangaName)}`,
      },
      async (err, res, body) => {
        let $s = cheerio.load(body);

        $s('.panel_story_list .story_item').each((i, elem) => {
          searchResults.push({
            title: $s(elem)
              .find('.story_name a')
              .text(),
            url: $s(elem)
              .find('.story_name a')
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
                : 'No Manga Found',
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
          time: 60000,
        });

        let mangaUrl;

        reactionsSearch.on('collect', r => {
          const emojiName = r._emoji.name;
          if (emojiName === '1⃣') mangaUrl = searchResults[0].url;
          if (emojiName === '2⃣') mangaUrl = searchResults[1].url;
          if (emojiName === '3⃣') mangaUrl = searchResults[2].url;
          if (emojiName === '4⃣') mangaUrl = searchResults[3].url;
          if (emojiName === '5⃣') mangaUrl = searchResults[4].url;
          sentMsg1.reactions.removeAll();

          const url = `${mangaUrl.replace(
            '/manga/',
            '/chapter/'
          )}/chapter_${chapter}`;

          request(
            {
              method: 'GET',
              url,
            },
            async (err, res, body2) => {
              let $ = cheerio.load(body2);

              let title = $('.info-top-chapter h2');

              if (!title.text())
                return msg.send(
                  new MessageEmbed({
                    title: 'Invalid Chapter',
                    description: "The chapter you wish to read doesn't exist",
                    color: '#f44336',
                  })
                );

              $('#vungdoc img').each((i, elem) => {
                imagesArr.push(elem.attribs.src);
              });

              const readStatus = await redisClient.hgetAsync(
                'manga_status',
                `${msg.author.id}:${title}:${chapter}`
              );

              if (readStatus) pageNumber = readStatus;

              const embed = new MessageEmbed()
                .setTitle(title.text())
                .setImage(imagesArr[pageNumber - 1])
                .setColor('#2196f3');

              msg.send(embed).then(sentMsg => {
                sentMsg.react('⬅');
                sentMsg.react('➡');

                const filter = (reaction, user) =>
                  _.includes(['⬅', '➡'], reaction.emoji.name) &&
                  user.id === msg.author.id;

                const reactions = sentMsg.createReactionCollector(filter, {
                  time: 600000,
                });

                reactions.on('collect', async r => {
                  const emojiName = r._emoji.name;
                  if (emojiName === '➡' && pageNumber < imagesArr.length + 1)
                    pageNumber++;
                  if (emojiName === '⬅' && pageNumber > 1) pageNumber--;

                  msg.send(
                    new MessageEmbed()
                      .setTitle(title.text())
                      .setImage(imagesArr[pageNumber - 1])
                      .setColor('#2196f3')
                  );

                  sentMsg.reactions
                    .find(r => r.emoji.name === emojiName)
                    .users.remove(msg.author.id);

                  await redisClient.hsetAsync(
                    'manga_status',
                    `${msg.author.id}:${title}:${chapter}`,
                    pageNumber
                  );
                });
              });
            }
          );
        });
      }
    );
  }
***REMOVED***
