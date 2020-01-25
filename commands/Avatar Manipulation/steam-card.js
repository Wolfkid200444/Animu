const { Command } = require('klasa');
const { createCanvas, loadImage, registerFont } = require('canvas');
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
      runIn: ['text'],
      cooldown: 10,
      description: 'Steam Card...',
      usage: '<user:user>',
    });
  }

  async run(msg, [user]) {
    const image = user.displayAvatarURL({ format: 'png', size: 512 });
    try {
      const base = await loadImage(
        path.join(__dirname, '..', '..', 'images', 'steam-card.png')
      );
      const avatar = await loadImage(image);
      const canvas = createCanvas(base.width, base.height);
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#feb2c1';
      ctx.fillRect(0, 0, base.width, base.height);
      ctx.drawImage(avatar, 12, 19, 205, 205);
      ctx.drawImage(base, 0, 0);
      ctx.font = '14px Noto';
      ctx.fillStyle = 'black';
      ctx.fillText(user.username, 16, 25);
      ctx.fillStyle = 'white';
      ctx.fillText(user.username, 15, 24);
      return msg.send({
        files: [{ attachment: canvas.toBuffer(), name: 'steam-card.png' }],
      });
    } catch (err) {
      return msg.reply(
        `Oh no, an error occurred: \`${err.message}\`. Try again later!`
      );
    }
  }
***REMOVED***
