const { Command } = require('klasa');
const PixivAPI = require('pixiv-api-client');
const pixivImg = require('pixiv-img');
const path = require('path');
const fs = require('fs');
const { pixivUsername, pixivPassword } = require('../../config/keys');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text'],
      description: 'Search Pixiv for illustrations',
      cooldown: 10,
      requiredPermissions: ['EMBED_LINKS'],
      usage: '<keyword:string> [page:int]',
      usageDelim: ' ',
      quotedStringSupport: true,
    });
    this.pixiv;
  }

  async run(msg, [keyword, page = 1]) {
    const res = await this.pixiv.searchIllust(keyword, {
      offset: (page - 1) * 30,
    });
    const topSorted = res.illusts.sort(
      (a, b) => b.total_bookmarks - a.total_bookmarks
    );

    if (!topSorted[0]) return msg.channel.send('Nothing found');

    const imgPath = await pixivImg(
      topSorted[0].image_urls.large,
      `../temp/${path.basename(topSorted[0].image_urls.large)}`
    );
    await msg.channel.send(
      `${topSorted[0].title} • ♥ ${topSorted[0].total_bookmarks}`,
      {
        files: [imgPath],
      }
    );
    const existsImg = fs.existsSync(imgPath);
    if (existsImg) fs.unlinkSync(imgPath);
  }

  async init() {
    try {
      this.pixiv = new PixivAPI();
      await this.pixiv.login(pixivUsername, pixivPassword);
    } catch (e) {
      console.log(e);
    }
  }
***REMOVED***
