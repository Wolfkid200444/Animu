const { Command } = require('klasa');
const { createCanvas, loadImage } = require('canvas');
const path = require('path');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text'],
      cooldown: 10,
      description: 'Discover new types of Pokemon (your friends)',
      usage: '<user:member>',
    });
  }

  async run(msg, [user]) {
    const image = user.user.displayAvatarURL({ format: 'png', size: 512 });
    try {
      const base = await loadImage(
        path.join(__dirname, '..', '..', '..', 'assets', 'images', 'dexter.png')
      );
      const avatar = await loadImage(image);
      const canvas = createCanvas(base.width, base.height);
      const ctx = canvas.getContext('2d');
      ctx.drawImage(base, 0, 0);
      ctx.rotate(-11 * (Math.PI / 180));
      ctx.drawImage(avatar, 234, 274, 225, 225);
      ctx.rotate(11 * (Math.PI / 180));
      return msg.send({
        files: [{ attachment: canvas.toBuffer(), name: 'dexter.png' }],
      });
    } catch (err) {
      return msg.reply(
        `Oh no, an error occurred: \`${err.message}\`. Try again later!`
      );
    }
  }
};
