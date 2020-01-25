const { Command } = require('klasa');
const { createCanvas, loadImage } = require('canvas');
const { greyscale } = require('../../util/Canvas');
const path = require('path');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text'],
      cooldown: 10,
      description: 'F',
      usage: '<user:member>',
    });
  }

  async run(msg, [user]) {
    const image = user.user.displayAvatarURL({ format: 'png', size: 512 });
    try {
      const base = await loadImage(
        path.join(__dirname, '..', '..', 'images', 'rip.png')
      );
      const avatar = await loadImage(image);
      const canvas = createCanvas(base.width, base.height);
      const ctx = canvas.getContext('2d');
      ctx.drawImage(base, 0, 0);
      ctx.drawImage(avatar, 194, 399, 500, 500);
      greyscale(ctx, 194, 399, 500, 500);
      return msg.send({
        files: [{ attachment: canvas.toBuffer(), name: 'rip.png' }],
      });
    } catch (err) {
      return msg.reply(
        `Oh no, an error occurred: \`${err.message}\`. Try again later!`
      );
    }
  }
***REMOVED***
