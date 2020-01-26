const { Command } = require('klasa');
const { createCanvas, loadImage } = require('canvas');
const { silhouette } = require('../../util/Canvas');
const path = require('path');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text'],
      cooldown: 10,
      description: 'A challenger Aproaches',
      usage: '<user:member> [silhoutted:bool]',
      usageDelim: ' ',
    });
  }

  async run(msg, [user, silhouetted = false]) {
    const image = user.user.displayAvatarURL({ format: 'png', size: 512 });
    try {
      const base = await loadImage(
        path.join(__dirname, '..', '..', '..', 'assets', 'images', 'challenger.png')
      );
      const avatar = await loadImage(image);
      const canvas = createCanvas(base.width, base.height);
      const ctx = canvas.getContext('2d');
      ctx.drawImage(base, 0, 0);
      ctx.drawImage(
        silhouetted ? this.silhouetteImage(avatar) : avatar,
        484,
        98,
        256,
        256
      );
      return msg.send({
        files: [{ attachment: canvas.toBuffer(), name: 'challenger.png' }],
      });
    } catch (err) {
      return msg.reply(
        `Oh no, an error occurred: \`${err.message}\`. Try again later!`
      );
    }
  }

  silhouetteImage(image) {
    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0);
    silhouette(ctx, 0, 0, image.width, image.height);
    return canvas;
  }
***REMOVED***
