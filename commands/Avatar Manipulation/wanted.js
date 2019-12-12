const { Command } = require('klasa');
const { createCanvas, loadImage } = require('canvas');
const { sepia } = require('../../util/Canvas');
const path = require('path');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text', 'group'],
      cooldown: 10,
      description: 'If you kill this man, you have big brain',
      usage: '<user:member>',
    });
  }

  async run(msg, [user]) {
    const image = user.user.displayAvatarURL({ format: 'png', size: 512 });
    try {
      const base = await loadImage(
        path.join(__dirname, '..', '..', 'images', 'wanted.png')
      );
      const avatar = await loadImage(image);
      const canvas = createCanvas(base.width, base.height);
      const ctx = canvas.getContext('2d');
      ctx.drawImage(base, 0, 0);
      ctx.drawImage(avatar, 150, 360, 430, 430);
      sepia(ctx, 150, 360, 430, 430);
      return msg.send({
        files: [{ attachment: canvas.toBuffer(), name: 'wanted.png' }],
      });
    } catch (err) {
      return msg.reply(
        `Oh no, an error occurred: \`${err.message}\`. Try again later!`
      );
    }
  }
***REMOVED***
