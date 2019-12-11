const { Command } = require('klasa');
const { createCanvas, loadImage } = require('canvas');
const path = require('path');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text', 'group'],
      requiredPermissions: ['EMBED_LINKS'],
      cooldown: 10,
      description: 'Karen wants to show you something',
      usage: '<user:member>',
    });
  }

  async run(msg, [user]) {
    const image = user.user.displayAvatarURL({ format: 'png', size: 512 });
    try {
      const base = await loadImage(
        path.join(__dirname, '..', '..', 'images', 'look-what-karen-have.png')
      );
      const avatar = await loadImage(image);
      const canvas = createCanvas(base.width, base.height);
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, base.width, base.height);
      ctx.rotate(-6.5 * (Math.PI / 180));
      ctx.drawImage(avatar, 514, 50, 512, 512);
      ctx.rotate(6.5 * (Math.PI / 180));
      ctx.drawImage(base, 0, 0);
      return msg.send({
        files: [
          { attachment: canvas.toBuffer(), name: 'look-what-karen-have.png' },
        ],
      });
    } catch (err) {
      return msg.reply(
        `Oh no, an error occurred: \`${err.message}\`. Try again later!`
      );
    }
  }
***REMOVED***
