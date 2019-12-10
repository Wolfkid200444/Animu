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
      description:
        'Draws an "approved" stamp over an image or a user\'s avatar',
      usage: '<user:member>',
    });
  }

  async run(msg, [user]) {
    const image = user.user.displayAvatarURL({ format: 'png', size: 512 });
    try {
      const base = await loadImage(
        path.join(__dirname, '..', '..', 'images', 'approved.png')
      );
      const data = await loadImage(image);
      const canvas = createCanvas(data.width, data.height);
      const ctx = canvas.getContext('2d');
      ctx.drawImage(data, 0, 0);
      const dataRatio = data.width / data.height;
      const baseRatio = base.width / base.height;
      let { width, height } = data;
      let x = 0;
      let y = 0;
      if (baseRatio < dataRatio) {
        height = data.height;
        width = base.width * (height / base.height);
        x = (data.width - width) / 2;
        y = 0;
      } else if (baseRatio > dataRatio) {
        width = data.width;
        height = base.height * (width / base.width);
        x = 0;
        y = (data.height - height) / 2;
      }
      ctx.drawImage(base, x, y, width, height);
      const attachment = canvas.toBuffer();
      if (Buffer.byteLength(attachment) > 8e6)
        return msg.reply('Resulting image was above 8 MB.');
      return msg.send({ files: [{ attachment, name: 'approved.png' }] });
    } catch (err) {
      console.log(err);
      return msg.reply(
        `Oh no, an error occurred: \`${err.message}\`. Try again later!`
      );
    }
  }
***REMOVED***
