const { Command } = require('klasa');
const { createCanvas, loadImage } = require('canvas');
const { distort } = require('../../util/Canvas');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text', 'group'],
      requiredPermissions: ['EMBED_LINKS'],
      cooldown: 10,
      description: 'Get glitched image or avatar',
      usage: '<image:image>',
    });
  }

  async run(msg, [image]) {
    try {
      const data = await loadImage(image);
      const canvas = createCanvas(data.width, data.height);
      const ctx = canvas.getContext('2d');
      ctx.drawImage(data, 0, 0);
      distort(ctx, 20, 0, 0, data.width, data.height, 5);
      const attachment = canvas.toBuffer();
      if (Buffer.byteLength(attachment) > 8e6)
        return msg.reply('Resulting image was above 8 MB.');
      return msg.send({ files: [{ attachment, name: 'glitch.png' }] });
    } catch (err) {
      return msg.reply(
        `Oh no, an error occurred: \`${err.message}\`. Try again later!`
      );
    }
  }
***REMOVED***
