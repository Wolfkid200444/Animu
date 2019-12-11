const { Command } = require('klasa');
const { createCanvas, loadImage, registerFont } = require('canvas');
const { shortenText } = require('../../util/Canvas');
const path = require('path');
registerFont(path.join(__dirname, '..', '..', 'fonts', 'Noto-Regular.ttf'), {
  family: 'Noto',
});
registerFont(path.join(__dirname, '..', '..', 'fonts', 'Noto-CJK.otf'), {
  family: 'Noto',
});
registerFont(path.join(__dirname, '..', '..', 'fonts', 'Noto-Emoji.ttf'), {
  family: 'Noto',
});

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text', 'group'],
      requiredPermissions: ['EMBED_LINKS'],
      cooldown: 10,
      description: "Draw a user's avatar over a gravestone",
      usage: '<user:user> <game:...string>',
      usageDelim: ' ',
      quotedStringSupport: true,
    });
  }

  async run(msg, [user, game]) {
    const image = user.displayAvatarURL({ format: 'png', size: 512 });
    try {
      const base = await loadImage(
        path.join(__dirname, '..', '..', 'images', 'steam-now-playing.png')
      );
      const avatar = await loadImage(image);
      const canvas = createCanvas(base.width, base.height);
      const ctx = canvas.getContext('2d');
      ctx.drawImage(base, 0, 0);
      ctx.drawImage(avatar, 26, 26, 41, 42);
      ctx.fillStyle = '#90b93c';
      ctx.font = '14px Noto';
      ctx.fillText(user.username, 80, 34);
      ctx.fillText(shortenText(ctx, game, 200), 80, 70);
      return msg.send({
        files: [
          { attachment: canvas.toBuffer(), name: 'steam-now-playing.png' },
        ],
      });
    } catch (err) {
      return msg.reply(
        `Oh no, an error occurred: \`${err.message}\`. Try again later!`
      );
    }
  }
***REMOVED***
