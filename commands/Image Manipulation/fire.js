const { Command } = require('klasa');
const { createCanvas, loadImage } = require('canvas');
const { drawImageWithTint } = require('../../util/Canvas');
const path = require('path');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text'],
      cooldown: 10,
      description: "Draw a fiery border over an image or a user's avatar",
      usage: '<image:image>',
    });
  }

  async run(msg, [image]) {
    try {
      const base = await loadImage(
        path.join(__dirname, '..', '..', 'images', 'fire.png')
      );
      const data = await loadImage(image);
      const canvas = createCanvas(data.width, data.height);
      const ctx = canvas.getContext('2d');
      drawImageWithTint(ctx, data, '#fc671e', 0, 0, data.width, data.height);
      ctx.drawImage(base, 0, 0, data.width, data.height);
      const attachment = canvas.toBuffer();
      if (Buffer.byteLength(attachment) > 8e6)
        return msg.reply('Resulting image was above 8 MB.');
      return msg.send({ files: [{ attachment, name: 'fire.png' }] });
    } catch (err) {
      return msg.reply(
        `Oh no, an error occurred: \`${err.message}\`. Try again later!`
      );
    }
  }
***REMOVED***
