const { Command } = require('klasa');
const { createCanvas, loadImage } = require('canvas');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text', 'group'],
      requiredPermissions: ['EMBED_LINKS'],
      cooldown: 10,
      description: 'Create a monstrosity',
      usage: '<overlay:user> <base:user>',
      usageDelim: ' ',
    });
  }

  async run(msg, [overlay, base]) {
    const overlayAvatarURL = overlay.displayAvatarURL({
      format: 'png',
      size: 512,
    });
    const baseAvatarURL = base.displayAvatarURL({ format: 'png', size: 512 });
    try {
      const baseAvatar = await loadImage(baseAvatarURL);
      const overlayAvatar = await loadImage(overlayAvatarURL);
      const canvas = createCanvas(baseAvatar.width, baseAvatar.height);
      const ctx = canvas.getContext('2d');
      ctx.globalAlpha = 0.5;
      ctx.drawImage(baseAvatar, 0, 0);
      ctx.drawImage(overlayAvatar, 0, 0, baseAvatar.width, baseAvatar.height);
      return msg.send({
        files: [{ attachment: canvas.toBuffer(), name: 'avatar-fusion.png' }],
      });
    } catch (err) {
      return msg.reply(
        `Oh no, an error occurred: \`${err.message}\`. Try again later!`
      );
    }
  }
***REMOVED***
