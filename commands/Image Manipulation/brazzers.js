const { Command } = require('klasa');
const { createCanvas, loadImage } = require('canvas');
const path = require('path');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text', 'group'],
      aliases: ['approve'],
      requiredPermissions: ['EMBED_LINKS'],
      cooldown: 10,
      description: 'Draws an image with the Brazzers logo in the corner',
      usage: '<user:user>',
    });
  }

  async run(msg, [user]) {
    const image = user.displayAvatarURL({ format: 'png', size: 512 });
    try {
      const base = await loadImage(
        path.join(__dirname, '..', '..', 'images', 'brazzers.png')
      );
      const data = await loadImage(image);
      const canvas = createCanvas(data.width, data.height);
      const ctx = canvas.getContext('2d');
      ctx.drawImage(data, 0, 0);
      const ratio = base.width / base.height;
      const width = data.width / 3;
      const height = Math.round(width / ratio);
      ctx.drawImage(base, 0, data.height - height, width, height);
      const attachment = canvas.toBuffer();
      if (Buffer.byteLength(attachment) > 8e6)
        return msg.reply('Resulting image was above 8 MB.');
      return msg.send({ files: [{ attachment, name: 'brazzers.png' }] });
    } catch (err) {
      return msg.reply(
        `Oh no, an error occurred: \`${err.message}\`. Try again later!`
      );
    }
  }
***REMOVED***
