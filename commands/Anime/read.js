const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const _ = require('lodash');
const cheerio = require('cheerio');
const request = require('request');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      description: 'Read a manga',
      cooldown: 60,
      requiredPermissions: ['EMBED_LINKS'],
      extendedHelp:
        'Read a manga directly on discord, first argument is manga name and second argument is chapter number',
      usage: '<mangaName:string> <chapter:number>',
      usageDelim: ' ',
      quotedStringSupport: true,
    });
  }

  async run(msg, [mangaName, chapter]) {
    let pageNumber = 1;
    let imagesArr = [];

    const url = `https://manganelo.com/chapter/${_.snakeCase(
      mangaName.toLowerCase(),
    )}/chapter_${chapter}`;

    request(
      {
        method: 'GET',
        url,
      },
      (err, res, body) => {
        let $ = cheerio.load(body);

        let title = $('.info-top-chapter h2');

        if (!title.text())
          return msg.send(
            new MessageEmbed({
              title: 'Invalid Chapter/Manga',
              description:
                'Please go to: manganelo.com and make sure the chapter/manga you wish to read exists there.\n\nPlease note that manga name DOES NOT always match manga link',
              color: '#f44336',
            }),
          );

        $('#vungdoc img').each((i, elem) => {
          imagesArr.push(elem.attribs.src);
        });

        const embed = new MessageEmbed()
          .setTitle(title.text())
          .setImage(imagesArr[pageNumber - 1])
          .setColor('#2196f3');

        msg.send(embed).then((sentMsg) => {
          sentMsg.react('⬅');
          sentMsg.react('➡');

          const filter = (reaction, user) =>
            _.includes(['⬅', '➡'], reaction.emoji.name) &&
            user.id === msg.author.id;

          const reactions = sentMsg.createReactionCollector(filter, {
            time: 600000,
          });

          reactions.on('collect', async (r) => {
            const emojiName = r._emoji.name;
            if (emojiName === '➡' && pageNumber < imagesArr.length + 1)
              pageNumber++;
            if (emojiName === '⬅' && pageNumber > 1) pageNumber--;

            msg.send(
              new MessageEmbed()
                .setTitle(title.text())
                .setImage(imagesArr[pageNumber - 1])
                .setColor('#2196f3'),
            );

            sentMsg.reactions
              .find((r) => r.emoji.name === emojiName)
              .users.remove(msg.author.id);
          });
        });
      },
    );
  }
***REMOVED***
