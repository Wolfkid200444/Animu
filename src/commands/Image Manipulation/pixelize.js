const { Command } = require('klasa');
const { createCanvas, loadImage } = require('canvas');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text'],
      cooldown: 10,
      description: 'Create your very own Japanese p*rn',
      usage: '<image:image>',
    });
  }

  async run(msg, [image]) {
    try {
      const data = await loadImage(image);
      const canvas = createCanvas(data.width, data.height);
      const ctx = canvas.getContext('2d');
      ctx.imageSmoothingEnabled = false;
      const width = canvas.width * 0.15;
      const height = canvas.height * 0.15;
      ctx.drawImage(data, 0, 0, width, height);
      ctx.drawImage(
        canvas,
        0,
        0,
        width,
        height,
        0,
        0,
        canvas.width,
        canvas.height
      );
      const attachment = canvas.toBuffer();
      if (Buffer.byteLength(attachment) > 8e6)
        return msg.reply('Resulting image was above 8 MB.');
      return msg.send({ files: [{ attachment, name: 'pixelize.png' }] });
    } catch (err) {
      return msg.reply(
        `Oh no, an error occurred: \`${err.message}\`. Try again later!`
      );
    }
  }
};
