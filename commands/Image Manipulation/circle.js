const { Command } = require('klasa');
const { createCanvas, loadImage } = require('canvas');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text', 'group'],
      requiredPermissions: ['EMBED_LINKS'],
      cooldown: 10,
      description: 'Crop an image in circle shape',
      usage: '<image:image>',
    });
  }

  async run(msg, [image]) {
    try {
      const data = await loadImage(image);
      const dimensions = data.width <= data.height ? data.width : data.height;
      const canvas = createCanvas(dimensions, dimensions);
      const ctx = canvas.getContext('2d');
      ctx.beginPath();
      ctx.arc(
        canvas.width / 2,
        canvas.height / 2,
        canvas.height / 2,
        0,
        Math.PI * 2
      );
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(
        data,
        canvas.width / 2 - data.width / 2,
        canvas.height / 2 - data.height / 2
      );
      return msg.send({
        files: [{ attachment: canvas.toBuffer(), name: 'circle.png' }],
      });
    } catch (err) {
      return msg.reply(
        `Oh no, an error occurred: \`${err.message}\`. Try again later!`
      );
    }
  }
***REMOVED***
